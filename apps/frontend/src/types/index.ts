export type TNodeChildrentType = {
  children: React.ReactNode;
};

export type TAppContextType = {};

export type Product = {
  id: string | number;
  name: string;
  image: string;
  category: string;
  use?: string;
  rating: number;
  price: number;
  discount?: number; 
  originalPrice?: number; 
  stock?: boolean;
  description?: string;
  reviewCount?: number;
  inStock?: boolean;
  stockStatus?: "in-stock" | "low-stock" | "out-of-stock";
};
