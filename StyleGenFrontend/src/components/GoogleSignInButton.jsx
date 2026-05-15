import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const GoogleSignInButton = () => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        toast.success('Signed in with Google successfully!');
      } else {
        toast.error(result.message || 'Google login failed');
        console.error(result.message);
      }
    } catch (error) {
        toast.error('An unexpected error occurred during Google Sign In');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-google-wrap">
      <button type="button" className="auth-google-button" onClick={handleGoogleLogin} disabled={loading}>
        {loading ? <Loader2 size={18} className="animate-spin" /> : <span className="auth-google-button__icon">G</span>}
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default GoogleSignInButton;