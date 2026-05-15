import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { API_URL } from '../api/api';
import { Minus, Plus, Truck, ShieldCheck, RotateCcw, Heart, Share2, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, toggleWishlist, wishlist } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(41);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const isWishlisted = product && wishlist.find(item => item._id === product._id);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/products/${id}`);
                const prodData = data.product || data;
                setProduct(prodData);
                
                // Fetch related products
                const catId = prodData.category?._id || prodData.category;
                if (catId) {
                    const relatedRes = await api.get(`/products?category=${catId}`);
                    const allProducts = relatedRes.data.products || relatedRes.data;
                    setRelatedProducts(allProducts.filter(p => p._id !== id).slice(0, 4));
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const imageUtil = (path) => getImageUrl(path, API_URL);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading premium product...</div>;
    if (!product) return <div style={{ padding: '5rem', textAlign: 'center' }}>Product not found.</div>;

    return (
        <div style={{ padding: '5rem 0', background: '#FFF' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="product-details-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '6rem', alignItems: 'start' }}>

                    {/* Left: Images FIGMA STYLE - Large & Bold */}
                    {(() => {
                        let displayImages = product.images && product.images.length > 0 ? product.images : [product.image];
                        
                        // If only one image, simulate detail shots for better UI
                        if (displayImages.length === 1) {
                            displayImages = [displayImages[0], displayImages[0], displayImages[0]];
                        }
                        
                        return (
                            <div className="product-details-images" style={{ display: 'flex', gap: '1.5rem' }}>
                                {/* THUMBNAILS - Vertical Left */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', minWidth: '80px' }}>
                                    {displayImages.map((img, i) => (
                                        <div 
                                            key={i} 
                                            onMouseEnter={() => setActiveImageIndex(i)}
                                            style={{ 
                                                width: '80px', 
                                                height: '100px', 
                                                border: activeImageIndex === i ? '2px solid #111' : '1px solid #EEE', 
                                                borderRadius: '4px', 
                                                cursor: 'pointer', 
                                                overflow: 'hidden', 
                                                opacity: activeImageIndex === i ? 1 : 0.5,
                                                transition: '0.3s'
                                            }}
                                        >
                                            <img src={imageUtil(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>

                                {/* MAIN IMAGE AREA */}
                                <div className="product-details-main-img" style={{ flex: 1, background: '#F8F8F8', borderRadius: '4px', height: '650px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                    <img 
                                        src={imageUtil(displayImages[activeImageIndex])} 
                                        alt={product.name} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'scaleUp 0.8s ease-out' }} 
                                        key={activeImageIndex}
                                    />
                                    
                                    {/* Action Buttons Floating */}
                                    <div style={{ position: 'absolute', top: '25px', right: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <button 
                                            onClick={() => toggleWishlist(product)}
                                            style={{ 
                                                background: 'white', 
                                                width: '50px', 
                                                height: '50px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                borderRadius: '50%', 
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: isWishlisted ? 'var(--primary)' : '#111',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            <Heart size={22} fill={isWishlisted ? 'var(--primary)' : 'none'} />
                                        </button>
                                        <button 
                                            onClick={handleShare}
                                            style={{ 
                                                background: 'white', 
                                                width: '50px', 
                                                height: '50px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                borderRadius: '50%', 
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#111',
                                                transition: '0.3s'
                                            }}
                                        >
                                            <Share2 size={20} />
                                        </button>
                                    </div>

                                    {/* Carousel Controls Overlay */}
                                    {displayImages.length > 1 && (
                                        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                                            {displayImages.map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    style={{ 
                                                        width: activeImageIndex === i ? '25px' : '8px', 
                                                        height: '8px', 
                                                        background: activeImageIndex === i ? '#FFF' : 'rgba(255,255,255,0.5)', 
                                                        borderRadius: '10px', 
                                                        transition: '0.4s' 
                                                    }} 
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Right: Info FIGMA STYLE - Bold UI */}
                    <div style={{ paddingTop: '1rem' }}>
                        <nav style={{ fontSize: '13px', fontWeight: '700', color: '#AAA', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Shop / {product.category?.name || 'Artisan'} / <span style={{ color: '#111' }}>{product.name}</span>
                        </nav>
                        <h1 style={{ fontSize: '3.2rem', fontWeight: '950', color: '#111', marginBottom: '1.5rem', letterSpacing: '-2px', lineHeight: '1' }}>{product.name}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '950', color: 'var(--primary)' }}>BDT {product.price}</h2>
                            {product.discountPrice && (
                                <span style={{ textDecoration: 'line-through', color: '#CCC', fontSize: '1.5rem', fontWeight: '700' }}>BDT {product.discountPrice}</span>
                            )}
                        </div>

                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '3rem', fontSize: '1.15rem' }}>{product.description}</p>

                        <div style={{ marginBottom: '3rem' }}>
                            <p style={{ fontWeight: '900', marginBottom: '1.2rem', fontSize: '14px', color: '#111', letterSpacing: '1px' }}>SELECT SIZE (EU)</p>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                {[39, 40, 41, 42, 43].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            border: '2px solid',
                                            borderColor: selectedSize === size ? 'var(--primary)' : '#F3F4F6',
                                            background: selectedSize === size ? 'var(--primary)' : '#FFF',
                                            color: selectedSize === size ? '#FFF' : '#111',
                                            borderRadius: '12px',
                                            fontWeight: '900',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '4rem' }}>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', border: '2px solid #F3F4F6', padding: '0 25px', borderRadius: '12px' }}>
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Minus size={20} /></button>
                                    <span style={{ minWidth: '40px', textAlign: 'center', fontSize: '1.4rem', fontWeight: '950' }}>{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Plus size={20} /></button>
                                </div>
                                <button 
                                    onClick={() => addToCart({ ...product, quantity, size: selectedSize })}
                                    style={{ 
                                        flex: 1, 
                                        padding: '20px', 
                                        fontWeight: '900', 
                                        fontSize: '1rem', 
                                        letterSpacing: '1px', 
                                        textTransform: 'uppercase', 
                                        background: '#FFF', 
                                        border: '2px solid #111', 
                                        borderRadius: '8px', 
                                        cursor: 'pointer',
                                        transition: '0.3s'
                                    }}
                                >
                                    ADD TO CART
                                </button>
                            </div>
                            <button 
                                onClick={() => {
                                    addToCart({ ...product, quantity, size: selectedSize });
                                    navigate('/checkout');
                                }}
                                style={{ 
                                    width: '100%', 
                                    padding: '22px', 
                                    fontWeight: '900', 
                                    fontSize: '1.1rem', 
                                    letterSpacing: '1px', 
                                    textTransform: 'uppercase', 
                                    background: 'var(--primary)', 
                                    color: '#FFF', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    boxShadow: '0 10px 25px rgba(255, 77, 28, 0.3)'
                                }}
                            >
                                BUY NOW
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', padding: '2rem', background: '#FFF', borderRadius: '8px', border: '1px solid #EEE' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '13px', fontWeight: '800', color: '#111' }}>
                                <ShieldCheck size={20} color="var(--primary)" /> 2-YEAR ARTISAN WARRANTY
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '13px', fontWeight: '800', color: '#111' }}>
                                <Truck size={20} color="var(--primary)" /> WORLDWIDE EXPRESS SHIPPING
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '13px', fontWeight: '800', color: '#111' }}>
                                <RotateCcw size={20} color="var(--primary)" /> 30-DAY HASSLE-FREE RETURNS
                            </div>
                        </div>

                        <div style={{ marginTop: '3rem', borderTop: '1px solid #EEE', paddingTop: '2.5rem' }}>
                            <h4 style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Product Specification</h4>
                            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid #F9FAFB', paddingBottom: '8px' }}>
                                    <span style={{ color: '#999', fontWeight: '700' }}>Material</span>
                                    <span style={{ fontWeight: '900' }}>Premium Italian Leather</span>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid #F9FAFB', paddingBottom: '8px' }}>
                                    <span style={{ color: '#999', fontWeight: '700' }}>Craftsmanship</span>
                                    <span style={{ fontWeight: '900' }}>Hand-stitched Artisan Grade</span>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid #F9FAFB', paddingBottom: '8px' }}>
                                    <span style={{ color: '#999', fontWeight: '700' }}>Origin</span>
                                    <span style={{ fontWeight: '900' }}>Dhaka, Bangladesh</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <div style={{ marginTop: '10rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <h2 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#999', marginBottom: '10px' }}>You may also like</h2>
                            <h3 style={{ fontSize: '2.2rem', fontWeight: '950', color: '#111', letterSpacing: '-1.5px' }}>
                                More {product.category?.name || 'Artisan'} Collections
                            </h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2.5rem' }}>
                            {relatedProducts.map(rel => (
                                <div key={rel._id} className="card" style={{ border: '1px solid #F3F4F6' }}>
                                    <Link to={`/products/${rel._id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{ height: '300px', overflow: 'hidden' }}>
                                            <img src={imageUtil(rel.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} className="zoom-on-hover" />
                                        </div>
                                    </Link>
                                    <div style={{ padding: '1.5rem' }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: '900', color: '#111', marginBottom: '8px' }}>{rel.name}</h4>
                                        <p style={{ fontWeight: '950', color: 'var(--primary)', margin: 0 }}>BDT {rel.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
