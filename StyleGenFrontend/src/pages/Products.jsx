import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { API_URL } from '../api/api';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, Heart, ShoppingCart } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';

const Products = () => {
    const { addToCart, toggleWishlist, wishlist } = useCart();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [sortBy, setSortBy] = useState('newest'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterDrawer, setShowFilterDrawer] = useState(false);
    const productsPerPage = 6;
    const location = useLocation();

    // Get params from query string
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    const searchParam = queryParams.get('search');

    useEffect(() => {
        if (searchParam) {
            setSearchQuery(searchParam);
        } else if (!location.search.includes('search=')) {
            setSearchQuery('');
        }
    }, [searchParam, location.search]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
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

    // Optimized filtering and sorting logic
    const filteredProducts = products.filter(p => {
        // 1. Category Filter
        if (category && category !== 'lookbook') {
            const prodCatId = p.category?._id || p.category;
            const prodCatName = p.category?.name || '';
            const matches = prodCatId === category || prodCatName.toLowerCase() === category.toLowerCase();
            if (!matches) return false;
        }

        // 2. Search Filter
        if (searchQuery) {
            const matches = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matches) return false;
        }

        return true;
    }).sort((a, b) => {
        // 3. Sorting logic
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const imageUtil = (path) => getImageUrl(path, API_URL);

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ padding: '4rem 0', background: '#FAFAFA', minHeight: '80vh' }}>
            <div className="container">
                {/* PAGE HEADER */}
                <div className="products-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', textTransform: 'capitalize' }}>
                            {category ? (categories.find(c => c._id === category || c.name.toLowerCase() === category.toLowerCase())?.name || category) : 'All Products'} Collection
                        </h1>
                        <p style={{ color: '#666', marginTop: '10px' }}>Showing {filteredProducts.length} results</p>
                    </div>
                    <div className="products-controls" style={{ display: 'flex', gap: '15px', position: 'relative', alignItems: 'center' }}>
                        {/* Search Bar for performance and utility */}
                        <div style={{ position: 'relative' }}>
                            <input 
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ padding: '12px 15px 12px 40px', borderRadius: '4px', border: '1px solid #EEE', width: '250px', fontSize: '14px', outline: 'none', transition: '0.3s' }}
                            />
                            <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#AAA' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <button 
                                onClick={() => {
                                    setShowFilterDrawer(!showFilterDrawer);
                                    setShowSortDropdown(false);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', background: showFilterDrawer ? '#000' : '#FFF', color: showFilterDrawer ? '#FFF' : '#111', border: '1px solid #EEE', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', transition: '0.3s' }}
                            >
                                <Filter size={18} /> Filter
                            </button>
                            
                            {showFilterDrawer && (
                                <div style={{ position: 'absolute', top: '110%', left: 0, background: '#FFF', border: '1px solid #EEE', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 100, width: '250px', padding: '1.5rem' }}>
                                    <h4 style={{ fontWeight: '800', marginBottom: '1.2rem', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Categories</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <Link 
                                            to="/products" 
                                            onClick={() => setShowFilterDrawer(false)}
                                            style={{ textDecoration: 'none', color: !category ? 'var(--primary)' : '#666', fontWeight: !category ? '800' : '600', fontSize: '14px' }}
                                        >
                                            All Collections
                                        </Link>
                                        {categories.map(cat => (
                                            <Link 
                                                key={cat._id}
                                                to={`/products?category=${cat._id}`}
                                                onClick={() => setShowFilterDrawer(false)}
                                                style={{ textDecoration: 'none', color: category === cat._id ? 'var(--primary)' : '#666', fontWeight: category === cat._id ? '800' : '600', fontSize: '14px' }}
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <button 
                                onClick={() => {
                                    setShowSortDropdown(!showSortDropdown);
                                    setShowFilterDrawer(false);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', background: '#FFF', border: '1px solid #EEE', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', minWidth: '160px', justifyContent: 'space-between' }}
                            >
                                {sortBy === 'newest' ? 'Sort By: Newest' : sortBy === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'} <ChevronDown size={18} style={{ transform: showSortDropdown ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                            </button>
                            {showSortDropdown && (
                                <div style={{ position: 'absolute', top: '110%', right: 0, background: '#FFF', border: '1px solid #EEE', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 100, width: '220px', overflow: 'hidden' }}>
                                    {[
                                        { label: 'Newest Arrivals', value: 'newest' },
                                        { label: 'Price: Low to High', value: 'price-asc' },
                                        { label: 'Price: High to Low', value: 'price-desc' }
                                    ].map((opt) => (
                                        <div 
                                            key={opt.value}
                                            onClick={() => {
                                                setSortBy(opt.value);
                                                setShowSortDropdown(false);
                                            }}
                                            style={{ 
                                                padding: '15px 20px', 
                                                fontSize: '14px', 
                                                fontWeight: sortBy === opt.value ? '800' : '600',
                                                color: sortBy === opt.value ? 'var(--primary)' : '#111',
                                                cursor: 'pointer',
                                                background: sortBy === opt.value ? '#FAFAFA' : '#FFF',
                                                transition: '0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#F9FAFB'}
                                            onMouseLeave={(e) => e.target.style.background = sortBy === opt.value ? '#FAFAFA' : '#FFF'}
                                        >
                                            {opt.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* PRODUCT GRID */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: '450px', background: '#F3F4F6', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
                            {currentProducts.length > 0 ? currentProducts.map((product) => (
                                <div key={product._id} className="card" style={{ padding: '0', border: '1px solid #EEE', borderRadius: '4px', background: '#FFF' }}>
                                        <div style={{ position: 'relative', height: '320px', overflow: 'hidden', group: 'true' }} className="product-image-container">
                                            <Link to={`/products/${product._id}`}>
                                                <img src={imageUtil(product.image)} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} alt={product.name} loading="lazy" />
                                            </Link>
                                            {product.discount && <span style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--primary)', color: 'white', padding: '4px 10px', fontSize: '12px', fontWeight: '900', borderRadius: '2px' }}>-{product.discount}%</span>}
                                            
                                            <button 
                                                onClick={() => toggleWishlist(product)}
                                                style={{ 
                                                    position: 'absolute', 
                                                    top: '15px', 
                                                    right: '15px', 
                                                    background: '#FFF', 
                                                    border: 'none', 
                                                    width: '40px', 
                                                    height: '40px', 
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
                                                <Heart size={20} fill={wishlist.find(item => item._id === product._id) ? 'var(--primary)' : 'none'} />
                                            </button>
                                        </div>
                                        <div style={{ padding: '1.5rem' }}>
                                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111', marginBottom: '10px' }}>{product.name}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                                <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)' }}>BDT {product.price}</span>
                                                {product.discountPrice && (
                                                    <span style={{ fontSize: '14px', color: '#AAA', textDecoration: 'line-through' }}>BDT {product.discountPrice}</span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button 
                                                    className="btn btn-outline" 
                                                    onClick={() => addToCart(product)}
                                                    style={{ flex: 1, padding: '12px 5px', fontSize: '11px', fontWeight: '900' }}
                                                >
                                                    ADD TO CART
                                                </button>
                                                <button 
                                                    className="btn btn-primary" 
                                                    onClick={() => {
                                                        addToCart(product);
                                                        navigate('/checkout');
                                                    }}
                                                    style={{ flex: 1, padding: '12px 5px', fontSize: '11px', fontWeight: '900' }}
                                                >
                                                    BUY NOW
                                                </button>
                                            </div>
                                        </div>
                                </div>
                            )) : (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: '#FFF', border: '1px dotted #CCC' }}>
                                    <h3 style={{ fontWeight: '800' }}>No products found in this category.</h3>
                                    <p style={{ color: '#999', marginTop: '10px' }}>Try exploring our other premium collections.</p>
                                    <Link to="/products" style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--primary)', fontWeight: '800' }}>View All Products</Link>
                                </div>
                            )}
                        </div>

                        {/* PAGINATION BUTTONS */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '5rem' }}>
                                <button 
                                    disabled={currentPage === 1} 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    style={{ padding: '12px 25px', background: '#FFF', border: '1px solid #EEE', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '800', fontSize: '12px', opacity: currentPage === 1 ? 0.5 : 1 }}
                                >
                                    PREVIOUS
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handlePageChange(i + 1)}
                                        style={{ 
                                            width: '45px', 
                                            height: '45px', 
                                            borderRadius: '4px', 
                                            border: 'none', 
                                            background: currentPage === i + 1 ? '#000' : '#FFF', 
                                            color: currentPage === i + 1 ? '#FFF' : '#000', 
                                            fontWeight: '800', 
                                            cursor: 'pointer', 
                                            border: '1px solid #EEE',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button 
                                    disabled={currentPage === totalPages} 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    style={{ padding: '12px 25px', background: '#FFF', border: '1px solid #EEE', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '800', fontSize: '12px', opacity: currentPage === totalPages ? 0.5 : 1 }}
                                >
                                    NEXT
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;
