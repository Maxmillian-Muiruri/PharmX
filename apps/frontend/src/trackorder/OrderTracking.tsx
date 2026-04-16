import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, CheckCircle, Clock, Search, MapPin, Phone, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { getStoredOrderById } from '../utils/prescriptions';
import type { StoredOrder } from '../types';

interface TimelineStep {
  status: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  active?: boolean;
}

interface OrderData {
  orderNumber: string;
  status: string;
  orderDate: string;
  estimatedDelivery: string;
  currentLocation: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  customer: { name: string; phone: string; email: string };
  shippingAddress: { street: string; city: string; state: string; zipCode: string };
  timeline: TimelineStep[];
  total: number;
}

function mapStoredOrderToOrderData(stored: StoredOrder): OrderData {
  const timeline: TimelineStep[] = [
    {
      status: 'placed',
      title: 'Order Placed',
      description: 'Your order has been received',
      timestamp: stored.date,
      completed: true,
    },
    {
      status: 'confirmed',
      title: 'Payment Confirmed',
      description: 'Payment successfully processed',
      timestamp: stored.date,
      completed: true,
    },
    {
      status: 'processing',
      title: 'Processing Order',
      description: 'Pharmacist is preparing your medicines',
      timestamp: stored.date,
      completed: ['Processing', 'In Progress', 'On the Way', 'Delivered'].includes(stored.status),
      active: stored.status === 'Processing' || stored.status === 'In Progress',
    },
    {
      status: 'shipped',
      title: 'Out for Delivery',
      description: 'Your order is on the way',
      timestamp: '',
      completed: ['On the Way', 'Delivered'].includes(stored.status),
      active: stored.status === 'On the Way',
    },
    {
      status: 'delivered',
      title: 'Delivered',
      description: 'Order successfully delivered',
      timestamp: stored.status === 'Delivered' ? stored.estimatedDelivery : '',
      completed: stored.status === 'Delivered',
    },
  ];

  return {
    orderNumber: stored.id,
    status: stored.status === 'On the Way' ? 'shipped' : stored.status === 'Delivered' ? 'delivered' : stored.status === 'Processing' ? 'processing' : stored.status === 'In Progress' ? 'processing' : 'placed',
    orderDate: stored.date,
    estimatedDelivery: stored.estimatedDelivery,
    currentLocation: stored.status === 'On the Way' ? 'Out for Delivery' : 'Pharmacy Warehouse',
    items: stored.items,
    customer: {
      name: `${stored.shippingInfo.firstName} ${stored.shippingInfo.lastName}`,
      phone: stored.shippingInfo.phone,
      email: stored.shippingInfo.email,
    },
    shippingAddress: {
      street: stored.shippingInfo.street,
      city: stored.shippingInfo.city,
      state: stored.shippingInfo.state,
      zipCode: stored.shippingInfo.zip,
    },
    timeline,
    total: stored.total,
  };
}

function getStatusBadge(status: string) {
  const badges: Record<string, { text: string; className: string }> = {
    placed: { text: 'Order Placed', className: 'bg-gray-100 text-gray-800' },
    confirmed: { text: 'Payment Confirmed', className: 'bg-cyan-100 text-cyan-800' },
    processing: { text: 'Processing', className: 'bg-yellow-100 text-yellow-800' },
    shipped: { text: 'Out for Delivery', className: 'bg-blue-100 text-blue-800' },
    delivered: { text: 'Delivered', className: 'bg-green-100 text-green-800' },
    cancelled: { text: 'Cancelled', className: 'bg-red-100 text-red-800' },
  };

  const badge = badges[status] || badges.placed;
  return <Badge className={badge.className}>{badge.text}</Badge>;
}

export function TrackOrder() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [orderNumber, setOrderNumber] = useState('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (id) {
      setOrderNumber(id);
      const stored = getStoredOrderById(id);
      if (stored) {
        setOrderData(mapStoredOrderToOrderData(stored));
      }
      setSearched(true);
    }
  }, [id]);

  const fetchOrderData = (orderNum: string) => {
    setIsLoading(true);
    setSearched(true);

    setTimeout(() => {
      const stored = getStoredOrderById(orderNum);
      if (stored) {
        setOrderData(mapStoredOrderToOrderData(stored));
      } else {
        setOrderData(null);
      }
      setIsLoading(false);
    }, 800);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      fetchOrderData(orderNumber.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <h1 className="text-4xl mb-2 text-slate-900 font-bold">Track Your Order</h1>
          <p className="text-lg text-slate-600">
            Enter your order number to see real-time updates
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Enter your order number (e.g., ORD-XXXXXXXXXX)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={isLoading || !orderNumber.trim()}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Track Order
                    </>
                  )}
                </Button>
              </div>

              {!orderData && !isLoading && searched && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">
                    No order found with that number. Please check and try again.
                  </p>
                </div>
              )}

              {!searched && !isLoading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    💡 Enter an order number from your order confirmation to track it here.
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {orderData && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#0d4f5c]/10 rounded-full p-2">
                      <Package className="h-5 w-5 text-[#0d4f5c]" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Order Number</p>
                      <p className="font-mono font-medium">{orderData.orderNumber}</p>
                    </div>
                  </div>
                  {getStatusBadge(orderData.status)}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Estimated Delivery</p>
                      <p className="font-medium">{orderData.estimatedDelivery}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">From order placement</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Current Location</p>
                      <p className="font-medium">{orderData.currentLocation}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">Last updated: just now</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {orderData.timeline.map((step, index) => (
                    <div key={step.status} className="flex gap-4 pb-8 last:pb-0">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? step.active
                                ? 'bg-[#0d4f5c] ring-4 ring-[#0d4f5c]/20'
                                : 'bg-cyan-600'
                              : 'bg-slate-200'
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="h-5 w-5 text-white" />
                          ) : (
                            <Clock className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        {index < orderData.timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-16 ${
                              step.completed ? 'bg-cyan-600' : 'bg-slate-200'
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className={`font-medium ${step.active ? 'text-[#0d4f5c]' : ''}`}>
                            {step.title}
                          </h4>
                          {step.timestamp && (
                            <span className="text-sm text-slate-500">{step.timestamp}</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{step.description}</p>
                        {step.active && (
                          <Badge className="mt-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            ⏳ In Progress
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orderData.items.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">KES{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        {index < orderData.items.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-medium">Total</span>
                      <span className="text-lg text-[#0d4f5c] font-medium">KES{orderData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Delivering To</p>
                      <p className="font-medium">{orderData.customer.name}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {orderData.shippingAddress.street}
                      </p>
                      <p className="text-sm text-slate-500">
                        {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-sm text-slate-500 mb-2">Contact Information</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-slate-500" />
                        <span>{orderData.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-slate-500" />
                        <span>{orderData.customer.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-cyan-50 border-cyan-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-cyan-900 mb-2">Need Help with Your Order?</h3>
                    <p className="text-sm text-cyan-800">
                      Our customer support team is available 24/7 to assist you
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="border-cyan-300">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Support
                    </Button>
                    <Button variant="outline" className="border-cyan-300">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Us
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}