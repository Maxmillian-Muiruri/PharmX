import { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Phone,
  Mail
} from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Customer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface Address {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Order {
  orderNumber: string;
  status: string;
  orderDate: string;
  estimatedDelivery: string;
  customer: Customer;
  shippingAddress: Address;
  items: OrderItem[];
  total: number;
}

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

function OrderTrackingModal({
  isOpen,
  onClose,
  orderNumber
}: OrderTrackingModalProps) {
  const [orderData, setOrderData] = useState<Order | null>(null);

  const fetchOrderData = (orderNum: string) => {

    setTimeout(() => {
      const orders: Order[] = JSON.parse(
        localStorage.getItem('pharmacie_orders') || '[]'
      );

      const foundOrder = orders.find(
        (order) => order.orderNumber === orderNum
      );

      setOrderData(foundOrder || null);
    }, 1000);
  };

  useEffect(() => {
    if (isOpen && orderNumber) {
      fetchOrderData(orderNumber);
    }
  }, [isOpen, orderNumber]);

  if (!orderData) return null;

  const trackingStages = [
    {
      id: 1,
      title: 'Order Placed',
      icon: Package,
      status: 'completed',
      timestamp: orderData.orderDate,
    },
    {
      id: 2,
      title: 'Order Verified',
      icon: CheckCircle,
      status:
        orderData.status === 'Processing'
          ? 'current'
          : 'completed',
      timestamp: orderData.orderDate,
    },
    {
      id: 3,
      title: 'Preparing Order',
      icon: Package,
      status:
        orderData.status === 'Preparing'
          ? 'current'
          : orderData.status === 'Processing'
          ? 'pending'
          : 'completed',
      timestamp:
        orderData.status === 'Processing'
          ? 'Pending'
          : orderData.orderDate,
    },
    {
      id: 4,
      title: 'Out for Delivery',
      icon: Truck,
      status:
        orderData.status === 'Out for Delivery'
          ? 'current'
          : ['Processing', 'Preparing'].includes(orderData.status)
          ? 'pending'
          : 'completed',
      timestamp:
        orderData.status === 'Out for Delivery'
          ? 'In Transit'
          : 'Pending',
    },
    {
      id: 5,
      title: 'Delivered',
      icon: CheckCircle,
      status:
        orderData.status === 'Delivered'
          ? 'completed'
          : 'pending',
      timestamp:
        orderData.status === 'Delivered'
          ? orderData.estimatedDelivery
          : `Expected: ${orderData.estimatedDelivery}`,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'current':
        return 'text-blue-600 bg-blue-100 animate-pulse';
      default:
        return 'text-gray-400 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900">Track Your Order</h2>
        </div>

        <div className="space-y-6 p-6">
          {/* Order Info */}
          <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-mono font-semibold text-gray-900">{orderData.orderNumber}</p>
            </div>
            <span className="px-3 py-1 bg-teal-700 text-white rounded-full text-sm font-semibold\">{orderData.status}</span>
          </div>

          {/* Timeline */}
          {trackingStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="flex gap-4">
                <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${getStatusColor(stage.status)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{stage.title}</p>
                  <p className="text-sm text-gray-600">{stage.timestamp}</p>
                </div>
              </div>
            );
          })}

          <hr className="border-gray-200" />

          {/* Customer & Address Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-900">{orderData.customer.firstName} {orderData.customer.lastName}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{orderData.customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{orderData.customer.phone}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-teal-700" />
                  <div>
                    <p className="text-gray-900">{orderData.shippingAddress.address}</p>
                    <p className="text-gray-600">
                      {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Items */}
          <div className="space-y-2">
            {orderData.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-200 last:border-0">
                <span className="text-gray-900">{item.name}</span>
                <span className="font-semibold text-teal-700">${(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg">
            <span className="text-gray-900">Total</span>
            <span className="text-teal-700">${orderData.total.toFixed(2)}</span>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 px-4 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-600 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function TrackOrder() {
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setOrderNumber(inputValue.trim());
      setIsModalOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Track Your Order</h1>
          <p className="text-lg text-gray-600">Enter your order number below to track your pharmacy order status in real-time.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="order-number" className="block text-sm font-semibold text-gray-300 mb-2">
                Order Number
              </label>
              <div className="flex gap-3">
                <input
                  id="order-number"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g., ORD-2026-001234"
                  className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-8 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  Track
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-sm text-teal-700">
              <span className="font-semibold text-teal-900">💡 Tip:</span> Your order number is provided in your order confirmation email. You can track your pharmacy order status, estimated delivery date, and more.
            </p>
          </div>
        </div>
      </div>

      <OrderTrackingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderNumber={orderNumber}
      />
    </main>
  );
}
