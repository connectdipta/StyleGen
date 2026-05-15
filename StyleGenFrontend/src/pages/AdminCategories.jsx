import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import api, { API_URL } from '../api/api';
import { Plus, Edit, Trash2, X, Upload, Loader2 } from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import { getImageUrl } from '../utils/imageUtils';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [localPreview, setLocalPreview] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/category');
            setCategories(data.categories || data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
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

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setLocalPreview(reader.result);
        };
        reader.readAsDataURL(file);

        setUploadingImage(true);
        try {
            const url = await uploadToImgbb(file);
            setFormData(prev => ({ ...prev, image: url }));
            toast.success('Image uploaded successfully');
        } catch (err) {
            toast.error('Failed to upload image. Please try again.');
            // We keep the local preview so the user sees what they tried to upload
        } finally {
            setUploadingImage(false);
        }
    };

    const handleOpenModal = (cat = null) => {
        if (cat) {
            setEditingCategory(cat);
            setFormData({
                name: cat.name,
                description: cat.description,
                image: cat.image
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
                image: ''
            });
        }
        setLocalPreview('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image) {
            toast.error('Please upload a category image');
            return;
        }

        if (!formData.name.trim() || !formData.description.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        setSubmitting(true);
        try {
            if (editingCategory) {
                await api.put(`/category/${editingCategory._id}`, {
                    name: formData.name,
                    description: formData.description,
                    image: formData.image
                });
                toast.success('Category updated successfully');
            } else {
                await api.post('/category', {
                    name: formData.name,
                    description: formData.description,
                    image: formData.image
                });
                toast.success('Category created successfully');
            }
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Category?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/category/${id}`);
            setCategories(categories.filter(c => c._id !== id));
            toast.success('Category deleted successfully');
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    return (
        <div className="dashboard-container">
            <AdminSidebar />
            <div style={{ flex: 1, minWidth: 0 }}>
                <AdminHeader title="Category Management" />
                <main className="dashboard-main">
                <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: '950', color: '#111', letterSpacing: '-1.5px' }}>Product Categories</h1>
                        <p style={{ color: '#666', fontWeight: '500' }}>Manage artisanal collections and grouping rules.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        style={{
                            background: '#FF4D1C', color: '#FFF', padding: '15px 30px', border: 'none', borderRadius: '8px',
                            fontWeight: '900', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                        }}
                    >
                        <Plus size={18} /> ADD NEW CATEGORY
                    </button>
                </div>

                <div className="table-container" style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F1F1F1', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#FBFBFC', borderBottom: '1px solid #F1F1F1' }}>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#999', letterSpacing: '1px' }}>IMAGE</th>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#999', letterSpacing: '1px' }}>CATEGORY NAME</th>
                                <th style={{ padding: '20px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#999', letterSpacing: '1px' }}>DESCRIPTION</th>
                                <th style={{ padding: '20px', textAlign: 'right', fontSize: '12px', fontWeight: '900', color: '#999', letterSpacing: '1px' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', fontWeight: '800' }}>LOADING DATA...</td></tr>
                            ) : categories.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#999', fontWeight: '600' }}>No categories found. Create your first one!</td></tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat._id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                                        <td style={{ padding: '20px' }}>
                                            <img 
                                                src={getImageUrl(cat.image, API_URL)} 
                                                alt={cat.name}
                                                style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                                                loading="lazy"
                                            />
                                        </td>
                                        <td style={{ padding: '20px', fontWeight: '800', color: '#111', fontSize: '15px' }}>{cat.name}</td>
                                        <td style={{ padding: '20px', color: '#666', fontWeight: '600', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {cat.description}
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleOpenModal(cat)} style={{ color: '#666', border: 'none', background: 'none', cursor: 'pointer', padding: '8px' }} title="Edit"><Edit size={18} /></button>
                                                <button onClick={() => handleDelete(cat._id)} style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer', padding: '8px' }} title="Delete"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* CREATE/EDIT MODAL */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflow: 'auto' }}>
                    <div className="modal-container" style={{ background: 'white', width: '550px', borderRadius: '12px', padding: '2.5rem', margin: '2rem auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontWeight: '900', fontSize: '1.5rem' }}>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            {/* Image Upload */}
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '10px' }}>Category Image *</label>
                                
                                {!formData.image && !localPreview ? (
                                    <div style={{ 
                                        border: '2px dashed #FF4D1C', 
                                        borderRadius: '8px', 
                                        padding: '1.5rem', 
                                        textAlign: 'center',
                                        background: '#FFF8F5',
                                        cursor: uploadingImage ? 'not-allowed' : 'pointer',
                                        position: 'relative',
                                        transition: 'all 0.3s'
                                    }}>
                                        <Upload size={28} color="#FF4D1C" style={{ marginBottom: '8px' }} />
                                        <p style={{ fontWeight: '800', margin: '8px 0 4px' }}>
                                            {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Max 5MB</p>

                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            disabled={uploadingImage}
                                            style={{ 
                                                position: 'absolute', 
                                                inset: 0, 
                                                opacity: 0, 
                                                cursor: uploadingImage ? 'not-allowed' : 'pointer',
                                                zIndex: 10
                                            }} 
                                        />
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                        <img 
                                            src={localPreview || getImageUrl(formData.image, API_URL)} 
                                            alt="Preview"
                                            style={{ 
                                                width: '100%', 
                                                height: '200px', 
                                                borderRadius: '8px', 
                                                objectFit: 'cover',
                                                border: '2px solid #FF4D1C',
                                                display: 'block'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, image: '' });
                                                setLocalPreview('');
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: '#EF4444',
                                                color: '#FFF',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '32px',
                                                height: '32px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                            }}
                                            title="Remove image"
                                        >×</button>
                                        <p style={{ fontSize: '12px', color: uploadingImage ? '#666' : (formData.image ? '#059669' : '#EF4444'), fontWeight: '600', marginTop: '8px', textAlign: 'center' }}>
                                            {uploadingImage ? '⌛ Uploading to server...' : (formData.image ? '✓ Image uploaded successfully' : '❌ Upload failed. Please try another image.')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Name Field */}
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>Category Name *</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Shoes, Wallets, Bags"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EEE', boxSizing: 'border-box', fontWeight: '600' }}
                                />
                            </div>

                            {/* Description Field */}
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '8px' }}>Description *</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe this category..."
                                    rows="4"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #EEE', boxSizing: 'border-box', fontFamily: 'inherit', fontWeight: '600', resize: 'vertical' }}
                                />
                            </div>

                            {/* Submit Button */}
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
                                    disabled={submitting || uploadingImage || !formData.image}
                                    style={{ 
                                        flex: 2,
                                        padding: '15px', 
                                        background: submitting || uploadingImage || !formData.image ? '#CCC' : '#FF4D1C', 
                                        color: '#FFF', 
                                        border: 'none', 
                                        borderRadius: '8px', 
                                        fontWeight: '900', 
                                        cursor: submitting || uploadingImage || !formData.image ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        boxShadow: '0 4px 12px rgba(255, 77, 28, 0.2)'
                                    }}
                                >
                                    {submitting ? 'PROCESSING...' : (editingCategory ? 'UPDATE CATEGORY' : 'CREATE CATEGORY')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default AdminCategories;
