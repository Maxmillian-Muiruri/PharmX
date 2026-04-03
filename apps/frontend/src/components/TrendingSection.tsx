import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface TrendingProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

const trendingProducts: TrendingProduct[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    price: 4.99,
    image: "https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Paracetamol",
  },
  {
    id: 2,
    name: "Vitamin C 1000mg",
    price: 12.99,
    image: "https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=Vitamin+C",
  },
  {
    id: 3,
    name: "Omega-3 Fish Oil",
    price: 18.99,
    image: "https://via.placeholder.com/300x300/45B7D1/FFFFFF?text=Omega-3",
  },
  {
    id: 4,
    name: "Hand Sanitizer 500ml",
    price: 6.99,
    image: "https://via.placeholder.com/300x300/F9A825/FFFFFF?text=Sanitizer",
  },
  {
    id: 5,
    name: "N95 Face Masks (10pk)",
    price: 9.99,
    image: "https://via.placeholder.com/300x300/95E1D3/FFFFFF?text=Masks",
  },
  {
    id: 6,
    name: "Blood Pressure Monitor",
    price: 45.99,
    image: "https://via.placeholder.com/300x300/A8E6CF/FFFFFF?text=BP+Monitor",
  },
];

export function TrendingSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        scrollerRef.current.scrollLeft +
        (direction === "right" ? scrollAmount : -scrollAmount);
      scrollerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-gray-900">
              🔥 Trending Right Now
            </h2>
            <p className="text-gray-600">Most ordered this week</p>
          </div>

          {/* Desktop Scroll Buttons */}
          <div className="hidden lg:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollerRef}
          className="overflow-x-auto scrollbar-hide flex gap-6 pb-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-56 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-500">
                  HOT
                </Badge>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="text-lg font-bold text-[#1a7a8c] mb-3">
                  ${product.price.toFixed(2)}
                </div>
                <Button
                  className="w-full bg-[#1a7a8c] hover:bg-[#155d6e] text-white rounded-lg flex items-center justify-center gap-2"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
