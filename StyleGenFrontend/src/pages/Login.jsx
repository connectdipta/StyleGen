import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectTo = location.state?.from
        ? `${location.state.from.pathname}${location.state.from.search || ''}${location.state.from.hash || ''}`
        : null;
    const getPostAuthPath = (role) => redirectTo || (role === 'admin' ? '/admin' : '/dashboard');

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate(getPostAuthPath(user.role), { replace: true });
        }
    }, [user, navigate, redirectTo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const result = await login(email, password);
            if (result.success) {
                toast.success('Login successful! Redirecting...');
                navigate(getPostAuthPath(result.user.role), { replace: true });
            } else {
                setError(result.message);
                toast.error(result.message);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout
            eyebrow="Sign in"
            title="Welcome back"
            description="Enter your credentials to access your portal."
        >
            <div className="auth-card" style={{ background: '#FFF', padding: '3.5rem', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', width: '100%', maxWidth: '480px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', width: '50px', height: '50px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem', fontWeight: '900' }}>S</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#111', marginBottom: '0.8rem', letterSpacing: '-1px' }}>Welcome back</h2>
                    <p style={{ color: '#666', fontSize: '15px' }}>Enter your credentials to access your portal</p>
                </div>

                {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '14px', borderRadius: '8px', marginBottom: '2rem', fontSize: '14px', textAlign: 'center', fontWeight: '700', border: '1px solid #FEE2E2' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '800', color: '#333' }}>EMAIL ADDRESS</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. admin@stylegen.com"
                            required
                            disabled={submitting}
                            style={{
                                width: '100%', padding: '15px', border: '1px solid #EEE', borderRadius: '8px',
                                outline: 'none', background: '#F9FAFB', fontSize: '15px',
                                transition: '0.3s'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '800', color: '#333' }}>PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={submitting}
                            style={{
                                width: '100%', padding: '15px', border: '1px solid #EEE', borderRadius: '8px',
                                outline: 'none', background: '#F9FAFB', fontSize: '15px',
                                transition: '0.3s'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem' }}>
                        <Link to="#" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '800' }}>Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                        style={{
                            width: '100%', padding: '18px', fontWeight: '900',
                            fontSize: '1rem', marginTop: '1rem', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                        }}
                    >
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : 'SIGN IN'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.5rem 0' }}>
                    <span style={{ flex: 1, height: '1px', background: '#eee' }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.18em', color: '#999' }}>OR</span>
                    <span style={{ flex: 1, height: '1px', background: '#eee' }} />
                </div>

                <GoogleSignInButton />

                <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '15px', color: '#666' }}>
                    New to StyleGen? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '900' }}>Join as artisan</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;
