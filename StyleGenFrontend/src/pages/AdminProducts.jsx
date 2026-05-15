import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import api, { API_URL } from '../api/api';
import { Plus, Search, Edit, Trash2, Eye, X, Loader2, Upload, Image as ImageIcon, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const imageUtil = (path) => getImageUrl(path, API_URL);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [tempPreviews, setTempPreviews] = useState([]);
    const [previewImageIndex, setPreviewImageIndex] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discountPrice: '',
        description: '',
        stock: '',
        category: '',
        images: []
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data.products || data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/category');
            setCategories(data.categories || data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch categories');
        }
    };

    const uploadToImgbb = async (file) => {
        const formDataImg = new FormData();
        formDataImg.append('image', file);
        
        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formDataImg
            });
            const data = await response.json();
            if (data.success) {
                return data.data.url;
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.error('Image upload error:', err);
            throw err;
        }
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        
        if (formData.images.length + tempPreviews.length + files.length > 4) {
            toast.error('Maximum 4 images allowed');
            return;
        }

        // Show local previews immediately
        const newLocalPreviews = files.map(file => URL.createObjectURL(file));
        setTempPreviews(prev => [...prev, ...newLocalPreviews]);

        setUploadingImages(true);
        try {
            const uploadedUrls = [];
            for (let file of files) {
                const url = await uploadToImgbb(file);
                uploadedUrls.push(url);
            }
            
            setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
            setSelectedFiles(prev => [...prev, ...files.slice(0, 4 - prev.length)]);
            toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
        } catch (err) {
            toast.error('Failed to upload image(s)');
            // Remove local previews that failed (optional, but for now we keep them to show what failed)
        } finally {
            setUploadingImages(false);
            setTempPreviews([]); // Clear local previews once uploaded (or they will be in formData.images)
        }
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
        setSelectedFiles(newFiles);
        toast.info('Image removed');
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Product?',
            text: 'This action cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
                toast.success('Product deleted successfully');
            } catch (err) {
                toast.error('Failed to delete product');
            }
        }
    };

    const handleOpenModal = (product = null) => {
        setSelectedFiles([]);
        setTempPreviews([]);
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price,
                discountPrice: product.discountPrice || '',
                description: product.description,
                stock: product.stock,
                category: product.category?._id || product.category || '',
                images: product.images || (product.image ? [product.image] : [])
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '', price: '', discountPrice: '', description: '', stock: '', category: '', images: []
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.images.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        setSubmitting(true);
        const submitData = {
            name: formData.name,
            price: formData.price,
            discountPrice: formData.discountPrice,
            description: formData.description,
            stock: formData.stock,
            category: formData.category,
            images: formData.images,
            image: formData.images[0]
        };

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, submitData);
                toast.success('Product updated successfully');
            } else {
                await api.post('/products', submitData);
                toast.success('Product added successfully');
            }
            setModalOpen(false);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };


    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [previewProduct, setPreviewProduct] = useState(null);

    const handleViewProduct = (product) => {
        setPreviewProduct(product);
        setPreviewImageIndex(0);
        setViewModalOpen(true);
    };

    // Filtering & Pagination Logic
    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'All' || (p.category?._id || p.category) === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className="dashboard-container">
            <AdminSidebar />
            <div style={{ flex: 1, minWidth: 0 }}>
                <AdminHeader title="Product Management" />

                <main className="dashboard-main">
                <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', background: '#FFF', padding: '2rem', borderRadius: '12px', border: '1px solid #EEE' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '950', color: '#111', letterSpacing: '-1px' }}>Product Catalog</h1>
                        <p style={{ color: '#666', marginTop: '5px' }}>
                            {selectedCategory === 'All' ? 'All Collections' : `Filtered by ${categories.find(c => c._id === selectedCategory)?.name}`} 
                            ({filteredProducts.length} total)
                        </p>
                        
                        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Filter size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                <select 
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    style={{
                                        padding: '10px 15px 10px 35px',
                                        borderRadius: '8px',
                                        border: '1px solid #E5E7EB',
                                        background: '#F9FAFB',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        color: '#374151',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        minWidth: '200px'
                                    }}
                                >
                                    <option value="All">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                <input 
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    style={{
                                        padding: '10px 15px 10px 35px',
                                        borderRadius: '8px',
                                        border: '1px solid #E5E7EB',
                                        background: '#F9FAFB',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        color: '#374151',
                                        outline: 'none',
                                        minWidth: '250px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <button onClick={() => handleOpenModal()} style={{ background: '#FF4D1C', color: '#FFF', border: 'none', padding: '12px 25px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(255, 77, 28, 0.2)' }}>
                        <Plus size={20} /> ADD NEW PRODUCT
                    </button>
                </div>

                {/* Table Section */}
                <div className="table-container" style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #EEE', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #EEE' }}>
                                <th style={{ padding: '15px 20px', fontSize: '13px', color: '#666', fontWeight: '800' }}>PRODUCT</th>
                                <th style={{ padding: '15px 20px', fontSize: '13px', color: '#666', fontWeight: '800' }}>STOCK</th>
                                <th style={{ padding: '15px 20px', fontSize: '13px', color: '#666', fontWeight: '800' }}>PRICE</th>
                                <th style={{ padding: '15px 20px', fontSize: '13px', color: '#666', fontWeight: '800' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</td></tr>
                            ) : (
                                currentProducts.map((product) => (
                                    <tr key={product._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '15px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img src={imageUtil(product.image)} alt="" style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} loading="lazy" />
                                                <div>
                                                    <p style={{ fontWeight: '800', margin: 0 }}>{product.name}</p>
                                                    <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>SKU: SG-{product._id.slice(-5).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px 20px', fontWeight: '700' }}>{product.stock} in stock</td>
                                        <td style={{ padding: '15px 20px', fontWeight: '900' }}>BDT {product.price}</td>
                                        <td style={{ padding: '15px 20px' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handleViewProduct(product)} style={{ color: '#666', border: 'none', background: 'none', cursor: 'pointer' }}><Eye size={18} /></button>
                                                <button onClick={() => handleOpenModal(product)} style={{ color: '#666', border: 'none', background: 'none', cursor: 'pointer' }}><Edit size={18} /></button>
                                                <button onClick={() => handleDelete(product._id)} style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '2.5rem' }}>
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} style={{ padding: '8px 15px', background: '#FFF', border: '1px solid #EEE', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>PREV</button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} onClick={() => setCurrentPage(i + 1)} style={{ width: '35px', height: '35px', borderRadius: '6px', border: 'none', background: currentPage === i + 1 ? '#FF4D1C' : '#FFF', color: currentPage === i + 1 ? '#FFF' : '#111', fontWeight: '800', cursor: 'pointer', border: '1px solid #EEE' }}>{i + 1}</button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} style={{ padding: '8px 15px', background: '#FFF', border: '1px solid #EEE', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>NEXT</button>
                    </div>
                )}

                {/* VIEW MODAL */}
                {viewModalOpen && previewProduct && (() => {
                    const previewImages = previewProduct.images && previewProduct.images.length > 0 
                        ? previewProduct.images 
                        : [previewProduct.image];
                    
                    return (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                            <div style={{ background: 'white', width: '850px', borderRadius: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
                                <div style={{ background: '#F3F4F6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
                                    {/* Main Image Container */}
                                    <div style={{ width: '100%', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                        <img 
                                            src={imageUtil(previewImages[previewImageIndex])} 
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                            alt="" 
                                            loading="lazy"
                                        />
                                        
                                        {/* Clickable Overlays for Navigation */}
                                        {previewImages.length > 1 && (
                                            <>
                                                <div 
                                                    onClick={() => setPreviewImageIndex(prev => (prev === 0 ? previewImages.length - 1 : prev - 1))}
                                                    style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%', cursor: 'w-resize', zIndex: 5 }}
                                                    title="Previous Image"
                                                />
                                                <div 
                                                    onClick={() => setPreviewImageIndex(prev => (prev === previewImages.length - 1 ? 0 : prev + 1))}
                                                    style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%', cursor: 'e-resize', zIndex: 5 }}
                                                    title="Next Image"
                                                />
                                            </>
                                        )}

                                        {/* Navigation Arrows (Visible Feedback) */}
                                        {previewImages.length > 1 && (
                                            <>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setPreviewImageIndex(prev => (prev === 0 ? previewImages.length - 1 : prev - 1)); }}
                                                    style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', padding: '10px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <ChevronLeft size={22} />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setPreviewImageIndex(prev => (prev === previewImages.length - 1 ? 0 : prev + 1)); }}
                                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', padding: '10px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <ChevronRight size={22} />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Thumbnails */}
                                    {previewImages.length > 1 && (
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                            {previewImages.map((img, idx) => (
                                                <div 
                                                    key={idx} 
                                                    onClick={() => setPreviewImageIndex(idx)}
                                                    style={{ 
                                                        width: '55px', 
                                                        height: '55px', 
                                                        borderRadius: '8px', 
                                                        overflow: 'hidden', 
                                                        border: previewImageIndex === idx ? '2px solid #FF4D1C' : '1px solid #EEE',
                                                        cursor: 'pointer',
                                                        opacity: previewImageIndex === idx ? 1 : 0.5,
                                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        padding: '3px',
                                                        background: '#FFF'
                                                    }}
                                                >
                                                    <img src={imageUtil(img)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '3.5rem', position: 'relative' }}>
                                    <button onClick={() => setViewModalOpen(false)} style={{ position: 'absolute', top: '25px', right: '25px', border: 'none', background: '#F3F4F6', borderRadius: '50%', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={22} /></button>
                                    <h2 style={{ fontSize: '2.2rem', fontWeight: '950', marginBottom: '1rem', letterSpacing: '-1px' }}>{previewProduct.name}</h2>
                                    <p style={{ color: '#FF4D1C', fontSize: '1.8rem', fontWeight: '900', marginBottom: '2.5rem' }}>BDT {previewProduct.price}</p>
                                    <p style={{ color: '#666', lineHeight: '1.7', marginBottom: '3rem', fontSize: '1.05rem' }}>{previewProduct.description}</p>
                                    <div style={{ background: '#F9FAFB', padding: '2rem', borderRadius: '16px', border: '1px solid #F1F1F1' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <span style={{ color: '#999', fontWeight: '700', fontSize: '13px' }}>INVENTORY</span>
                                            <span style={{ fontWeight: '900', color: '#111' }}>{previewProduct.stock} Units</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#999', fontWeight: '700', fontSize: '13px' }}>CATEGORY</span>
                                            <span style={{ fontWeight: '900', color: '#FF4D1C' }}>{previewProduct.category?.name || 'Luxury Collection'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* EDIT/ADD MODAL */}
                {modalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflow: 'auto' }}>
                        <div className="modal-container" style={{ background: '#FFF', width: '800px', borderRadius: '16px', padding: '3.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2 style={{ fontWeight: '900' }}>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                                <button onClick={() => setModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '5px' }}>Product Name *</label>
                                    <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EEE', boxSizing: 'border-box' }} />
                                </div>
                                
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '5px' }}>Price (BDT) *</label>
                                    <input required type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EEE', boxSizing: 'border-box' }} />
                                </div>
                                
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '5px' }}>Stock *</label>
                                    <input required type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EEE', boxSizing: 'border-box' }} />
                                </div>
                                
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '5px' }}>Category *</label>
                                    <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EEE', boxSizing: 'border-box' }}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '5px' }}>Product Images (Up to 4) * ({formData.images.length}/4)</label>
                                    <div style={{ 
                                        border: '2px dashed #FF4D1C', 
                                        borderRadius: '8px', 
                                        padding: '2rem', 
                                        textAlign: 'center',
                                        background: '#FFF8F5',
                                        cursor: uploadingImages ? 'not-allowed' : 'pointer',
                                        position: 'relative'
                                    }}>
                                        <Upload size={32} color="#FF4D1C" style={{ marginBottom: '10px' }} />
                                        <p style={{ fontWeight: '800', margin: '10px 0 5px' }}>
                                            {uploadingImages ? 'Uploading images...' : 'Click to upload or drag images'}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Max 4 images, each up to 5MB</p>

                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            disabled={uploadingImages || (formData.images.length + tempPreviews.length >= 4)}
                                            style={{ 
                                                position: 'absolute', 
                                                inset: 0, 
                                                opacity: 0, 
                                                cursor: uploadingImages ? 'not-allowed' : 'pointer',
                                                zIndex: 10
                                            }} 
                                        />
                                    </div>
                                    
                                    {/* Image Preview Grid */}
                                    {formData.images.length > 0 && (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '15px' }}>
                                            {[...formData.images, ...tempPreviews].map((img, idx) => (
                                                <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: idx >= formData.images.length ? '2px solid #FF4D1C' : '1px solid #EEE' }}>
                                                    <img src={getImageUrl(img, API_URL)} alt={`Preview ${idx + 1}`} style={{ width: '100%', height: '100px', objectFit: 'cover', opacity: idx >= formData.images.length ? 0.6 : 1 }} />
                                                    {idx >= formData.images.length && (
                                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Loader2 size={24} className="animate-spin" color="#FF4D1C" />
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(idx)}
                                                        style={{ 
                                                            position: 'absolute', 
                                                            top: '4px', 
                                                            right: '4px', 
                                                            background: '#EF4444', 
                                                            color: '#FFF', 
                                                            border: 'none', 
                                                            borderRadius: '50%', 
                                                            width: '24px', 
                                                            height: '24px', 
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '16px',
                                                            padding: 0
                                                        }}
                                                    >×</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '5px' }}>Description *</label>
                                    <textarea 
                                        required 
                                        placeholder="Product description" 
                                        rows="3" 
                                        value={formData.description} 
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EEE', boxSizing: 'border-box', fontFamily: 'inherit' }}
                                    ></textarea>
                                </div>
                                
                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button 
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        style={{ 
                                            flex: 1,
                                            padding: '15px', 
                                            background: '#F3F4F6', 
                                            color: '#666', 
                                            border: 'none', 
                                            borderRadius: '8px', 
                                            fontWeight: '800', 
                                            cursor: 'pointer' 
                                        }}
                                    >
                                        CANCEL
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={submitting || uploadingImages || formData.images.length === 0} 
                                        style={{ 
                                            flex: 2,
                                            padding: '15px', 
                                            background: submitting || uploadingImages || formData.images.length === 0 ? '#CCC' : '#FF4D1C', 
                                            color: '#FFF', 
                                            border: 'none', 
                                            borderRadius: '8px', 
                                            fontWeight: '900', 
                                            cursor: submitting || uploadingImages || formData.images.length === 0 ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 4px 12px rgba(255, 77, 28, 0.2)'
                                        }}
                                    >
                                        {submitting ? (uploadingImages ? 'Uploading...' : 'Processing...') : (editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            </div>
        </div>
    );
};

export default AdminProducts;
