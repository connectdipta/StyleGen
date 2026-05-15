import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUtils';
import { API_URL } from '../api/api';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    const shipping = 100;
    const total = cartTotal + shipping;

    return (
        <div style={{ minHeight: '80vh', background: '#FAFAFA', padding: '5rem 0' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '950', color: '#111', letterSpacing: '-1.5px' }}>Shopping Cart</h1>
                    <p style={{ color: '#666', marginTop: '10px' }}>Review your items and proceed to a secure checkout.</p>
                </div>

                {cart.length > 0 ? (
                    <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2.5rem' }}>
                        {/* LEFT: CART ITEMS */}
                        <div>
                            <div style={{ background: '#FFF', borderRadius: '8px', border: '1px solid #EEE', overflow: 'hidden' }}>
                                {cart.map((item) => (
                                    <div key={item._id} className="cart-item" style={{ display: 'flex', padding: '2rem', borderBottom: '1px solid #F3F4F6', gap: '2rem' }}>
                                        <img 
                                            src={getImageUrl(item.image, API_URL)} 
                                            alt={item.name} 
                                            style={{ width: '120px', height: '150px', objectFit: 'cover', borderRadius: '4px' }} 
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div className="cart-item-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <Link to={`/products/${item._id}`} style={{ textDecoration: 'none', color: '#111' }}>
                                                        <h3 style={{ fontWeight: '900', fontSize: '18px', margin: 0 }}>{item.name}</h3>
                                                    </Link>
                                                    <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Premium Collection • Artisan Grade</p>
                                                </div>
                                                <span style={{ fontWeight: '950', fontSize: '18px', color: '#111' }}>BDT {item.price * item.quantity}</span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginTop: '2.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', border: '1px solid #EEE', borderRadius: '4px' }}>
                                                    <button 
                                                        style={{ padding: '8px 15px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                        onClick={() => updateQuantity(item._id, -1)}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span style={{ padding: '0 10px', fontWeight: '900', fontSize: '14px' }}>{item.quantity}</span>
                                                    <button 
                                                        style={{ padding: '8px 15px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                                                        onClick={() => updateQuantity(item._id, 1)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => removeFromCart(item._id)}
                                                    style={{ border: 'none', background: 'transparent', color: '#EF4444', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                >
                                                    <Trash2 size={14} /> REMOVE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-trust-badges" style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
                                <div style={{ flex: 1, padding: '1.5rem', background: '#FFF', border: '1px solid #EEE', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <Truck size={24} color="var(--primary)" />
                                    <div>
                                        <p style={{ fontWeight: '900', fontSize: '13px', margin: 0 }}>Fast Delivery</p>
                                        <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>Ships within 24-48 hours</p>
                                    </div>
                                </div>
                                <div style={{ flex: 1, padding: '1.5rem', background: '#FFF', border: '1px solid #EEE', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <ShieldCheck size={24} color="#10B981" />
                                    <div>
                                        <p style={{ fontWeight: '900', fontSize: '13px', margin: 0 }}>Secure Payment</p>
                                        <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>100% encrypted transaction</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: SUMMARY */}
                        <div>
                            <div style={{ background: '#111', color: '#FFF', borderRadius: '8px', padding: '2.5rem', position: 'sticky', top: '120px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem' }}>Order Summary</h2>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Subtotal</span>
                                        <span style={{ fontWeight: '800' }}>BDT {cartTotal}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Estimated Shipping</span>
                                        <span style={{ fontWeight: '800' }}>BDT {shipping}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Tax (Included)</span>
                                        <span style={{ fontWeight: '800' }}>BDT 0</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                                    <div>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0, fontWeight: '700' }}>TOTAL AMOUNT</p>
                                        <h3 style={{ fontSize: '2rem', fontWeight: '950', margin: 0, letterSpacing: '-1px' }}>BDT {total}</h3>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate('/checkout')}
                                    style={{ width: '100%', padding: '20px', background: 'var(--primary)', color: '#FFF', border: 'none', borderRadius: '4px', fontWeight: '950', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', boxShadow: '0 10px 25px rgba(255, 77, 28, 0.4)' }}
                                >
                                    PROCEED TO CHECKOUT <ArrowRight size={20} />
                                </button>

                                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                    <img src="https://i.ibb.co/3S4kPXR/payment-methods.png" style={{ width: '100%', opacity: 0.5 }} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '8rem 0', background: '#FFF', borderRadius: '8px', border: '1px dotted #CCC' }}>
                        <ShoppingCart size={60} color="#EEE" style={{ marginBottom: '2rem' }} />
                        <h2 style={{ fontWeight: '900', color: '#111' }}>Your cart is empty</h2>
                        <p style={{ color: '#666', marginTop: '10px' }}>Looks like you haven't added any premium goods to your cart yet.</p>
                        <Link to="/products" style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            marginTop: '2rem', 
                            background: '#111', 
                            color: '#FFF', 
                            textDecoration: 'none', 
                            padding: '15px 35px', 
                            borderRadius: '4px', 
                            fontWeight: '900',
                            fontSize: '12px'
                        }}>
                            EXPLORE COLLECTIONS <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
