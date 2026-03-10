import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard, QrCode, Barcode, ChevronLeft, ShieldCheck, Lock, Loader2, CheckCircle2, Copy,
} from "lucide-react";
import { motion } from "framer-motion";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function maskCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .substring(0, 14);
}

function maskPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15);
}

function maskCEP(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 9);
}

function maskCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .substring(0, 19);
}

function maskCardExpiry(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .substring(0, 5);
}

type PaymentMethod = "credit_card" | "pix" | "boleto";
type Step = "info" | "payment" | "done";

interface PaymentResult {
  order_id: string;
  status: string;
  pix_qr_code?: string;
  pix_qr_code_url?: string;
  boleto_url?: string;
  boleto_barcode?: string;
}

const Checkout = () => {
  const { items, totalPrice, hasPhysicalItems, clearCart } = useCart();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("info");
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  // Customer
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  // Address
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState(1);

  if (items.length === 0 && step !== "done") {
    return <Navigate to="/loja/carrinho" replace />;
  }

  const validateInfo = () => {
    if (!name.trim() || !email.trim() || !cpf.trim() || !phone.trim()) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Email inválido", variant: "destructive" });
      return false;
    }
    if (cpf.replace(/\D/g, "").length !== 11) {
      toast({ title: "CPF inválido", variant: "destructive" });
      return false;
    }
    if (hasPhysicalItems && (!street.trim() || !number.trim() || !city.trim() || !state.trim() || !zipCode.trim())) {
      toast({ title: "Preencha o endereço para produtos físicos", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmitPayment = async () => {
    if (paymentMethod === "credit_card") {
      if (!cardNumber.trim() || !cardName.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        toast({ title: "Preencha os dados do cartão", variant: "destructive" });
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        items: items.map((item) => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        customer: {
          name,
          email,
          document: cpf.replace(/\D/g, ""),
          phone: phone.replace(/\D/g, ""),
        },
        payment: {
          payment_method: paymentMethod,
          ...(paymentMethod === "credit_card" && {
            card_number: cardNumber.replace(/\D/g, ""),
            card_holder_name: cardName,
            card_expiry: cardExpiry,
            card_cvv: cardCvv,
            installments,
          }),
        },
        ...(hasPhysicalItems && {
          shipping: {
            amount: 0,
            street,
            number,
            complement,
            neighborhood,
            zip_code: zipCode.replace(/\D/g, ""),
            city,
            state,
          },
        }),
      };

      const { data, error } = await supabase.functions.invoke("process-payment", {
        body: payload,
      });

      if (error) throw error;

      setPaymentResult(data);
      setStep("done");
      clearCart();

      toast({ title: "Pedido realizado com sucesso!" });
    } catch (err) {
      console.error("Payment error:", err);
      toast({
        title: "Erro ao processar pagamento",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const maxInstallments = Math.min(12, Math.floor(totalPrice / 1000)); // min R$10 per installment

  return (
    <Layout>
      <SEO title="Checkout | Solutions in BI" description="Finalize sua compra." canonical="/loja/checkout" />

      <section className="pt-28 md:pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/loja/carrinho" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ChevronLeft className="h-4 w-4" /> Voltar ao carrinho
          </Link>

          {/* Steps indicator */}
          <div className="flex items-center gap-4 mb-8">
            {[
              { key: "info", label: "Dados" },
              { key: "payment", label: "Pagamento" },
              { key: "done", label: "Confirmação" },
            ].map((s, i) => {
              const isActive = s.key === step;
              const isDone =
                (step === "payment" && s.key === "info") ||
                (step === "done" && (s.key === "info" || s.key === "payment"));
              return (
                <div key={s.key} className="flex items-center gap-2">
                  {i > 0 && <div className={`w-8 h-px ${isDone || isActive ? "bg-primary" : "bg-border"}`} />}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isDone
                        ? "bg-primary text-primary-foreground"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-sm font-medium ${isActive || isDone ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              {/* Step 1: Customer Info */}
              {step === "info" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Dados Pessoais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo *</Label>
                          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail *</Label>
                          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cpf">CPF *</Label>
                          <Input id="cpf" value={cpf} onChange={(e) => setCpf(maskCPF(e.target.value))} placeholder="000.000.000-00" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone *</Label>
                          <Input id="phone" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} placeholder="(11) 99999-9999" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {hasPhysicalItems && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="street">Rua *</Label>
                            <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Nome da rua" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="number">Número *</Label>
                            <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="123" />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="complement">Complemento</Label>
                            <Input id="complement" value={complement} onChange={(e) => setComplement(e.target.value)} placeholder="Apto, Bloco..." />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="neighborhood">Bairro</Label>
                            <Input id="neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Bairro" />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">CEP *</Label>
                            <Input id="zipCode" value={zipCode} onChange={(e) => setZipCode(maskCEP(e.target.value))} placeholder="00000-000" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">Cidade *</Label>
                            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Cidade" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">Estado *</Label>
                            <Input id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="SP" maxLength={2} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button className="w-full h-12 text-base font-semibold" onClick={() => validateInfo() && setStep("payment")}>
                    Continuar para Pagamento
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === "payment" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        Método de Pagamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                        className="space-y-3"
                      >
                        <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <RadioGroupItem value="credit_card" />
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold text-sm">Cartão de Crédito</p>
                            <p className="text-xs text-muted-foreground">Até {Math.max(1, maxInstallments)}x sem juros</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <RadioGroupItem value="pix" />
                          <QrCode className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold text-sm">PIX</p>
                            <p className="text-xs text-muted-foreground">Aprovação instantânea</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <RadioGroupItem value="boleto" />
                          <Barcode className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold text-sm">Boleto Bancário</p>
                            <p className="text-xs text-muted-foreground">Vencimento em 3 dias úteis</p>
                          </div>
                        </label>
                      </RadioGroup>

                      {/* Credit card fields */}
                      {paymentMethod === "credit_card" && (
                        <div className="space-y-4 pt-2">
                          <Separator />
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Número do Cartão</Label>
                            <Input
                              id="cardNumber"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
                              placeholder="0000 0000 0000 0000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardName">Nome no Cartão</Label>
                            <Input
                              id="cardName"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value.toUpperCase())}
                              placeholder="NOME COMO NO CARTÃO"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardExpiry">Validade</Label>
                              <Input
                                id="cardExpiry"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(maskCardExpiry(e.target.value))}
                                placeholder="MM/AA"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cardCvv">CVV</Label>
                              <Input
                                id="cardCvv"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").substring(0, 4))}
                                placeholder="123"
                                type="password"
                              />
                            </div>
                          </div>
                          {maxInstallments > 1 && (
                            <div className="space-y-2">
                              <Label>Parcelas</Label>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {Array.from({ length: maxInstallments }, (_, i) => i + 1).map((n) => (
                                  <Button
                                    key={n}
                                    variant={installments === n ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setInstallments(n)}
                                    className="text-xs"
                                  >
                                    {n}x {formatPrice(Math.ceil(totalPrice / n))}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("info")} className="flex-1">
                      Voltar
                    </Button>
                    <Button
                      onClick={handleSubmitPayment}
                      disabled={loading}
                      className="flex-1 h-12 text-base font-semibold gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          Pagar {formatPrice(totalPrice)}
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {step === "done" && paymentResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <Card>
                    <CardContent className="pt-8 text-center space-y-4">
                      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                      <h2 className="text-2xl font-bold">Pedido Realizado!</h2>
                      <p className="text-muted-foreground">
                        Pedido <strong>#{paymentResult.order_id}</strong>
                      </p>

                      {paymentMethod === "credit_card" && (
                        <p className="text-green-600 font-medium">Pagamento aprovado! Você receberá a confirmação por e-mail.</p>
                      )}

                      {paymentMethod === "pix" && paymentResult.pix_qr_code && (
                        <div className="space-y-4">
                          <p className="text-muted-foreground">Escaneie o QR Code ou copie o código PIX:</p>
                          {paymentResult.pix_qr_code_url && (
                            <img src={paymentResult.pix_qr_code_url} alt="QR Code PIX" className="mx-auto w-48 h-48" />
                          )}
                          <div className="flex items-center gap-2 max-w-md mx-auto">
                            <Input value={paymentResult.pix_qr_code} readOnly className="text-xs" />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                navigator.clipboard.writeText(paymentResult.pix_qr_code || "");
                                toast({ title: "Código copiado!" });
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "boleto" && paymentResult.boleto_url && (
                        <div className="space-y-3">
                          <p className="text-muted-foreground">Boleto gerado com sucesso!</p>
                          <a href={paymentResult.boleto_url} target="_blank" rel="noopener noreferrer">
                            <Button className="gap-2">
                              <Barcode className="h-4 w-4" />
                              Abrir Boleto
                            </Button>
                          </a>
                          {paymentResult.boleto_barcode && (
                            <div className="flex items-center gap-2 max-w-md mx-auto">
                              <Input value={paymentResult.boleto_barcode} readOnly className="text-xs" />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  navigator.clipboard.writeText(paymentResult.boleto_barcode || "");
                                  toast({ title: "Código de barras copiado!" });
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Link to="/loja" className="flex-1">
                      <Button variant="outline" className="w-full">Voltar à Loja</Button>
                    </Link>
                    <Link to="/" className="flex-1">
                      <Button className="w-full">Ir para o Início</Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order summary sidebar */}
            {step !== "done" && (
              <div className="lg:col-span-1">
                <div className="border rounded-xl p-6 space-y-4 sticky top-28">
                  <h3 className="font-bold text-lg">Seu Pedido</h3>
                  <Separator />
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${JSON.stringify(item.selectedOptions)}`} className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img src={item.product.images[0]?.url} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                          <p className="text-sm font-semibold text-primary">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    Pagamento seguro via Pagar.me
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
