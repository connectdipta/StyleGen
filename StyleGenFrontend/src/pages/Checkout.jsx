import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ShieldCheck, ArrowRight, Truck, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/api';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Bangladesh',
        paymentMethod: 'cash_on_delivery'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const orderData = {
                orderItems: cart.map(item => ({
                    product: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    image: item.image,
                    price: item.price
                })),
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country,
                    phone: formData.phone
                },
                totalPrice: total
            };

            const { data } = await api.post('/orders', orderData);
            
            toast.success('Order placed successfully!');
            clearCart();
            navigate('/order-success', { state: { orderId: data._id } });
        } catch (error) {
            console.error('Order placement error:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ padding: '8rem 0', textAlign: 'center' }}>
                <h2>Your cart is empty</h2>
                <button className="btn-primary" onClick={() => navigate('/products')} style={{ marginTop: '2rem' }}>Back to Shop</button>
            </div>
        );
    }

    const shipping = 100;
    const total = cartTotal + shipping;

    return (
        <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '5rem 0' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
                    
                    {/* LEFT: SHIPPING FORM */}
                    <div>
                        <div style={{ background: '#FFF', padding: '3rem', borderRadius: '12px', border: '1px solid #EEE', boxShadow: '0 4px 25px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '3rem' }}>
                                <div style={{ background: '#FF4D1C', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                                    <MapPin size={20} />
                                </div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '950', letterSpacing: '-1px' }}>Shipping Information</h2>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="checkout-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: '#999', marginBottom: '10px' }}>FULL NAME</label>
                                        <input required name="fullName" value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #EEE', background: '#FBFBFC', fontWeight: '800' }} placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: '#999', marginBottom: '10px' }}>EMAIL</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #EEE', background: '#FBFBFC', fontWeight: '800' }} placeholder="john@example.com" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: '#999', marginBottom: '10px' }}>PHONE</label>
                                        <input required name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #EEE', background: '#FBFBFC', fontWeight: '800' }} placeholder="+880 1XXX-XXXXXX" />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: '#999', marginBottom: '10px' }}>SHIPPING ADDRESS</label>
                                        <textarea required name="address" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #EEE', background: '#FBFBFC', fontWeight: '800', height: '100px' }} placeholder="Street, House, Flat No." />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: '#999', marginBottom: '10px' }}>CITY</label>
                                        <input required name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #EEE', background: '#FBFBFC', fontWeight: '800' }} placeholder="Dhaka" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: '#999', marginBottom: '10px' }}>COUNTRY</label>
                                        <input required name="country" value={formData.country} onChange={handleChange} style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #EEE', background: '#FBFBFC', fontWeight: '800' }} placeholder="Bangladesh" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: '#999', marginBottom: '10px' }}>POSTAL CODE</label>
                                        <input required name="postalCode" value={formData.postalCode} onChange={handleChange} style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #EEE', background: '#FBFBFC', fontWeight: '800' }} placeholder="1212" />
                                    </div>
                                </div>

                                <div style={{ marginTop: '4rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                                        <div style={{ background: '#111', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                                            <CreditCard size={20} />
                                        </div>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: '950', letterSpacing: '-1px' }}>Payment Method</h2>
                                    </div>

                                    <div 
                                        onClick={() => setFormData({...formData, paymentMethod: 'cash_on_delivery'})}
                                        style={{ padding: '20px', borderRadius: '12px', border: formData.paymentMethod === 'cash_on_delivery' ? '2px solid #FF4D1C' : '1px solid #EEE', background: formData.paymentMethod === 'cash_on_delivery' ? '#FFF9F7' : '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px' }}
                                    >
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #FF4D1C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {formData.paymentMethod === 'cash_on_delivery' && <div style={{ width: '10px', height: '10px', background: '#FF4D1C', borderRadius: '50%' }} />}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '900', margin: 0 }}>Cash on Delivery</p>
                                            <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Pay with cash when your luxury items arrive.</p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    disabled={loading}
                                    type="submit" 
                                    className="btn-primary" 
                                    style={{ width: '100%', marginTop: '3rem', padding: '22px', fontSize: '1.1rem', fontWeight: '950', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', boxShadow: '0 15px 35px rgba(255, 77, 28, 0.4)' }}
                                >
                                    {loading ? 'PROCESSING...' : <>CONFIRM ORDER <ArrowRight size={22} /></>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: ORDER SUMMARY */}
                    <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
                        <div style={{ background: '#111', color: '#FFF', padding: '2.5rem', borderRadius: '12px' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '2rem' }}>Order Summary</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                                {cart.map(item => (
                                    <div key={item._id} style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '6px', background: '#FFF', padding: '5px' }}>
                                            <img src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:4000/uploads/${item.image}`) : ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: '900', fontSize: '14px', margin: '0 0 4px 0' }}>{item.name}</p>
                                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Qty: {item.quantity} • Size: {item.size || 'N/A'}</p>
                                        </div>
                                        <p style={{ fontWeight: '900', fontSize: '14px', margin: 0 }}>BDT {item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Subtotal</span>
                                    <span style={{ fontWeight: '800' }}>BDT {cartTotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Shipping</span>
                                    <span style={{ fontWeight: '800' }}>BDT {shipping}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '950', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                                    <span>Total</span>
                                    <span style={{ color: '#FF4D1C' }}>BDT {total}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', padding: '2rem', background: '#FFF', borderRadius: '12px', border: '1px solid #EEE' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.2rem' }}>
                                <ShieldCheck size={24} color="#10B981" />
                                <p style={{ fontSize: '13px', fontWeight: '800', margin: 0 }}>Verified Secure Checkout</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Truck size={24} color="#3B82F6" />
                                <p style={{ fontSize: '13px', fontWeight: '800', margin: 0 }}>Premium Insured Delivery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
