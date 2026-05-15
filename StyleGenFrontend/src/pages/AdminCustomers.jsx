import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import api from '../api/api';
import { User, Mail, Calendar, Search, Trash2, Edit2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editingRole, setEditingRole] = useState('');
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const { data } = await api.get('/users');
            setCustomers(data.users || data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/users/${userId}`, { role: newRole });
            setCustomers(customers.map(c => c._id === userId ? { ...c, role: newRole } : c));
            setEditingId(null);
            toast.success('Role updated successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (err) {
            toast.error('Error updating role: ' + (err.response?.data?.message || err.message), {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleDeleteUser = async (userId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to terminate this user? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, terminate',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'swal-popup',
                confirmButton: 'swal-confirm',
                cancelButton: 'swal-cancel',
            },
        });

        if (!result.isConfirmed) return;

        try {
            setDeleting(userId);
            await api.delete(`/users/${userId}`);
            setCustomers(customers.filter(c => c._id !== userId));
            toast.success('User terminated successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (err) {
            toast.error('Error deleting user: ' + (err.response?.data?.message || err.message), {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="dashboard-container" style={{ minHeight: '100vh', background: '#F9FAFB' }}>
            <AdminSidebar />
            <AdminHeader title="User Management" />

            <main className="dashboard-main" style={{ marginLeft: '260px', padding: '2rem 3rem' }}>
                <header className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#111' }}>Users</h1>
                    <p style={{ color: '#666', marginTop: '5px' }}>View and manage all registered users.</p>
                </header>

                <div className="table-container" style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #EEE', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #EEE' }}>
                                <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '13px' }}>USER</th>
                                <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '13px' }}>EMAIL</th>
                                <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '13px' }}>ROLE</th>
                                <th style={{ padding: '15px 20px', textAlign: 'left', fontSize: '13px' }}>JOINED</th>
                                <th style={{ padding: '15px 20px', textAlign: 'center', fontSize: '13px' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</td></tr>
                            ) : customers.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>No users found</td></tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '15px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '35px', height: '35px', background: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={18} color="#666" />
                                                </div>
                                                <span style={{ fontWeight: '700' }}>{customer.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px 20px', color: '#666' }}>{customer.email}</td>
                                        <td style={{ padding: '15px 20px' }}>
                                            {editingId === customer._id ? (
                                                <select 
                                                    value={editingRole}
                                                    onChange={(e) => setEditingRole(e.target.value)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        border: '1px solid #E5E7EB',
                                                        borderRadius: '6px',
                                                        fontSize: '12px',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                <span style={{ background: customer.role === 'admin' ? '#EEF2FF' : '#F3F4F6', color: customer.role === 'admin' ? '#4F46E5' : '#666', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>
                                                    {customer.role.toUpperCase()}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '15px 20px', color: '#999', fontSize: '13px' }}>
                                            {new Date(customer.createdAt || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                {editingId === customer._id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleRoleChange(customer._id, editingRole)}
                                                            style={{
                                                                background: '#10B981',
                                                                color: '#FFF',
                                                                border: 'none',
                                                                padding: '6px 12px',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                fontSize: '12px',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            style={{
                                                                background: '#E5E7EB',
                                                                color: '#666',
                                                                border: 'none',
                                                                padding: '6px 12px',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                fontSize: '12px',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(customer._id);
                                                                setEditingRole(customer.role);
                                                            }}
                                                            style={{
                                                                background: '#3B82F6',
                                                                color: '#FFF',
                                                                border: 'none',
                                                                padding: '6px 10px',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}
                                                            title="Edit role"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(customer._id)}
                                                            disabled={deleting === customer._id}
                                                            style={{
                                                                background: '#EF4444',
                                                                color: '#FFF',
                                                                border: 'none',
                                                                padding: '6px 10px',
                                                                borderRadius: '6px',
                                                                cursor: deleting === customer._id ? 'not-allowed' : 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                opacity: deleting === customer._id ? 0.6 : 1
                                                            }}
                                                            title="Terminate user"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminCustomers;
