export type TNodeChildrentType = {
  children: React.ReactNode;
};

export type TAppContextType = {};

export type Product = {
  id: string;
  name: string;
  image: string;
  category: string;
  use: string;
  rating: number;
  price: number;
  discount?: number; 
  originalPrice?: number; 
  stock?: boolean; 
};
