import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import {
  clearCheckoutPrescriptionId,
  getCheckoutPrescriptionId,
  getPrescriptionById,
  saveOrder,
} from '../../utils/prescriptions';
import type { StoredOrder } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;
type PaymentMethod = 'Credit/Debit Card' | 'M-Pesa' | null;
type DeliveryOption = 'standard' | 'express';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface CardInfo {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

interface MpesaInfo {
  phoneNumber: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genOrderId() {
  return 'ORD-' + Math.random().toString(36).toUpperCase().slice(2, 11);
}

function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, ' ').trim();
}

function formatMpesaNumber(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 12);
  if (digits.startsWith('254')) {
    return digits;
  } else if (digits.startsWith('0')) {
    return '254' + digits.slice(1);
  } else if (digits.startsWith('7')) {
    return '2547' + digits.slice(1);
  } else if (digits.startsWith('1')) {
    return '2541' + digits.slice(1);
  }
  return digits;
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { n: 1 as Step, label: 'Shipping' },
    { n: 2 as Step, label: 'Payment' },
    { n: 3 as Step, label: 'Review' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
      {steps.map((s, idx) => {
        const done    = current > s.n;
        const active  = current === s.n;
        return (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? '#0d4f5c' : active ? '#0d4f5c' : '#e2e8f0',
                color: done || active ? '#fff' : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
              }}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : s.n}
              </div>
              <span style={{ fontSize: 11, color: done || active ? '#0d4f5c' : '#94a3b8', fontWeight: active ? 600 : 400 }}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{ width: 80, height: 2, background: current > s.n ? '#0d4f5c' : '#e2e8f0', margin: '0 4px', marginBottom: 18 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Order Summary Sidebar ────────────────────────────────────────────────────

function OrderSidebar({
  items,
  delivery,
}: {
  items: Array<{ name: string; quantity: number; unitPrice: number; image?: string }>;
  delivery: number;
}) {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const tax      = Math.round(subtotal * 0.08 * 100) / 100;
  const total    = subtotal + delivery + tax;

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: 16,
      padding: '1.25rem',
      background: '#fff',
      position: 'sticky',
      top: 16,
    }}>
      <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: '#0d4f5c', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #e2e8f0' }}>
        Order Summary
      </h3>

      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 44 }}>
            {item.image ? (
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#12251e' }}>{item.name}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Qty: {item.quantity}</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0d4f5c' }}>
            KES{(item.unitPrice * item.quantity).toFixed(2)}
          </div>
        </div>
      ))}

      <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 12, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[
          { label: 'Subtotal', value: `KES${subtotal.toFixed(2)}` },
          { label: 'Delivery', value: delivery === 0 ? 'Free' : `KES${delivery.toFixed(2)}` },
          { label: 'Tax',      value: `KES${tax.toFixed(2)}` },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: '#64748b' }}>{row.label}</span>
            <span style={{ color: '#12251e', fontWeight: 500 }}>{row.value}</span>
          </div>
        ))}

        <div style={{ borderTop: '1px dashed #e2e8f0', marginTop: 4, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: '#0d4f5c' }}>Total</span>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: '#0d4f5c' }}>KES{total.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Secure 256-bit SSL encryption
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 4v4h-7V8z" /></svg>
          Free returns within 30 days
        </div>
      </div>
    </div>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder, type = 'text', required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>
        {label}{required && ' *'}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          height: 40,
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '0 12px',
          fontSize: 13,
          color: '#12251e',
          background: '#fff',
          outline: 'none',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}

// ─── Step 1: Shipping ─────────────────────────────────────────────────────────

