import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const pagarmeApiKey = Deno.env.get("PAGARME_API_KEY");
    if (!pagarmeApiKey) {
      throw new Error("PAGARME_API_KEY not configured");
    }

    const body = await req.json();
    const { items, customer, payment, shipping } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Items are required");
    }
    if (!customer || !customer.name || !customer.email || !customer.document) {
      throw new Error("Customer info is required");
    }
    if (!payment || !payment.payment_method) {
      throw new Error("Payment method is required");
    }

    // Calculate total from items (server-side validation)
    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );

    if (totalAmount <= 0) {
      throw new Error("Invalid order total");
    }

    // Build Pagar.me order payload
    const orderPayload: Record<string, unknown> = {
      items: items.map((item: { name: string; quantity: number; price: number }) => ({
        amount: item.price,
        description: item.name,
        quantity: item.quantity,
        code: item.name.substring(0, 50),
      })),
      customer: {
        name: customer.name,
        email: customer.email,
        document: customer.document.replace(/\D/g, ""),
        phones: customer.phone
          ? {
              mobile_phone: {
                country_code: "55",
                area_code: customer.phone.replace(/\D/g, "").substring(0, 2),
                number: customer.phone.replace(/\D/g, "").substring(2),
              },
            }
          : undefined,
      },
      payments: [],
    };

    // Configure payment method
    if (payment.payment_method === "credit_card") {
      (orderPayload.payments as unknown[]).push({
        payment_method: "credit_card",
        credit_card: {
          recurrence: false,
          installments: payment.installments || 1,
          card: {
            number: payment.card_number?.replace(/\D/g, ""),
            holder_name: payment.card_holder_name,
            exp_month: parseInt(payment.card_expiry?.split("/")[0] || "0"),
            exp_year: parseInt(`20${payment.card_expiry?.split("/")[1] || "00"}`),
            cvv: payment.card_cvv,
          },
        },
      });
    } else if (payment.payment_method === "pix") {
      (orderPayload.payments as unknown[]).push({
        payment_method: "pix",
        pix: {
          expires_in: 3600, // 1 hour
        },
      });
    } else if (payment.payment_method === "boleto") {
      (orderPayload.payments as unknown[]).push({
        payment_method: "boleto",
        boleto: {
          instructions: "Pagar até o vencimento",
          due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });
    }

    // Add shipping if physical items
    if (shipping) {
      orderPayload.shipping = {
        amount: shipping.amount || 0,
        description: "Entrega padrão",
        address: {
          street: shipping.street,
          number: shipping.number,
          complement: shipping.complement || "",
          zip_code: shipping.zip_code?.replace(/\D/g, ""),
          city: shipping.city,
          state: shipping.state,
          country: "BR",
        },
      };
    }

    // Call Pagar.me API
    const pagarmeResponse = await fetch("https://api.pagar.me/core/v5/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(pagarmeApiKey + ":")}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const pagarmeData = await pagarmeResponse.json();

    if (!pagarmeResponse.ok) {
      console.error("Pagar.me error:", JSON.stringify(pagarmeData));
      throw new Error(pagarmeData.message || "Payment processing failed");
    }

    // Extract relevant info based on payment method
    const responseData: Record<string, unknown> = {
      order_id: pagarmeData.id,
      status: pagarmeData.status,
      amount: totalAmount,
    };

    const charge = pagarmeData.charges?.[0];
    if (charge) {
      const transaction = charge.last_transaction;
      if (payment.payment_method === "pix" && transaction) {
        responseData.pix_qr_code = transaction.qr_code;
        responseData.pix_qr_code_url = transaction.qr_code_url;
        responseData.pix_expires_at = transaction.expires_at;
      } else if (payment.payment_method === "boleto" && transaction) {
        responseData.boleto_url = transaction.url;
        responseData.boleto_barcode = transaction.barcode;
        responseData.boleto_due_at = transaction.due_at;
      } else if (payment.payment_method === "credit_card") {
        responseData.card_status = charge.status;
      }
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
