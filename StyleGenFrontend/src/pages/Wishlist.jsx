import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUtils';
import { API_URL } from '../api/api';
import { Trash2, ShoppingCart, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist, toggleWishlist, addToCart } = useCart();

    const handleMoveToCart = (product) => {
        addToCart(product);
        toggleWishlist(product);
    };

    return (
        <div style={{ minHeight: '80vh', background: '#FAFAFA', padding: '5rem 0' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '950', color: '#111', letterSpacing: '-1.5px' }}>My Wishlist</h1>
                    <p style={{ color: '#666', marginTop: '10px' }}>You have {wishlist.length} premium items in your wishlist.</p>
                </div>

                {wishlist.length > 0 ? (
                    <div style={{ background: '#FFF', borderRadius: '8px', border: '1px solid #EEE', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #EEE' }}>
                                    <th style={{ padding: '20px', fontSize: '13px', color: '#666', fontWeight: '800' }}>PRODUCT</th>
                                    <th style={{ padding: '20px', fontSize: '13px', color: '#666', fontWeight: '800' }}>PRICE</th>
                                    <th style={{ padding: '20px', fontSize: '13px', color: '#666', fontWeight: '800' }}>STATUS</th>
                                    <th style={{ padding: '20px', fontSize: '13px', color: '#666', fontWeight: '800' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wishlist.map((product) => (
                                    <tr key={product._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                <img 
                                                    src={getImageUrl(product.image, API_URL)} 
                                                    alt={product.name} 
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} 
                                                />
                                                <div>
                                                    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: '#111' }}>
                                                        <p style={{ fontWeight: '800', margin: 0, fontSize: '15px' }}>{product.name}</p>
                                                    </Link>
                                                    <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0', maxWidth: '300px' }}>{product.description?.substring(0, 60)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ fontWeight: '800', color: 'var(--primary)' }}>BDT {product.price}</span>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ 
                                                fontSize: '11px', 
                                                fontWeight: '900', 
                                                color: product.stock > 0 ? '#10B981' : '#EF4444',
                                                background: product.stock > 0 ? '#ECFDF5' : '#FEF2F2',
                                                padding: '4px 10px',
                                                borderRadius: '20px'
                                            }}>
                                                {product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                <button 
                                                    onClick={() => handleMoveToCart(product)}
                                                    disabled={product.stock <= 0}
                                                    style={{ 
                                                        background: '#111', 
                                                        color: '#FFF', 
                                                        border: 'none', 
                                                        padding: '10px 20px', 
                                                        borderRadius: '4px', 
                                                        fontSize: '11px', 
                                                        fontWeight: '900', 
                                                        cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    <ShoppingCart size={14} /> ADD TO CART
                                                </button>
                                                <button 
                                                    onClick={() => toggleWishlist(product)}
                                                    style={{ border: 'none', background: 'transparent', color: '#999', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '8rem 0', background: '#FFF', borderRadius: '8px', border: '1px dotted #CCC' }}>
                        <Heart size={60} color="#EEE" style={{ marginBottom: '2rem' }} />
                        <h2 style={{ fontWeight: '900', color: '#111' }}>Your wishlist is empty</h2>
                        <p style={{ color: '#666', marginTop: '10px' }}>Discover our latest collections and find something you love.</p>
                        <Link to="/products" style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            marginTop: '2rem', 
                            background: 'var(--primary)', 
                            color: '#FFF', 
                            textDecoration: 'none', 
                            padding: '15px 35px', 
                            borderRadius: '4px', 
                            fontWeight: '900',
                            fontSize: '12px'
                        }}>
                            CONTINUE SHOPPING <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
