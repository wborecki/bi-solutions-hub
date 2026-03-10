import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

const Carrinho = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <SEO title="Carrinho | Solutions in BI" description="Seu carrinho de compras." canonical="/loja/carrinho" />
        <section className="pt-32 md:pt-40 pb-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-3">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-8">Explore nossa loja e encontre produtos incríveis!</p>
            <Link to="/loja">
              <Button className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Ir para a Loja
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Carrinho | Solutions in BI" description="Carrinho de compras" canonical="/loja/carrinho" />
      <section className="pt-32 md:pt-40 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold font-display flex items-center gap-3">
              <ShoppingCart className="h-7 w-7 text-primary" />
              Carrinho ({items.length} {items.length === 1 ? "item" : "itens"})
            </h1>
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground hover:text-destructive">
              Limpar Carrinho
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => {
                const optionsText = Object.entries(item.selectedOptions)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" | ");

                return (
                  <motion.div
                    key={`${item.product.id}-${JSON.stringify(item.selectedOptions)}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 border rounded-xl p-4"
                  >
                    <Link to={`/loja/${item.product.slug}`} className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={item.product.images[0]?.url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/loja/${item.product.slug}`} className="font-semibold hover:text-primary transition-colors line-clamp-1">
                        {item.product.name}
                      </Link>
                      {optionsText && (
                        <p className="text-xs text-muted-foreground mt-0.5">{optionsText}</p>
                      )}
                      <p className="text-primary font-bold mt-1">{formatPrice(item.product.price)}</p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.selectedOptions, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.selectedOptions, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold">{formatPrice(item.product.price * item.quantity)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.product.id, item.selectedOptions)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="border rounded-xl p-6 space-y-4 sticky top-28">
                <h3 className="font-bold text-lg">Resumo do Pedido</h3>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-green-600 font-medium">A calcular</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
                <Link to="/loja/checkout" className="block">
                  <Button className="w-full h-12 text-base font-semibold gap-2">
                    Finalizar Compra
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/loja" className="block">
                  <Button variant="outline" className="w-full">
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Carrinho;
