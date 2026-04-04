import { useState } from 'react';
import { ProductCard } from '../../components/ProductCard';
import type { Product } from '../../types';

export const ProductList = () => {
  const [products] = useState<Product[]>([
    
  {
    "id": "1",
    "name": "Paracetamol 500mg Tablets",
    "image": "src/assets/products/paracetamol.jpg",
    "category": "Pain Relief",
    "use": "Effective pain relief and fever reducer.Pack of 20 tablets",
    "rating": 4.5,
    "price": 8.99,
    "discount": 31,
    "originalPrice": 12.99,
    "stock": true
  },
  {
    "id": "2",
    "name": "Ibuprofen 400mg Tablets",
    "image": "src/assets/products/ibuprofen.jpg",
    "category": "Pain Relief",
    "use": "Anti-inflammatory pain relief.Pack of 24 tablets",
    "rating": 4.6,
    "price": 10.99,
    "discount": 27,
    "originalPrice": 14.99,
    "stock": true
  },
  {
    "id": "3",
    "name": "Aspirin 75mg Low Dose",
    "image": "src/assets/products/aspirin.jpg",
    "category": "Cardiovascular",
    "use": "Daily cardiovascular support.Pack of 28 tablets",
    "rating": 4.4,
    "price": 6.99,
    "stock": true
  },
  {
    "id": "4",
    "name": "Antihistamine Tablets",
    "image": "src/assets/products/antihistamine.jpg",
    "category": "Allergy",
    "use": "Allergy relief.non-drowsey formula.Pack of 30 tablets",
    "rating": 4.7,
    "price": 12.99,
    "stock": true
  },
  {
    "id": "5",
    "name": "Cough Syrup 200ml",
    "image": "src/assets/products/cough_syrup.jpg",
    "category": "Cold & Flu",
    "use": "Relief from dry and chesty cough.Honey and lemon flavor.",
    "rating": 4.3,
    "price": 9.99,
    "stock": true
  },
  {
    "id": "6",
    "name": "Antibiotic Cream 30g",
    "image": "src/assets/products/antibiotic_cream.jpg",
    "category": "First Aid",
    "use": "Topical antibiotic for minor cuts and wounds",
    "rating": 4.5,
    "price": 7.99,
    "originalPrice": 10.99,
    "discount": 27,
    "stock": true
  },
  {
    "id": "7",
    "name": "Stomach Relief Tablets",
    "image": "src/assets/products/stomach_relief.jpg",
    "category": "Digestive Health",
    "use": "Relieves from dry and chesty coughs. Honey and lemon flavor.Pack of 24 tablets",
    "rating": 4.6,
    "price": 11.99,
    "stock": false
  },
  {
    "id": "8",
    "name": "Eye Drops 10ml",
    "image": "src/assets/products/eye_drops.jpg",
    "category": "Eye Care",
    "use": "Soothing Relief for dry, irritated eyes",
    "rating": 4.4,
    "price": 8.99
  },
  {
    "id": "9",
    "name": "Vitamin D3 2000 IU Capsules",
    "image": "src/assets/products/vitamin_d3.jpg",
    "category": "Vitamins",
    "use": "Supports bone health and immune system. 60 capsules",
    "rating": 4.8,
    "price": 24.99,
    "stock": true
  },
  {
    "id": "10",
    "name": "Multivitamin Complex",
    "image": "src/assets/products/multivitamin.jpg",
    "category": "Vitamins",
    "use": "Complete daily vitamin and mineral supplement.90 tablets",
    "rating": 4.7,
    "price": 29.99,
    "originalPrice": 39.99,
    "discount": 25,
    "stock": true
  },
  {
    "id": "11",
    "name": "Omega-3 Fish Oil Capsules",
    "image": "src/assets/products/omega3.jpg",
    "category": "Supplements",
    "use": "High quality fish oil supplement.120 softgels",
    "rating": 4.6,
    "price": 29.99,
    "stock": true
  },
  {
    "id": "12",
    "name": "Probiotics 30 Billion CFU",
    "image": "src/assets/products/probiotics.jpg",
    "category": "Supplements",
    "use": "Digestive health support. 30 vegeterian capsules",
    "rating": 4.7,
    "price": 34.99,
    "stock": true
  },
  {
    "id": "13",
    "name": "Protein Powder 1kg",
    "image": "src/assets/products/protein.jpg",
    "category": "Sports Nutrition",
    "use": "Whey protein isolate, chocolate flavor 30 servings",
    "rating": 4.6,
    "price": 49.99,
    "originalPrice": 59.99,
    "discount": 17,
    "stock": true
  },
  {
    "id": "14",
    "name": "Calcium + Magnesium Tablets",
    "image": "src/assets/products/calcium.jpg",
    "category": "Vitamins",
    "use": "Bone and muscle health support. 100 tablets",
    "rating": 4.5,
    "price": 19.99,
    "stock": true
  },
  {
    "id": "15",
    "name": "Blood Pressure Monitor",
    "image": "src/assets/products/bp_monitor.jpg",
    "category": "Health Devices",
    "use": "Digital and automatic blood pressure monitor with large display ",
    "rating": 4.6,
    "price": 89.99,
    "originalPrice": 114.99,
    "discount": 22,
    "stock": true
  },
  {
    "id": "16",
    "name": "Digital Thermometer",
    "image": "src/assets/products/thermometer.jpg",
    "category": "Health Devices",
    "use": "Fast and accurate digital thermometer oral/underarm use",
    "rating": 4.2,
    "price": 19.99,
    "stock": true
  },
  {
    "id": "17",
    "name": "Pulse Oximeter",
    "image": "src/assets/products/oximeter.jpg",
    "category": "Health Devices",
    "use": "Finger tip pulse oximeter with LED display",
    "rating": 4.7,
    "price": 34.99,
    "stock": true
  },
  {
    "id": "18",
    "name": "Antiseptic Hand Sanitizer",
    "image": "src/assets/products/sanitizer.jpg",
    "category": "Personal Care",
    "use": "70% alcohol-based hand sanitizer. 500ml bottle",
    "rating": 4.5,
    "price": 12.99,
    "stock": true
  },
  {
    "id": "19",
    "name": "Face Masks Box of 50",
    "image": "src/assets/products/masks.jpg",
    "category": "Personal Care",
    "use": "3-ply disposable face masks, blue",
    "rating": 4.4,
    "price": 14.99,
    "stock": true
  },
  {
    "id": "20",
    "name": "First Aid Kit",
    "image": "src/assets/products/first_aid.jpg",
    "category": "First Aid",
    "use": "Comprehensive fast hand kit with 100 pieces",
    "rating": 4.8,
    "price": 39.99,
    "stock": true
  },
  {
    "id": "21",
    "name": "Baby Formula Powder",
    "image": "src/assets/products/baby_formula.jpg",
    "category": "Baby Care",
    "use": "Nutritionally complete infant formula, 900g container",
    "rating": 4.9,
    "price": 34.99,
    "stock": true
  },
  {
    "id": "22",
    "name": "Baby Diapers Size 3",
    "image": "src/assets/products/baby_diapers.jpg",
    "category": "Baby Care",
    "use": "Ultra-soft, absorbent diapers. Pack of 68",
    "rating": 4.6,
    "price": 29.99,
    "stock": true
  },
  {
    "id": "23",
    "name": "Vitamin C 1000mg Tablets",
    "image": "src/assets/products/vitamin_c.jpg",
    "category": "Vitamins",
    "use": "Immune system support, 100 tablets",
    "rating": 4.8,
    "price": 16.99,
    "stock": true
  },
  {
    "id": "24",
    "name": "Melatonin 5mg Gummies",
    "image": "src/assets/products/melatonin.jpg",
    "category": "Supplements",
    "use": "Sleep support supplement, berry flavor, 60 gummies",
    "rating": 4.5,
    "price": 18.99,
    "stock": false
  }

  ]);

  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product);
    // TODO: Integrate with cart logic
  };

  return (
    <div>
      <h1>Product List</h1>
      <h2>Browse our complete range of medicine and health products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};
