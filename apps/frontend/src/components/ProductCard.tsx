import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Render star ratings
  const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      <span className="text-yellow-500">{'★'.repeat(fullStars)}</span>
      {halfStar && <span className="text-yellow-500">☆</span>}
      <span className="text-gray-400">{'☆'.repeat(emptyStars)}</span>
      <span className="ml-1 text-sm text-gray-600">({rating})</span>
    </div>
  );
};
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 max-w-sm">
      {/* Product Image with Discount Badge */}
      <div className="relative mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md"
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.category}</p>
        <p className="text-sm text-gray-600">{product.use}</p>
        <div className="flex items-center justify-between">
        {renderStars(product.rating)}
        <span className={`px-3 py-1 text-xs font-bold rounded text-white ${product.stock === false ? 'bg-red-500' : 'bg-green-500'}`}>
            {product.stock === false ? 'Out of Stock' : 'In Stock'}
        </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            ${product.price.toFixed(2)}
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </span>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          disabled={product.stock === false}
        >
          {product.stock === false ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};