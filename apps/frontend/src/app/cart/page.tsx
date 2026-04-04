import { useState } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { PRODUCTLIST_URL } from '../../utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
type ImageType = 'capsule' | 'tablet' | 'syrup' | 'supplement';

export interface CartItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  packSize: string;
  unitPrice: number;
  quantity: number;
  requiresPrescription: boolean;
  stockStatus: StockStatus;
  stockCount?: number;
  imageType: ImageType;
  image?: string;
}

interface SuggestedItem {
  id: string;
  name: string;
  price: number;
  imageType: ImageType;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FREE_DELIVERY_THRESHOLD = 2500;
const VAT_RATE = 0.16;

const VALID_PROMO_CODES: Record<string, { discount: number; message: string }> = {
  PHARMA10: { discount: 0.1, message: '✓ 10% discount applied!' },
  HEALTH20: { discount: 0.2, message: '✓ 20% discount applied!' },
};

const SUGGESTED_ITEMS: SuggestedItem[] = [];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(amount: number): string {
  return 'KSh ' + amount.toLocaleString('en-KE');
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function MedicineIcon({ type, size = 36 }: { type: ImageType; size?: number }) {
  const s = size;
  const icons: Record<ImageType, JSX.Element> = {
    capsule: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <rect x="10" y="8" width="28" height="32" rx="4" fill="#9fe1cb" />
        <rect x="14" y="14" width="20" height="4" rx="2" fill="#0F6E56" />
        <rect x="14" y="22" width="12" height="3" rx="1.5" fill="#1D9E75" />
        <rect x="14" y="29" width="16" height="3" rx="1.5" fill="#1D9E75" />
      </svg>
    ),
    tablet: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <rect x="18" y="8" width="12" height="28" rx="4" fill="#9fe1cb" />
        <rect x="18" y="8" width="12" height="14" rx="4" fill="#1D9E75" />
        <rect x="14" y="20" width="20" height="4" rx="2" fill="#0F6E56" />
      </svg>
    ),
    syrup: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <rect x="12" y="14" width="24" height="20" rx="4" fill="#9fe1cb" />
        <path d="M12 22h24" stroke="#0F6E56" strokeWidth="2" />
        <path d="M20 14v-4M28 14v-4" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    supplement: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="24" rx="12" ry="8" fill="#9fe1cb" />
        <ellipse cx="24" cy="24" rx="12" ry="8" stroke="#0F6E56" strokeWidth="2" />
        <line x1="12" y1="24" x2="36" y2="24" stroke="#0F6E56" strokeWidth="2" />
        <ellipse cx="24" cy="28" rx="12" ry="8" fill="rgba(159,225,203,0.5)" stroke="#1D9E75" strokeWidth="1.5" />
      </svg>
    ),
  };
  return icons[type];
}

// ─── CartItemCard ─────────────────────────────────────────────────────────────

function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
  onSave,
}: {
  item: CartItem;
  onQuantityChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onSave: (id: string) => void;
}) {
  const [removing, setRemoving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.id), 250);
  };

  const stockConfig: Record<StockStatus, { dot: string; label: string; labelColor: string }> = {
    in_stock:     { dot: '#1D9E75', label: 'In stock',              labelColor: '#0F6E56' },
    low_stock:    { dot: '#EF9F27', label: `Only ${item.stockCount} left`, labelColor: '#BA7517' },
    out_of_stock: { dot: '#E24B4A', label: 'Out of stock',           labelColor: '#E24B4A' },
  };
  const stock = stockConfig[item.stockStatus];

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '1rem',
        display: 'flex',
        gap: '1rem',
        transition: 'opacity .25s, transform .25s, box-shadow .2s',
        opacity: removing ? 0 : 1,
        transform: removing ? 'translateX(16px)' : 'translateX(0)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)')}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: 72, height: 72, minWidth: 72, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <MedicineIcon type={item.imageType} />
        )}
        {item.requiresPrescription && (
          <span style={{ position: 'absolute', top: 4, left: 4, background: '#0d4f5c', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 4, padding: '1px 5px', letterSpacing: '.5px', zIndex: 1 }}>Rx</span>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: '#0d4f5c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 2 }}>{item.category}</div>
        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600, color: '#12251e', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{item.packSize} · {item.brand}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Qty */}
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', background: '#f8fafc' }}>
            <button onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))} style={{ width: 30, height: 30, border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#0d4f5c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <span style={{ width: 32, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#12251e', userSelect: 'none' }}>{item.quantity}</span>
            <button onClick={() => onQuantityChange(item.id, item.quantity + 1)} style={{ width: 30, height: 30, border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#0d4f5c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>

          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: stock.dot, display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: stock.labelColor }}>{stock.label}</span>
          </div>

          {/* Save */}
          <button onClick={() => { setSaved(true); onSave(item.id); }} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: saved ? '#0d4f5c' : '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Price & remove */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', minWidth: 80 }}>
        <button onClick={handleRemove} style={{ padding: 4, borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#64748b'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
          </svg>
        </button>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: '#0d4f5c' }}>{fmt(item.unitPrice * item.quantity)}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{fmt(item.unitPrice)} / pack</div>
        </div>
      </div>
    </div>
  );
}

