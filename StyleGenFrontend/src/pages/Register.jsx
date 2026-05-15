import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await register(formData.name, formData.email, formData.password);
            if (result.success) {
                toast.success('Registration successful! Please login.');
                navigate('/login', { state: location.state || undefined, replace: true });
            } else {
                setError(result.message);
                toast.error(result.message);
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            eyebrow="Create account"
            title="Join StyleGen"
            description="Create your account and start managing your store from one place."
        >
            <div className="auth-card" style={{ background: '#FFF', padding: '3rem', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', width: '50px', height: '50px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem', fontWeight: '900' }}>S</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Create account</h2>
                    <p style={{ color: '#999', fontSize: '14px' }}>Join our premium artisan community today</p>
                </div>

                {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '12px', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#555' }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: '12px 15px', border: '1px solid #DDD', borderRadius: '4px', outline: 'none' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#555' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '12px 15px', border: '1px solid #DDD', borderRadius: '4px', outline: 'none' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#555' }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{ width: '100%', padding: '12px 15px', border: '1px solid #DDD', borderRadius: '4px', outline: 'none' }}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '15px', fontWeight: '800', fontSize: '1rem', marginTop: '1rem' }}>
                        {loading ? 'PROCESSING...' : 'GET STARTED'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.25rem 0' }}>
                    <span style={{ flex: 1, height: '1px', background: '#eee' }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.18em', color: '#999' }}>OR</span>
                    <span style={{ flex: 1, height: '1px', background: '#eee' }} />
                </div>

                <GoogleSignInButton />

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '14px', color: '#666' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '800' }}>Sign in here</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Register;
