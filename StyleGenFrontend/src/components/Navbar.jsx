import { ShoppingCart, User, Search, Heart, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import { API_URL } from '../api/api';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount, wishlistCount, cart, wishlist, removeFromCart, toggleWishlist } = useCart();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <nav style={{
            background: '#FFF',
            borderBottom: '1px solid #EEE',
            padding: '1.5rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* LOGO */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{
                        width: '32px', height: '32px', background: '#FF4D1C', borderRadius: '3px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: '900', fontSize: '1.2rem'
                    }}>S</div>
                    <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#000', letterSpacing: '-1.5px' }}>StyleGen</span>
                </Link>

                {/* MIDDLE MENU - FIGMA STYLE */}
                <div className="nav-links-desktop" style={{ display: 'flex', gap: '30px' }}>
                    <Link to="/" style={{ fontSize: '11px', fontWeight: '800', color: '#111', textDecoration: 'none', letterSpacing: '1px' }}>HOME</Link>
                    <Link to="/products" style={{ fontSize: '11px', fontWeight: '800', color: '#111', textDecoration: 'none', letterSpacing: '1px' }}>PRODUCTS</Link>
                    <Link to="/categories" style={{ fontSize: '11px', fontWeight: '800', color: '#111', textDecoration: 'none', letterSpacing: '1px' }}>CATEGORIES</Link>
                </div>

                {/* MOBILE HAMBURGER */}
                <button className="nav-hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <span style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
                    <span style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
                    <span style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
                </button>

                {/* ICONS & AUTH */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        {isSearchOpen ? (
                            <div style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: '4px', padding: '5px 10px', animation: 'fadeIn 0.3s' }}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '11px', fontWeight: '700', width: '150px' }}
                                />
                                <X size={14} style={{ cursor: 'pointer' }} onClick={() => setIsSearchOpen(false)} />
                            </div>
                        ) : (
                            <Search size={18} style={{ cursor: 'pointer' }} onClick={() => setIsSearchOpen(true)} />
                        )}
                    </div>

                    <div
                        style={{ position: 'relative', display: 'flex', alignItems: 'center', color: '#000' }}
                        onMouseEnter={() => setIsWishlistOpen(true)}
                        onMouseLeave={() => setIsWishlistOpen(false)}
                    >
                        <Heart size={18} style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard?tab=my-wishlist')} />
                        {wishlistCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '-8px', right: '-8px',
                                background: 'var(--primary)', color: 'white', fontSize: '8px',
                                width: '16px', height: '16px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900'
                            }}>{wishlistCount}</span>
                        )}

                        {/* MINI WISHLIST DROPDOWN */}
                        {isWishlistOpen && (
                            <div style={{ position: 'absolute', top: '100%', right: 0, width: '300px', background: '#FFF', border: '1px solid #EEE', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', zIndex: 1001, padding: '1.5rem', animation: 'fadeIn 0.3s' }}>
                                <h4 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '1rem', color: '#111' }}>My Wishlist ({wishlistCount})</h4>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {wishlist.length > 0 ? wishlist.map(item => (
                                        <div key={item._id} style={{ display: 'flex', gap: '12px', marginBottom: '12px', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
                                            <img src={getImageUrl(item.image, API_URL)} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '12px', fontWeight: '800', margin: 0, color: '#111' }}>{item.name}</p>
                                                <p style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', marginTop: '3px' }}>BDT {item.price}</p>
                                            </div>
                                            <button
                                                onClick={() => toggleWishlist(item)}
                                                style={{ border: 'none', background: 'transparent', color: '#CCC', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )) : <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', padding: '1rem' }}>Wishlist is empty</p>}
                                </div>
                                <button onClick={() => navigate('/dashboard?tab=my-wishlist')} style={{ width: '100%', padding: '10px', background: '#111', color: '#FFF', border: 'none', fontSize: '10px', fontWeight: '900', cursor: 'pointer', marginTop: '10px' }}>VIEW WISHLIST</button>
                            </div>
                        )}
                    </div>

                    <div
                        style={{ position: 'relative', display: 'flex', alignItems: 'center', color: '#000' }}
                        onMouseEnter={() => setIsCartOpen(true)}
                        onMouseLeave={() => setIsCartOpen(false)}
                    >
                        <ShoppingCart size={18} style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard?tab=my-cart')} />
                        <span style={{
                            position: 'absolute', top: '-8px', right: '-8px',
                            background: '#000', color: 'white', fontSize: '8px',
                            width: '16px', height: '16px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900'
                        }}>{cartCount}</span>

                        {/* MINI CART DROPDOWN */}
                        {isCartOpen && (
                            <div style={{ position: 'absolute', top: '100%', right: 0, width: '320px', background: '#FFF', border: '1px solid #EEE', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', zIndex: 1001, padding: '1.5rem', animation: 'fadeIn 0.3s' }}>
                                <h4 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '1rem', color: '#111' }}>Shopping Cart ({cartCount})</h4>
                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {cart.length > 0 ? cart.map(item => (
                                        <div key={item._id} style={{ display: 'flex', gap: '12px', marginBottom: '12px', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
                                            <img src={getImageUrl(item.image, API_URL)} style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '12px', fontWeight: '800', margin: 0, color: '#111' }}>{item.name}</p>
                                                <p style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>{item.quantity} x BDT {item.price}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                style={{ border: 'none', background: 'transparent', color: '#CCC', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )) : <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', padding: '1rem' }}>Cart is empty</p>}
                                </div>
                                {cart.length > 0 && (
                                    <div style={{ marginTop: '1.5rem', borderTop: '2px solid #111', paddingTop: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '900' }}>TOTAL</span>
                                            <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--primary)' }}>BDT {cartTotal}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => navigate('/dashboard?tab=my-cart')} style={{ flex: 1, padding: '12px', background: '#FFF', color: '#111', border: '1.5px solid #111', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}>VIEW CART</button>
                                            <button onClick={() => navigate('/dashboard?tab=my-cart')} style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: '#FFF', border: 'none', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}>CHECKOUT</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
                            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                                <div style={{ width: '28px', height: '28px', background: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={15} color="#000" />
                                </div>
                            </Link>
                            <span
                                onClick={logout}
                                style={{ fontSize: '10px', fontWeight: '900', cursor: 'pointer', color: '#666' }}
                            >
                                LOGOUT
                            </span>
                        </div>
                    ) : (
                        <Link to="/login" style={{ fontWeight: '900', fontSize: '11px', color: '#111', textDecoration: 'none' }}>LOG IN</Link>
                    )}
                </div>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            {isMobileMenuOpen && (
                <div style={{
                    background: '#FFF',
                    borderTop: '1px solid #EEE',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    animation: 'fadeInDown 0.3s'
                }}>
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '13px', fontWeight: '800', color: '#111', textDecoration: 'none' }}>HOME</Link>
                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '13px', fontWeight: '800', color: '#111', textDecoration: 'none' }}>PRODUCTS</Link>
                    <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '13px', fontWeight: '800', color: '#111', textDecoration: 'none' }}>CATEGORIES</Link>
                    {user ? (
                        <>
                            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '13px', fontWeight: '800', color: '#111', textDecoration: 'none' }}>DASHBOARD</Link>
                            <span onClick={() => { logout(); setIsMobileMenuOpen(false); }} style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', cursor: 'pointer' }}>LOGOUT</span>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', textDecoration: 'none' }}>LOG IN</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
