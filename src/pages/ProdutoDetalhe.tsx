import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductReviews } from "@/components/store/ProductReviews";
import { ProductCard } from "@/components/store/ProductCard";
import { CartButton } from "@/components/store/CartButton";
import { getProductBySlug, products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart, Minus, Plus, Star, ChevronLeft, Truck, ShieldCheck, Download, Package,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script,iframe,object,embed,form,link,style").forEach((el) => el.remove());
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith("on") || attr.value.startsWith("javascript:")) {
        el.removeAttribute(attr.name);
      }
    }
  });
  return doc.body.innerHTML;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

const ProdutoDetalhe = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  if (!product) {
    return (
      <Layout>
        <div className="pt-32 pb-20 text-center max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <p className="text-muted-foreground mb-6">O produto que você procura não existe ou foi removido.</p>
          <Link to="/loja">
            <Button>Voltar para a Loja</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const allOptionsSelected = product.options.every(
    (opt) => selectedOptions[opt.name] && selectedOptions[opt.name].length > 0
  );

  const canAdd = product.options.length === 0 || allOptionsSelected;

  const handleAddToCart = () => {
    if (!canAdd) return;
    addItem(product, quantity, selectedOptions);
  };

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <Layout>
      <SEO
        title={`${product.name} | Loja Solutions in BI`}
        description={product.description}
        canonical={`/loja/${product.slug}`}
      />

      <section className="pt-28 md:pt-36 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/loja" className="hover:text-primary transition-colors flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" /> Loja
              </Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </div>
            <CartButton />
          </div>

          {/* Product grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <ProductGallery images={product.images} />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category === "ebook" ? "E-book" : product.category === "camiseta" ? "Camiseta" : product.category === "xicara" ? "Xícara" : "Acessório"}
                  </Badge>
                  {product.digital && <Badge variant="outline" className="text-xs">Digital</Badge>}
                  {discount > 0 && <Badge className="bg-red-500 border-none text-xs">-{discount}%</Badge>}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-display">{product.name}</h1>

                {product.reviews.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {avgRating.toFixed(1)} ({product.reviews.length} {product.reviews.length === 1 ? "avaliação" : "avaliações"})
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  ou até <strong>3x de {formatPrice(Math.ceil(product.price / 3))}</strong> sem juros
                </p>
              </div>

              <Separator />

              {/* Options */}
              {product.options.map((option) => (
                <div key={option.name} className="space-y-2">
                  <label className="text-sm font-semibold">
                    {option.name}: <span className="text-primary">{selectedOptions[option.name] || "Selecione"}</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {option.values.map((value) => (
                      <Button
                        key={value}
                        variant={selectedOptions[option.name] === value ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))
                        }
                        className={cn(
                          "rounded-full min-w-[3rem]",
                          selectedOptions[option.name] === value && "shadow-md"
                        )}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={!canAdd}
                  className="flex-1 h-12 text-base font-semibold gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Adicionar ao Carrinho
                </Button>
              </div>

              {!canAdd && product.options.length > 0 && (
                <p className="text-sm text-amber-600">Selecione todas as opções antes de adicionar.</p>
              )}

              {/* Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {product.digital ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="h-4 w-4 text-primary" />
                    Acesso Imediato
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    Frete Calculado
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Compra Segura
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4 text-primary" />
                  {product.stock > 0 ? "Em Estoque" : "Esgotado"}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs: Descrição + Avaliações */}
          <div className="mt-16">
            <Tabs defaultValue="descricao">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="descricao">Descrição</TabsTrigger>
                <TabsTrigger value="avaliacoes">
                  Avaliações ({product.reviews.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="descricao" className="mt-6">
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.longDescription) }}
                />
              </TabsContent>
              <TabsContent value="avaliacoes" className="mt-6">
                <ProductReviews reviews={product.reviews} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold mb-6">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProdutoDetalhe;
