// export const ProductDetail = () => {
//   return (
//     <div>
//       <h1>Product Detail</h1>
//     </div>
//   );
// };
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

interface Product {
  id: string
  name: string
  price: number
  rating: number
  reviewCount: number
  description: string
  imageUrl: string
  stockStatus: string
  deliveryTime: string
  shippingFee: string
  basicInfo: {
    productCode: string
    manufacturer: string
    activeIngredient: string
    form: string
  }
  productDetails: {
    packSize: string
    expiryDate: string
    batchNumber: string
    storage: string
  }
}

const fetchProduct = async (id: string): Promise<Product> => {
  
  const response = await fetch(`/api/products/${id}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  })

  if (isLoading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error loading product</div>

  return (
    <div className="max-w-7xl mx-auto p-4">
      <button
        className="mb-4 text-blue-600 hover:underline"
        onClick={() => window.history.back()}
      >
        Back to Products
      </button>
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={product?.imageUrl}
          alt={product?.name}
          className="w-full h-auto object-cover rounded"
        />
        <div>
          <h1 className="text-2xl font-semibold mb-2">{product?.name}</h1>
          <div className="flex items-center mb-2">
            <div className="text-yellow-400 mr-2">
              {'★'.repeat(Math.round(product?.rating ?? 0))}
            </div>
            <span className="text-sm text-gray-600">{product?.reviewCount} reviews</span>
          </div>
          <p className="text-xl font-bold mb-2">${product?.price.toFixed(2)}</p>
          <div className="mb-4">
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded">
              {product?.stockStatus}
            </span>
          </div>
          <div className="mb-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Product Details</h2>
            <p className="mb-1">
              <strong>Delivery Time:</strong> {product?.deliveryTime}
            </p>
            <p className="mb-1">
              <strong>Shipping Fee:</strong> {product?.shippingFee}
            </p>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Product Information</h3>
            <ul className="list-disc list-inside mb-4">
              <li>
                <strong>Product Code:</strong> {product?.basicInfo.productCode}
              </li>
              <li>
                <strong>Manufacturer:</strong> {product?.basicInfo.manufacturer}
              </li>
              <li>
                <strong>Active Ingredient:</strong> {product?.basicInfo.activeIngredient}
              </li>
              <li>
                <strong>Form:</strong> {product?.basicInfo.form}
              </li>
            </ul>
            <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
            <ul className="list-disc list-inside">
              <li>
                <strong>Pack Size:</strong> {product?.productDetails.packSize}
              </li>
              <li>
                <strong>Expiry Date:</strong> {product?.productDetails.expiryDate}
              </li>
              <li>
                <strong>Batch Number:</strong> {product?.productDetails.batchNumber}
              </li>
              <li>
                <strong>Storage:</strong> {product?.productDetails.storage}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail