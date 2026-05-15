import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api, { API_URL } from '../api/api';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Heart, ShieldCheck, Leaf, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';
import shirt1 from '../assets/Hero/shirt1.avif';
import shirt2 from '../assets/Hero/shirt2.avif';
import shirt3 from '../assets/Hero/shirt3.avif';
import bag1 from '../assets/Hero/bag1.avif';
import bag2 from '../assets/Hero/bag2.avif';
import bag3 from '../assets/Hero/bag3.avif';
import shoe1 from '../assets/Hero/shoe1.avif';
import shoe2 from '../assets/Hero/shoe2.avif';
import shoe3 from '../assets/Hero/shoe3.avif';



const Home = () => {
    const { user } = useAuth();
    const { addToCart, toggleWishlist, wishlist } = useCart();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

    const heroSlides = [
        {
            title: "স্টাইলে থাকুন",
            subtitle: "শুধুই StyleGen",
            tag: "ঈদ আয়োজনে",
            desc: "Premium handcrafted leather goods for the modern professional. Quality and craftsmanship in every stitch.",
            img1: shirt1,
            img2: shirt2,
            img3: shirt3,
            accent: "var(--primary)"
        },
        {
            title: "আভিজাত্যের ছোঁয়ায়",
            subtitle: "Artisan Leather",
            tag: "নতুন সংগ্রহ",
            desc: "Discover our latest collection of premium wallets and bags, designed for elegance and durability.",
            img1: bag1,
            img2: bag2,
            img3: bag3,
            accent: "#111"
        },
        {
            title: "স্টাইলে প্রতিদিন",
            subtitle: "Urban Sneakers",
            tag: "ট্রেন্ডিং কালেকশন",
            desc: "Street style redefined. Our new sneaker collection combines bold design with all-day comfort. Perfect for your daily hustle.",
            img1: shoe1,
            img2: shoe2,
            img3: shoe3,
            accent: "#111"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroSlide(prev => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/category')
                ]);
                setProducts(productsRes.data.products || productsRes.data);
                setCategories(categoriesRes.data.categories || categoriesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const imageUtil = (path) => getImageUrl(path, API_URL);

    return (
        <div className="fade-in" style={{ background: '#FFF' }}>
            {/* HERO SECTION - DYNAMIC CAROUSEL */}
            <section className="hero-section" style={{
                height: '550px',
                background: '#111',
                overflow: 'hidden',
                display: 'flex',
                margin: '1.5rem 2rem',
                borderRadius: '8px',
                position: 'relative',
                transition: '0.5s ease-in-out'
            }}>
                {/* Background Pattern Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'url("https://www.transparenttextures.com/patterns/dark-matter.png")', opacity: 0.4, pointerEvents: 'none' }}></div>

                <div className="hero-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5%', zIndex: 5 }}>
                    <div style={{ textAlign: 'left', animation: 'fadeInLeft 0.8s ease-out' }} key={currentHeroSlide}>
                        <p style={{ color: heroSlides[currentHeroSlide].accent === '#111' ? 'var(--primary)' : heroSlides[currentHeroSlide].accent, fontWeight: '800', marginBottom: '1.2rem', fontSize: '14px', letterSpacing: '2px' }}>
                            {heroSlides[currentHeroSlide].tag}
                        </p>
                        <h1 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#FFF', lineHeight: '1', marginBottom: '1.5rem' }}>
                            {heroSlides[currentHeroSlide].title}<br />
                            <span style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                                {heroSlides[currentHeroSlide].subtitle.split(' ')[0]}
                                <div style={{ border: '3px solid #FFF', padding: '5px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '20px', height: '20px', background: 'var(--primary)' }}></div>
                                    <span style={{ fontSize: '2.5rem', letterSpacing: '-2px' }}>StyleGen</span>
                                </div>
                            </span>
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '450px', fontSize: '15px', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                            {heroSlides[currentHeroSlide].desc}
                        </p>
                        <div className="hero-buttons" style={{ display: 'flex', gap: '1.5rem' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/products')}
                                style={{ padding: '16px 45px', borderRadius: '4px', boxShadow: '0 8px 20px rgba(255, 77, 28, 0.3)' }}
                            >
                                SHOP NOW
                            </button>
                            <button
                                onClick={() => navigate('/products')}
                                style={{
                                    padding: '16px 35px',
                                    background: 'transparent',
                                    color: '#FFF',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    transition: '0.3s'
                                }}
                                onMouseEnter={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                            >
                                VIEW CATALOG
                            </button>
                        </div>
                    </div>

                    {/* Carousel Dots */}
                    <div style={{ position: 'absolute', bottom: '30px', left: '5%', display: 'flex', gap: '10px', zIndex: 10 }}>
                        {heroSlides.map((_, idx) => (
                            <div
                                key={idx}
                                onClick={() => setCurrentHeroSlide(idx)}
                                style={{
                                    width: currentHeroSlide === idx ? '40px' : '10px',
                                    height: '4px',
                                    background: currentHeroSlide === idx ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    transition: '0.3s'
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="hero-images" style={{ flex: 1.5, display: 'flex', height: '100%', position: 'relative', gap: '5px' }}>
                    <div style={{ flex: 1, height: '100%', clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0% 100%)', transform: 'translateX(20px)', transition: '0.8s ease', overflow: 'hidden' }}>
                        <img
                            src={heroSlides[currentHeroSlide].img1}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '1.2s ease' }}
                            className="hero-zoom"
                            alt=""
                        />
                    </div>
                    <div style={{ flex: 1, height: '100%', clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0% 100%)', transition: '0.8s ease 0.1s', overflow: 'hidden', zIndex: 2 }}>
                        <img
                            src={heroSlides[currentHeroSlide].img2}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '1.2s ease 0.1s' }}
                            className="hero-zoom"
                            alt=""
                        />
                    </div>
                    <div style={{ flex: 1, height: '100%', clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)', transform: 'translateX(-20px)', transition: '0.8s ease 0.2s', overflow: 'hidden' }}>
                        <img
                            src={heroSlides[currentHeroSlide].img3}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '1.2s ease 0.2s' }}
                            className="hero-zoom"
                            alt=""
                        />
                    </div>
                </div>
            </section>

            {/* CATEGORIES - FIGMA STYLE */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Shop by category</h2>
                        <Link to="/products" style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: '800', textDecoration: 'none' }}>View All Categories →</Link>
                    </div>
                    <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                        {categories.length > 0 ? (
                            categories.slice(0, 5).map((cat) => (
                                <Link
                                    to={`/products?category=${cat._id}`}
                                    key={cat._id}
                                    style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div style={{ height: '300px', background: '#F9FAFB', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid #EEE' }}>
                                        <img
                                            src={imageUtil(cat.image)}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            alt={cat.name}
                                            loading="lazy"
                                        />
                                    </div>
                                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat.name}</span>
                                </Link>
                            ))
                        ) : (
                            [...Array(5)].map((_, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ height: '300px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '1rem' }}></div>
                                    <div style={{ height: '10px', background: '#F3F4F6', width: '60%', margin: '0 auto' }}></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* FEATURED COLLECTIONS - FIGMA STYLE */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    {/* SHOES SECTION */}
                    <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Premium Shoes</h2>
                        <div style={{ width: '30px', height: '2px', background: 'var(--primary)', marginTop: '8px' }}></div>
                    </div>

                    <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '4rem' }}>
                        {products
                            .filter(p => {
                                const catName = p.category?.name?.toLowerCase() || "";
                                return catName.includes('shoe');
                            })
                            .slice(0, 5)
                            .map((product) => (
                                <div key={product._id} className="card" style={{ background: '#FFF', border: '1px solid #F3F4F6', borderRadius: '4px', position: 'relative' }}>
                                    <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                                        <Link to={`/products/${product._id}`}>
                                            <img src={imageUtil(product.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={product.name} />
                                        </Link>
                                        {product.discount && <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#FF4D1C', color: 'white', padding: '3px 7px', fontSize: '10px', fontWeight: '900' }}>-{product.discount}%</span>}

                                        <button
                                            onClick={() => toggleWishlist(product)}
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: '#FFF',
                                                border: 'none',
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                                color: wishlist.find(item => item._id === product._id) ? 'var(--primary)' : '#CCC',
                                                transition: '0.3s'
                                            }}
                                        >
                                            <Heart size={16} fill={wishlist.find(item => item._id === product._id) ? 'var(--primary)' : 'none'} />
                                        </button>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                        <h3 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '5px', height: '40px', overflow: 'hidden' }}>{product.name}</h3>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '14px' }}>BDT {product.price}</span>
                                            {product.discountPrice && (
                                                <span style={{ color: '#AAA', fontSize: '11px', textDecoration: 'line-through', marginLeft: '8px' }}>BDT {product.discountPrice}</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <button
                                                className="btn-outline"
                                                onClick={() => addToCart(product)}
                                                style={{ padding: '8px', fontSize: '10px', fontWeight: '900' }}
                                            >
                                                ADD TO CART
                                            </button>
                                            <button
                                                className="btn-primary"
                                                onClick={() => {
                                                    addToCart(product);
                                                    navigate('/checkout');
                                                }}
                                                style={{ padding: '8px', border: 'none', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}
                                            >
                                                BUY NOW
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* BAGS SECTION */}
                    <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Artisan Bags</h2>
                        <div style={{ width: '30px', height: '2px', background: 'var(--primary)', marginTop: '8px' }}></div>
                    </div>

                    <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '4rem' }}>
                        {products
                            .filter(p => {
                                const catName = p.category?.name?.toLowerCase() || "";
                                return catName.includes('bag');
                            })
                            .slice(0, 5)
                            .map((product) => (
                                <div key={product._id} className="card" style={{ background: '#FFF', border: '1px solid #F3F4F6', borderRadius: '4px', position: 'relative' }}>
                                    <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                                        <Link to={`/products/${product._id}`}>
                                            <img src={imageUtil(product.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={product.name} />
                                        </Link>
                                        {product.discount && <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#FF4D1C', color: 'white', padding: '3px 7px', fontSize: '10px', fontWeight: '900' }}>-{product.discount}%</span>}

                                        <button
                                            onClick={() => toggleWishlist(product)}
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: '#FFF',
                                                border: 'none',
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                                color: wishlist.find(item => item._id === product._id) ? 'var(--primary)' : '#CCC',
                                                transition: '0.3s'
                                            }}
                                        >
                                            <Heart size={16} fill={wishlist.find(item => item._id === product._id) ? 'var(--primary)' : 'none'} />
                                        </button>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                        <h3 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '5px', height: '40px', overflow: 'hidden' }}>{product.name}</h3>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '14px' }}>BDT {product.price}</span>
                                            {product.discountPrice && (
                                                <span style={{ color: '#AAA', fontSize: '11px', textDecoration: 'line-through', marginLeft: '8px' }}>BDT {product.discountPrice}</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <button
                                                className="btn-outline"
                                                onClick={() => addToCart(product)}
                                                style={{ padding: '8px', fontSize: '10px', fontWeight: '900' }}
                                            >
                                                ADD TO CART
                                            </button>
                                            <button
                                                className="btn-primary"
                                                onClick={() => {
                                                    addToCart(product);
                                                    navigate('/checkout');
                                                }}
                                                style={{ padding: '8px', border: 'none', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}
                                            >
                                                BUY NOW
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* WALLETS SECTION */}
                    <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Signature Wallets</h2>
                        <div style={{ width: '30px', height: '2px', background: 'var(--primary)', marginTop: '8px' }}></div>
                    </div>

                    <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '4rem' }}>
                        {products
                            .filter(p => {
                                const catName = p.category?.name?.toLowerCase() || "";
                                return catName.includes('wallet');
                            })
                            .slice(0, 5)
                            .map((product) => (
                                <div key={product._id} className="card" style={{ background: '#FFF', border: '1px solid #F3F4F6', borderRadius: '4px', position: 'relative' }}>
                                    <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                                        <Link to={`/products/${product._id}`}>
                                            <img src={imageUtil(product.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={product.name} />
                                        </Link>
                                        {product.discount && <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#FF4D1C', color: 'white', padding: '3px 7px', fontSize: '10px', fontWeight: '900' }}>-{product.discount}%</span>}

                                        <button
                                            onClick={() => toggleWishlist(product)}
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: '#FFF',
                                                border: 'none',
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                                color: wishlist.find(item => item._id === product._id) ? 'var(--primary)' : '#CCC',
                                                transition: '0.3s'
                                            }}
                                        >
                                            <Heart size={16} fill={wishlist.find(item => item._id === product._id) ? 'var(--primary)' : 'none'} />
                                        </button>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                        <h3 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '5px', height: '40px', overflow: 'hidden' }}>{product.name}</h3>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '14px' }}>BDT {product.price}</span>
                                            {product.discountPrice && (
                                                <span style={{ color: '#AAA', fontSize: '11px', textDecoration: 'line-through', marginLeft: '8px' }}>BDT {product.discountPrice}</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <button
                                                className="btn-outline"
                                                onClick={() => addToCart(product)}
                                                style={{ padding: '8px', fontSize: '10px', fontWeight: '900' }}
                                            >
                                                ADD TO CART
                                            </button>
                                            <button
                                                className="btn-primary"
                                                onClick={() => {
                                                    addToCart(product);
                                                    navigate('/checkout');
                                                }}
                                                style={{ padding: '8px', border: 'none', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}
                                            >
                                                BUY NOW
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* BELTS SECTION */}
                    <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Luxury Belts</h2>
                        <div style={{ width: '30px', height: '2px', background: 'var(--primary)', marginTop: '8px' }}></div>
                    </div>

                    <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                        {products
                            .filter(p => {
                                const catName = p.category?.name?.toLowerCase() || "";
                                return catName.includes('belt');
                            })
                            .slice(0, 5)
                            .map((product) => (
                                <div key={product._id} className="card" style={{ background: '#FFF', border: '1px solid #F3F4F6', borderRadius: '4px', position: 'relative' }}>
                                    <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                                        <Link to={`/products/${product._id}`}>
                                            <img src={imageUtil(product.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={product.name} />
                                        </Link>
                                        {product.discount && <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#FF4D1C', color: 'white', padding: '3px 7px', fontSize: '10px', fontWeight: '900' }}>-{product.discount}%</span>}

                                        <button
                                            onClick={() => toggleWishlist(product)}
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: '#FFF',
                                                border: 'none',
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                                color: wishlist.find(item => item._id === product._id) ? 'var(--primary)' : '#CCC',
                                                transition: '0.3s'
                                            }}
                                        >
                                            <Heart size={16} fill={wishlist.find(item => item._id === product._id) ? 'var(--primary)' : 'none'} />
                                        </button>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                        <h3 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '5px', height: '40px', overflow: 'hidden' }}>{product.name}</h3>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '14px' }}>BDT {product.price}</span>
                                            {product.discountPrice && (
                                                <span style={{ color: '#AAA', fontSize: '11px', textDecoration: 'line-through', marginLeft: '8px' }}>BDT {product.discountPrice}</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <button
                                                className="btn-outline"
                                                onClick={() => addToCart(product)}
                                                style={{ padding: '8px', fontSize: '10px', fontWeight: '900' }}
                                            >
                                                ADD TO CART
                                            </button>
                                            <button
                                                className="btn-primary"
                                                onClick={() => {
                                                    addToCart(product);
                                                    navigate('/checkout');
                                                }}
                                                style={{ padding: '8px', border: 'none', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}
                                            >
                                                BUY NOW
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* T-SHIRTS SECTION */}
                    <div style={{ textAlign: 'left', marginBottom: '2.5rem', marginTop: '4rem' }}>
                        <h2 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Premium T-Shirts</h2>
                        <div style={{ width: '30px', height: '2px', background: 'var(--primary)', marginTop: '8px' }}></div>
                    </div>

                    <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                        {products
                            .filter(p => {
                                const catName = p.category?.name?.toLowerCase() || "";
                                return catName.includes('shirt');
                            })
                            .slice(0, 5)
                            .map((product) => (
                                <div key={product._id} className="card" style={{ background: '#FFF', border: '1px solid #F3F4F6', borderRadius: '4px', position: 'relative' }}>
                                    <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                                        <Link to={`/products/${product._id}`}>
                                            <img src={imageUtil(product.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={product.name} />
                                        </Link>
                                        {product.discount && <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#FF4D1C', color: 'white', padding: '3px 7px', fontSize: '10px', fontWeight: '900' }}>-{product.discount}%</span>}

                                        <button
                                            onClick={() => toggleWishlist(product)}
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: '#FFF',
                                                border: 'none',
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                                color: wishlist.find(item => item._id === product._id) ? 'var(--primary)' : '#CCC',
                                                transition: '0.3s'
                                            }}
                                        >
                                            <Heart size={16} fill={wishlist.find(item => item._id === product._id) ? 'var(--primary)' : 'none'} />
                                        </button>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                        <h3 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '5px', height: '40px', overflow: 'hidden' }}>{product.name}</h3>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '14px' }}>BDT {product.price}</span>
                                            {product.discountPrice && (
                                                <span style={{ color: '#AAA', fontSize: '11px', textDecoration: 'line-through', marginLeft: '8px' }}>BDT {product.discountPrice}</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <button
                                                className="btn-outline"
                                                onClick={() => addToCart(product)}
                                                style={{ padding: '8px', fontSize: '10px', fontWeight: '900' }}
                                            >
                                                ADD TO CART
                                            </button>
                                            <button
                                                className="btn-primary"
                                                onClick={() => {
                                                    addToCart(product);
                                                    navigate('/checkout');
                                                }}
                                                style={{ padding: '8px', border: 'none', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}
                                            >
                                                BUY NOW
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            {/* CRAFTSMANSHIP - ACCURATE FIGMA LAYOUT */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div className="craft-grid" style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '1.5rem' }}>
                        {/* Big Artisan Box */}
                        <div className="craft-main-box" style={{ position: 'relative', height: '550px', background: '#000', borderRadius: '4px', overflow: 'hidden' }}>
                            <img src={imageUtil("https://i.pinimg.com/736x/a0/4e/f8/a04ef8828677ea363145d2a21bc7cb8a.jpg")} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} alt="" />
                            <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', color: '#FFF' }}>
                                <p style={{ fontSize: '12px', fontWeight: '700', marginBottom: '0.5rem' }}>Our Craftsmanship</p>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', width: '300px', lineHeight: '1.1' }}>Made by master artisans</h2>
                                <p style={{ fontSize: '13px', opacity: 0.7, maxWidth: '400px', marginBottom: '2rem' }}>Every piece is hand-stitched by master artisans with over 20 years of experience in traditional leatherwork.</p>
                                <button style={{ padding: '12px 30px', background: 'white', color: '#000', border: 'none', fontWeight: '900', fontSize: '11px', cursor: 'pointer' }}>LEARN MORE</button>
                            </div>
                        </div>

                        {/* Right Stack */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{
                                flex: 1,
                                background: `url(${imageUtil("https://i.pinimg.com/1200x/af/a3/fb/afa3fb73e331422875e097ab2509a7c5.jpg")})`,
                                backgroundSize: 'cover',
                                borderRadius: '4px',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', borderRadius: '4px' }}></div>
                                <span style={{ color: 'white', fontSize: '13px', fontWeight: '800', zIndex: 1, letterSpacing: '1px' }}>Ethical Sourcing</span>
                            </div>
                            <div style={{
                                flex: 1.2,
                                background: '#FF4D1C',
                                borderRadius: '4px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                padding: '2.5rem',
                                textAlign: 'center'
                            }}>
                                <ShieldCheck size={40} style={{ marginBottom: '1.2rem' }} />
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.8rem' }}>Lifetime Warranty</h3>
                                <p style={{ fontSize: '12px', opacity: 0.9, lineHeight: '1.6' }}>We stand by the quality of our products for a lifetime of use.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