function StepShipping({
  info, setInfo, delivery, setDelivery, onNext,
}: {
  info: ShippingInfo;
  setInfo: (i: ShippingInfo) => void;
  delivery: DeliveryOption;
  setDelivery: (d: DeliveryOption) => void;
  onNext: () => void;
}) {
  const set = (key: keyof ShippingInfo) => (v: string) => setInfo({ ...info, [key]: v });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d4f5c" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 4v4h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 600, color: '#0d4f5c' }}>Shipping Information</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <Field label="First Name" value={info.firstName} onChange={set('firstName')} required />
        <Field label="Last Name"  value={info.lastName}  onChange={set('lastName')}  required />
        <Field label="Email Address" value={info.email} onChange={set('email')} type="email" required />
        <Field label="Phone Number"  value={info.phone} onChange={set('phone')} type="tel"   required />
      </div>
      <div style={{ marginBottom: 14 }}>
        <Field label="Street Address" value={info.street} onChange={set('street')} required />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
        <Field label="City"     value={info.city}  onChange={set('city')}  required />
        <Field label="State"    value={info.state} onChange={set('state')} required />
        <Field label="ZIP Code" value={info.zip}   onChange={set('zip')}   required />
      </div>

      {/* Delivery options */}
      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Delivery Options</h3>
      {[
        { id: 'standard' as DeliveryOption, label: 'Standard Delivery', desc: '2-4 business days', price: 'KES 5.99' },
        { id: 'express'  as DeliveryOption, label: 'Express Delivery',  desc: 'Same day delivery', price: 'KES 9.99' },
      ].map(opt => (
        <div
          key={opt.id}
          onClick={() => setDelivery(opt.id)}
          style={{
            border: `1px solid ${delivery === opt.id ? '#0d4f5c' : '#e2e8f0'}`,
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: delivery === opt.id ? '#f0f9ff' : '#fff',
          }}
        >
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            border: `2px solid ${delivery === opt.id ? '#0d4f5c' : '#cbd5e1'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {delivery === opt.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0d4f5c' }} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#12251e' }}>{opt.label}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{opt.desc}</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0d4f5c' }}>{opt.price}</div>
        </div>
      ))}

      <button
        onClick={onNext}
        style={{
          width: '100%', height: 46, marginTop: 16,
          background: '#0d4f5c', color: '#fff', border: 'none',
          borderRadius: 10, fontSize: 15, fontWeight: 600,
          fontFamily: "'Sora', sans-serif", cursor: 'pointer',
        }}
      >
        Continue to Payment
      </button>
    </div>
  );
}

// ─── Step 2: Payment ──────────────────────────────────────────────────────────

function StepPayment({
  payMethod, setPayMethod, card, setCard, mpesa, setMpesa, onBack, onNext,
}: {
  payMethod: PaymentMethod;
  setPayMethod: (m: PaymentMethod) => void;
  card: CardInfo;
  setCard: (c: CardInfo) => void;
  mpesa: MpesaInfo;
  setMpesa: (m: MpesaInfo) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const setC = (key: keyof CardInfo) => (v: string) => setCard({ ...card, [key]: v });
  const setM = (key: keyof MpesaInfo) => (v: string) => setMpesa({ ...mpesa, [key]: v });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d4f5c" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
        </svg>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 600, color: '#0d4f5c' }}>Payment Information</h2>
      </div>

      {/* Method toggle */}
      {(['Credit/Debit Card', 'M-Pesa'] as PaymentMethod[]).map(m => (
        <div
          key={m!}
          onClick={() => setPayMethod(m)}
          style={{
            border: `1px solid ${payMethod === m ? '#0d4f5c' : '#e2e8f0'}`,
            borderRadius: 10, padding: '12px 16px', marginBottom: 8,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
            background: payMethod === m ? '#f0f9ff' : '#fff',
          }}
        >
          <div style={{
            width: 14, height: 14, borderRadius: '50%',
            border: `2px solid ${payMethod === m ? '#0d4f5c' : '#cbd5e1'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {payMethod === m && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d4f5c' }} />}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#12251e' }}>{m}</span>
        </div>
      ))}

      {/* Card details */}
      {payMethod === 'Credit/Debit Card' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field
            label="Card Number" required
            value={card.number}
            onChange={v => setC('number')(formatCardNumber(v))}
            placeholder="1234 5678 9012 3456"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Expiry Date" required value={card.expiry} onChange={v => setC('expiry')(formatExpiry(v))} placeholder="MM/YY" />
            <Field label="CVV"         required value={card.cvv}    onChange={v => setC('cvv')(v.replace(/\D/g,'').slice(0,4))}   placeholder="123" />
          </div>
          <Field label="Name on Card" required value={card.name} onChange={setC('name')} placeholder="John Doe" />
        </div>
      )}

      {/* M-Pesa details */}
      {payMethod === 'M-Pesa' && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: 8,
            padding: '12px',
            marginBottom: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 24, height: 24, background: '#10b981', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>M</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0d4f5c' }}>M-Pesa Payment</span>
            </div>
            <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>
              Enter your M-Pesa phone number to receive an STK push prompt for payment confirmation.
            </p>
          </div>
          <Field
            label="M-Pesa Phone Number" required
            value={mpesa.phoneNumber}
            onChange={v => setM('phoneNumber')(formatMpesaNumber(v))}
            placeholder="2547XXXXXXXX or 07XXXXXXXX"
          />
          <div style={{
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: 8,
            padding: '10px',
            fontSize: 11,
            color: '#92400e'
          }}>
            <strong>Note:</strong> Ensure your phone has sufficient balance and is available to receive the STK push.
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={onBack} style={{ height: 46, padding: '0 20px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
          Back
        </button>
        <button onClick={onNext} style={{ flex: 1, height: 46, background: '#0d4f5c', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, fontFamily: "'Sora', sans-serif", cursor: 'pointer' }}>
          Review Order
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Review ───────────────────────────────────────────────────────────

function StepReview({
  items, onBack, onPlace, placing,
}: {
  items: Array<{ name: string; quantity: number; unitPrice: number; image?: string }>;
  onBack: () => void;
  onPlace: () => void;
  placing: boolean;
}) {
  const [agreed,     setAgreed]     = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d4f5c" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
        </svg>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 600, color: '#0d4f5c' }}>Review Your Order</h2>
      </div>

      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.image ? (
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3" /></svg>
              )}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#12251e' }}>{item.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Qty: {item.quantity}</div>
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0d4f5c' }}>KES{(item.unitPrice * item.quantity).toFixed(2)}</div>
        </div>
      ))}

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ accentColor: '#0d4f5c' }} />
          I agree to the <a href="#" style={{ color: '#0d4f5c' }}>Terms and Conditions</a> and <a href="#" style={{ color: '#0d4f5c' }}>Privacy Policy</a>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
          <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} style={{ accentColor: '#0d4f5c' }} />
          Subscribe to our newsletter for health tips and exclusive offers
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={onBack} style={{ height: 46, padding: '0 20px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
          Back
        </button>
        <button
          onClick={onPlace}
          disabled={!agreed || placing}
          style={{
            flex: 1, height: 46,
            background: agreed && !placing ? '#0d4f5c' : '#94a3b8',
            color: '#fff', border: 'none', borderRadius: 10,
            fontSize: 15, fontWeight: 600,
            fontFamily: "'Sora', sans-serif",
            cursor: agreed && !placing ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {placing ? (
            <>
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </>
          ) : 'Place Order'}
        </button>
      </div>
    </div>
  );
}

// ─── Checkout (main) ──────────────────────────────────────────────────────────

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { addToast } = useToast();
  const [prescriptionData] = useState(() => getPrescriptionById(getCheckoutPrescriptionId()));

  const [step,     setStep]     = useState<Step>(1);
  const [placing,  setPlacing]  = useState(false);

  const [delivery, setDelivery] = useState<DeliveryOption>('standard');
  const [payMethod,setPayMethod]= useState<PaymentMethod>(null);
  const [card, setCard] = useState<CardInfo>({ number: '', expiry: '', cvv: '', name: '' });
  const [mpesa, setMpesa] = useState<MpesaInfo>({ phoneNumber: '' });
  const [shipping, setShipping] = useState<ShippingInfo>({
    firstName: prescriptionData?.patientName.split(' ')[0] ?? '',
    lastName: prescriptionData?.patientName.split(' ').slice(1).join(' ') ?? '',
    email: prescriptionData?.email ?? '',
    phone: prescriptionData?.phoneNumber ?? '',
    street: prescriptionData?.address ?? '',
    city: '',
    state: '',
    zip: '',
  });

  const deliveryFee = delivery === 'express' ? 9.99 : 5.99;

  const cartItems = prescriptionData
    ? [{
        name: `Prescription Order (${prescriptionData.id})`,
        quantity: 1,
        unitPrice: prescriptionData.estimatedPrice ?? 0,
        image: prescriptionData.files[0]?.type === 'application/pdf'
          ? undefined
          : prescriptionData.files[0]?.dataUrl,
      }]
    : items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        image: i.image,
      }));