// ─── SuggestedItems ───────────────────────────────────────────────────────────

function SuggestedItems({ items, onAdd }: { items: SuggestedItem[]; onAdd: (item: SuggestedItem) => void }) {
  const [added, setAdded] = useState<Set<string>>(new Set());

  return (
    <div style={{ marginTop: 20 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 8 }}>Frequently bought together</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {items.map(item => {
          const isAdded = added.has(item.id);
          return (
            <button key={item.id} onClick={() => { if (!isAdded) { setAdded(prev => new Set(prev).add(item.id)); onAdd(item); } }}
              style={{ background: isAdded ? '#f0fdf4' : '#fff', border: `1px solid ${isAdded ? '#22c55e' : '#e2e8f0'}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center', cursor: 'pointer', transition: 'border-color .2s, box-shadow .2s' }}
              onMouseEnter={e => { if (!isAdded) (e.currentTarget as HTMLButtonElement).style.borderColor = '#cbd5e1'; }}
              onMouseLeave={e => { if (!isAdded) (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; }}
            >
              <div style={{ width: 40, height: 40, background: '#f1f5f9', borderRadius: 8, margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MedicineIcon type={item.imageType} size={22} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#12251e', lineHeight: 1.3, marginBottom: 2 }}>{item.name}</p>
              <p style={{ fontSize: 11, color: '#0d4f5c', fontWeight: 600 }}>{fmt(item.price)}</p>
              <span style={{ fontSize: 10, color: isAdded ? '#22c55e' : '#64748b', display: 'block', marginTop: 3 }}>{isAdded ? '✓ Added' : '+ Add to cart'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── OrderSummary ─────────────────────────────────────────────────────────────

function OrderSummary({ subtotal, itemCount, onCheckout }: { subtotal: number; itemCount: number; onCheckout: () => void }) {
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');
  const [promoValid, setPromoValid] = useState<boolean | null>(null);

  const discountAmt = Math.round(subtotal * promoDiscount);
  const vat = Math.round((subtotal - discountAmt) * VAT_RATE);
  const total = subtotal - discountAmt + vat;
  const deliveryFree = subtotal >= FREE_DELIVERY_THRESHOLD;
  const progressPct = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  const applyPromo = () => {
    const result = VALID_PROMO_CODES[promoCode.toUpperCase()];
    if (result) {
      setPromoDiscount(result.discount);
      setPromoMsg(result.message);
      setPromoValid(true);
    } else {
      setPromoDiscount(0);
      setPromoMsg('Invalid code. Try PHARMA10 or HEALTH20');
      setPromoValid(false);
    }
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.25rem', position: 'sticky', top: 16 }} className='m-3'>
      <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: '#0d4f5c', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #e2e8f0' }}>Order Summary</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {[
          { label: `Subtotal (${itemCount} item${itemCount !== 1 ? 's' : ''})`, value: fmt(subtotal) },
          { label: 'Delivery fee', value: deliveryFree ? 'Free' : fmt(150), valueStyle: deliveryFree ? { color: '#22c55e', fontWeight: 600 } : {} },
          ...(promoDiscount > 0 ? [{ label: 'Promo discount', value: `− ${fmt(discountAmt)}`, valueStyle: { color: '#dc2626' } }] : []),
          { label: `VAT (${VAT_RATE * 100}%)`, value: fmt(vat) },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: '#64748b' }}>{row.label}</span>
            <span style={{ fontWeight: 500, color: '#12251e', ...((row as any).valueStyle ?? {}) }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px dashed #e2e8f0', margin: '12px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: '#0d4f5c', marginBottom: 16 }}>
        <span>Total</span><span>{fmt(total)}</span>
      </div>

      {/* Promo */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        <input value={promoCode} onChange={e => setPromoCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyPromo()} placeholder="Promo code"
          style={{ flex: 1, height: 36, border: '1px solid #e2e8f0', borderRadius: 8, padding: '0 10px', fontSize: 13, fontFamily: 'inherit', color: '#12251e', background: '#f8fafc', outline: 'none' }} />
        <button onClick={applyPromo} style={{ height: 36, padding: '0 14px', background: '#0d4f5c', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#164e63')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#0d4f5c')}
        >Apply</button>
      </div>
      {promoMsg && <p style={{ fontSize: 11, marginBottom: 10, color: promoValid ? '#22c55e' : '#dc2626' }}>{promoMsg}</p>}

      {/* Checkout */}
      <button onClick={onCheckout}
        style={{ width: '100%', height: 46, background: '#0d4f5c', color: '#fff', border: 'none', borderRadius: 10, fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, transition: 'background .2s' }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#164e63')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#0d4f5c')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
        Proceed to Checkout
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 8 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        <span style={{ fontSize: 11, color: '#64748b' }}>Secured · SSL encrypted</span>
      </div>

      {/* Delivery progress */}
      <div style={{ marginTop: 16, background: '#f0fdf4', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, minWidth: 32, background: '#0d4f5c', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 4v4h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#0d4f5c' }}>{deliveryFree ? 'You qualify for free delivery!' : `Spend ${fmt(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery`}</p>
          <p style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Nairobi CBD · Same-day available</p>
          <div style={{ height: 4, background: '#dcfce7', borderRadius: 999, marginTop: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#22c55e', borderRadius: 999, width: `${progressPct}%`, transition: 'width .5s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d4f5c" strokeWidth="1.8"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
      </div>
      <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: '#0d4f5c', marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Browse our products and add medicines or health items</p>
      <a href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0d4f5c', color: '#fff', padding: '10px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: "'Sora', sans-serif", textDecoration: 'none' }}>
        Browse Products
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </a>
    </div>);
}

function CheckoutModal({
  open,
  onClose,
  onConfirm,
  items,
  subtotal,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: CartItem[];
  subtotal: number;
}) {
  const { addToast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [mpesaStep, setMpesaStep] = useState<'phone' | 'prompting' | 'success' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [cardStep, setCardStep] = useState<'details' | 'processing' | 'success' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [showCardModal, setShowCardModal] = useState(false);

  if (!open) return null;

  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  const handleMpesaClick = () => {
    setSelectedMethod('M-Pesa');
    setMpesaStep('phone');
    setShowMpesaModal(true);
  };

  const handleMpesaPay = () => {
    if (phoneNumber.length < 10) {
      addToast({ type: 'error', message: 'Please enter a valid phone number (10 digits)', duration: 3000 });
      return;
    }
    setMpesaStep('prompting');
    setTimeout(() => setMpesaStep('success'), 2500);
    setTimeout(() => {
      setShowMpesaModal(false);
      setSelectedMethod('M-Pesa');
      onConfirm();
    }, 4000);
  };

  const handleCardClick = () => {
    setSelectedMethod('Card');
    setCardStep('details');
    setShowCardModal(true);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2, 4);
    return v;
  };

  const handleCardPay = () => {
    if (cardNumber.replace(/\s/g, '').length < 16) {
      addToast({ type: 'error', message: 'Please enter a valid card number', duration: 3000 });
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      addToast({ type: 'error', message: 'Please enter expiry date (MM/YY)', duration: 3000 });
      return;
    }
    if (cardCvv.length < 3) {
      addToast({ type: 'error', message: 'Please enter valid CVV', duration: 3000 });
      return;
    }
    if (!cardName) {
      addToast({ type: 'error', message: 'Please enter cardholder name', duration: 3000 });
      return;
    }
    setCardStep('processing');
    setTimeout(() => setCardStep('success'), 2500);
    setTimeout(() => {
      setShowCardModal(false);
      setSelectedMethod('Card');
      onConfirm();
    }, 4000);
  };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ width: 'min(700px,100%)', background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.2)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, color: '#0d4f5c' }}>Checkout Payment</h2>
                <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: 13 }}>Review your order and select a payment method.</p>
              </div>
              <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', fontSize: 24, lineHeight: 1 }}>&times;</button>
            </div>
          </div>

          <div style={{ padding: '1.5rem', display: 'grid', gap: 18 }}>
            <div style={{ display: 'grid', gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: '#0d4f5c' }}>Order Summary</h3>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: 50, height: 50, borderRadius: 12, overflow: 'hidden', background: '#f8fafc', display: 'grid', placeItems: 'center' }}>
                    {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <MedicineIcon type={item.imageType} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#12251e' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{item.quantity} × KSh {item.unitPrice.toFixed(2)}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0d4f5c' }}>KSh {(item.unitPrice * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#0d4f5c' }}>
              <span>Subtotal</span>
              <span>KSh {subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
              <span>Delivery fee</span>
              <span>KSh 150</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#0d4f5c' }}>
              <span>Total</span>
              <span>KSh {total.toFixed(2)}</span>
            </div>

            <div style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0d4f5c' }}>Payment method</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                <button onClick={handleMpesaClick} style={{ padding: '12px 10px', borderRadius: 12, border: `2px solid ${selectedMethod === 'M-Pesa' ? '#22c55e' : '#e2e8f0'}`, background: selectedMethod === 'M-Pesa' ? '#f0fdf4' : '#f8fafc', color: '#0d4f5c', fontWeight: 600, cursor: 'pointer' }}>M-Pesa</button>
                <button onClick={handleCardClick} style={{ padding: '12px 10px', borderRadius: 12, border: `2px solid ${selectedMethod === 'Card' ? '#22c55e' : '#e2e8f0'}`, background: selectedMethod === 'Card' ? '#f0fdf4' : '#f8fafc', color: '#0d4f5c', fontWeight: 600, cursor: 'pointer' }}>Card</button>
                <button onClick={() => setSelectedMethod('Cash on Delivery')} style={{ padding: '12px 10px', borderRadius: 12, border: `2px solid ${selectedMethod === 'Cash on Delivery' ? '#22c55e' : '#e2e8f0'}`, background: selectedMethod === 'Cash on Delivery' ? '#f0fdf4' : '#f8fafc', color: '#0d4f5c', fontWeight: 600, cursor: 'pointer' }}>Cash on Delivery</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
              <button onClick={onClose} style={{ padding: '12px 18px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
              <button onClick={onConfirm} disabled={!selectedMethod} style={{ padding: '12px 18px', borderRadius: 12, border: 'none', background: selectedMethod ? '#0d4f5c' : '#94a3b8', color: '#fff', cursor: selectedMethod ? 'pointer' : 'not-allowed' }}>Confirm Payment</button>
            </div>
          </div>
        </div>
      </div>

      {/* M-Pesa Modal */}
      {showMpesaModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: 'min(400px,100%)', background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            {mpesaStep === 'phone' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ width: 60, height: 60, background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 6.1H3M21 12.1H3M15.1 18.1H3" /></svg>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#0d4f5c' }}>Pay with M-Pesa</h3>
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>Enter your M-Pesa registered number</p>
                </div>
                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="e.g. 712345678" style={{ width: '100%', padding: '14px 16px', fontSize: 16, border: '2px solid #e2e8f0', borderRadius: 12, marginBottom: 16, boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setShowMpesaModal(false); setMpesaStep(null); }} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleMpesaPay} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: '#22c55e', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Pay KSh {total.toFixed(2)}</button>
                </div>
              </>
            )}
            {mpesaStep === 'prompting' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 80, height: 80, border: '4px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <h3 style={{ margin: 0, fontSize: 18, color: '#0d4f5c' }}>Sending Payment Request</h3>
                <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b' }}>A pop-up has been sent to<br /><strong style={{ color: '#0d4f5c' }}>254{phoneNumber.slice(-9)}</strong></p>
              </div>
            )}
            {mpesaStep === 'success' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 80, height: 80, background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 style={{ margin: 0, fontSize: 20, color: '#22c55e' }}>Payment Complete!</h3>
                <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b' }}>KSh {total.toFixed(2)} paid successfully</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Card Modal */}
      {showCardModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: 'min(420px,100%)', background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            {cardStep === 'details' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ width: 60, height: 60, background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#0d4f5c' }}>Pay with Card</h3>
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>Enter your card details</p>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Card Number</label>
                  <input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '2px solid #e2e8f0', borderRadius: 10, boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Expiry</label>
                    <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '2px solid #e2e8f0', borderRadius: 10, boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>CVV</label>
                    <input type="text" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" maxLength={4} style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '2px solid #e2e8f0', borderRadius: 10, boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 4 }}>Cardholder Name</label>
                  <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe" style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '2px solid #e2e8f0', borderRadius: 10, boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setShowCardModal(false); setCardStep(null); }} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleCardPay} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Pay KSh {total.toFixed(2)}</button>
                </div>
              </>
            )}
            {cardStep === 'processing' && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 80, height: 80, border: '4px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
                <h3 style={{ margin: 0, fontSize: 18, color: '#0d4f5c' }}>Processing Payment</h3>
                <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b' }}>Please wait...</p>
              </div>
            )}
            {cardStep === 'success' && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 80, height: 80, background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 style={{ margin: 0, fontSize: 20, color: '#22c55e' }}>Payment Successful!</h3>
                <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b' }}>KSh {total.toFixed(2)} paid successfully</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCart();
  const { addToast } = useToast();
  const [rxUploaded, setRxUploaded] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  console.log('Cart component rendering, items:', items);

  const hasRxItems = items.some(item => item.requiresPrescription);
  const subtotal = getSubtotal();

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: string) => {
    removeItem(id);
  };

  const handleAddSuggested = (suggested: SuggestedItem) => {
    // This will be handled by the cart context when called from SuggestedItems
    console.log('Add suggested item:', suggested);
  };

  const handleCheckout = () => {
    if (hasRxItems && !rxUploaded) {
      addToast({
        type: 'error',
        message: 'Please upload your prescription before proceeding to checkout.',
        duration: 4000
      });
      return;
    }

    setCheckoutOpen(true);
  };

  const handleConfirmPayment = () => {
    addToast({
      type: 'success',
      message: 'Checkout complete! Thank you for your order!',
      duration: 4000
    });
    setCheckoutOpen(false);
    clearCart();
    navigate(PRODUCTLIST_URL);
  };

  const handleCloseModal = () => {
    setCheckoutOpen(false);
  };

  if (items.length === 0) return <EmptyCart />;

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '1.5rem 1rem 2rem', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: '#0d4f5c', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d4f5c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Your Cart
          <span style={{ background: '#0d4f5c', color: '#fff', fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 999 }}>
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        </h1>
        <button onClick={() => clearCart()} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#64748b', cursor: 'pointer', background: 'none', fontFamily: 'inherit' }}>
          Clear all
        </button>
      </div>

      {/* Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 20, alignItems: 'start' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Rx banner */}
          {hasRxItems && (
            <div style={{ background: 'linear-gradient(90deg,#0d4f5c 0%,#164e63 100%)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
              <div style={{ width: 28, height: 28, minWidth: 28, background: 'rgba(255,255,255,.15)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>Prescription items require verification</p>
                <p style={{ fontSize: 11, opacity: .8, marginTop: 1 }}>Upload or link your prescription before checkout</p>
              </div>
              <button onClick={() => setRxUploaded(true)} style={{ fontSize: 11, color: 'rgba(255,255,255,.85)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                {rxUploaded ? '✓ Rx Uploaded' : 'Upload Rx →'}
              </button>
            </div>
          )}

          {items.map(item => (
            <CartItemCard
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
              onSave={id => console.log('Saved:', id)}
            />
          ))}

          <SuggestedItems items={SUGGESTED_ITEMS} onAdd={handleAddSuggested} />
        </div>

        {/* Right */}
        <OrderSummary subtotal={subtotal} itemCount={items.length} onCheckout={handleCheckout} />
      </div>
      <CheckoutModal
        open={checkoutOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPayment}
        items={items}
        subtotal={subtotal}
      />
    </div>
  );
};