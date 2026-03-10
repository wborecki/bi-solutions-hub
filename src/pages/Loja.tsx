import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ProductCard } from "@/components/store/ProductCard";
import { CartButton } from "@/components/store/CartButton";
import { products, categories, getFeaturedProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Loja = () => {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === "todos" || p.category === activeCategory;
    const matchSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const featured = getFeaturedProducts();

  return (
    <Layout>
      <SEO
        title="Loja | Solutions in BI"
        description="E-books, camisetas, xícaras e acessórios para profissionais de dados e BI. Confira nossa loja exclusiva!"
        canonical="/loja"
      />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold font-display">Nossa Loja</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-xl">
                Produtos exclusivos para quem respira dados, BI e tecnologia.
              </p>
            </motion.div>
            <CartButton />
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={activeCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.value)}
                  className={cn(
                    "rounded-full",
                    activeCategory === cat.value && "shadow-md"
                  )}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured banner */}
          {activeCategory === "todos" && searchQuery === "" && featured.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Destaques</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featured.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          )}

          {/* All products */}
          <div>
            {activeCategory === "todos" && searchQuery === "" && (
              <h2 className="text-xl font-bold mb-4">Todos os Produtos</h2>
            )}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Nenhum produto encontrado.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setActiveCategory("todos"); setSearchQuery(""); }}>
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Loja;
