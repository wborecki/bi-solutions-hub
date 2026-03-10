import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Product } from "@/types/store";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function avgRating(product: Product) {
  if (product.reviews.length === 0) return 0;
  return product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const rating = avgRating(product);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/loja/${product.slug}`} className="group block">
      <Card className="overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white border-none">
              -{discount}%
            </Badge>
          )}
          {product.digital && (
            <Badge variant="secondary" className="absolute top-3 right-3">
              Digital
            </Badge>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.category === "ebook" ? "E-book" : product.category === "camiseta" ? "Camiseta" : product.category === "xicara" ? "Xícara" : "Acessório"}
          </p>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

          {product.reviews.length > 0 && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${star <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">({product.reviews.length})</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
