import { useState } from "react";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./fallbackImg/ImageWithFallback";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  inStock: boolean;
  prescription?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  const handleProductClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    navigate("/products", { state: { product: product } });
  };

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleProductClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-500">
              -{discountPercentage}%
            </Badge>
          )}

          {product.prescription && (
            <Badge className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-500">
              Rx
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </Button>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>

          <h3 className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <span
              className={`text-xs px-2 py-1 rounded ${
                product.inStock
                  ? "bg-cyan-100 text-cyan-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <Button
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
