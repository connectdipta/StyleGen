import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const GoogleSignInButton = () => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        console.error(result.message);
      }
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