const handlePlace = () => {
    setPlacing(true);
    
    // Show appropriate processing message based on payment method
    if (payMethod === 'M-Pesa') {
      addToast({ type: 'info', message: 'Sending STK push to your phone...', duration: 3000 });
    } else {
      addToast({ type: 'success', message: 'Processing your payment...', duration: 2000 });
    }
    
    setTimeout(() => {
      const id = genOrderId();
      const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const tax = Math.round(subtotal * 0.08 * 100) / 100;
      const now = new Date().toLocaleString('en-KE', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
      const order: StoredOrder = {
        id,
        date: now,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.unitPrice,
          image: item.image,
        })),
        total: subtotal + deliveryFee + tax,
        estimatedDelivery: delivery === 'express' ? 'Same day' : '2-4 hours',
        status: 'Processing',
        shippingInfo: shipping,
        paymentMethod: payMethod,
        transactionId: 'TXN-' + id,
        isPrescriptionOrder: !!prescriptionData,
        prescriptionId: prescriptionData?.id ?? null,
      };

      saveOrder(order);
      if (!prescriptionData) {
        clearCart();
      } else {
        clearCheckoutPrescriptionId();
      }
      setPlacing(false);
      
      // Show success message based on payment method
      if (payMethod === 'M-Pesa') {
        addToast({ type: 'success', message: 'M-Pesa payment successful!', duration: 3000 });
      } else {
        addToast({ type: 'success', message: 'Payment processed successfully!', duration: 3000 });
      }

      // Redirect to orders page after successful payment
      navigate('/orders');
    }, payMethod === 'M-Pesa' ? 4000 : 2500);
  };

  if (!cartItems.length) {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1rem', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 700, color: '#12251e', marginBottom: 10 }}>
          Nothing to checkout yet
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 18 }}>
          Add products to your cart or wait until a prescription request becomes available for payment.
        </p>
        <button
          onClick={() => navigate('/products')}
          style={{
            height: 44,
            border: 'none',
            borderRadius: 12,
            background: '#0d4f5c',
            color: '#fff',
            padding: '0 18px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Sora', sans-serif",
          }}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '1.5rem 1rem 3rem', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 13, fontFamily: 'inherit' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            Back to Shop
          </button>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 700, color: '#12251e' }}>Checkout</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0d4f5c" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
          Secure Checkout
        </div>
      </div>

      <StepIndicator current={step} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 24, alignItems: 'start' }}>
        {/* Left: form */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.5rem' }}>
          {prescriptionData ? (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '12px 14px', marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700, marginBottom: 6 }}>
                Prescription Checkout
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0d4f5c', marginBottom: 4 }}>
                {prescriptionData.id}
              </div>
              <div style={{ fontSize: 13, color: '#1e3a8a' }}>
                This order was created from your approved prescription request and uses the pharmacist&apos;s estimated price.
              </div>
            </div>
          ) : null}
          {step === 1 && (
            <StepShipping
              info={shipping} setInfo={setShipping}
              delivery={delivery} setDelivery={setDelivery}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepPayment
              payMethod={payMethod} setPayMethod={setPayMethod}
              card={card} setCard={setCard}
              mpesa={mpesa} setMpesa={setMpesa}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <StepReview
              items={cartItems}
              onBack={() => setStep(2)}
              onPlace={handlePlace}
              placing={placing}
            />
          )}
        </div>

        {/* Right: order summary */}
        <OrderSidebar items={cartItems} delivery={deliveryFee} />
      </div>
    </div>
  );
};
