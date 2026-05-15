import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { signInWithPopup, signOut } from 'firebase/auth';
import { firebaseAuth, googleProvider } from '../firebase';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const loginWithGoogle = async () => {
        try {
            const firebaseResult = await signInWithPopup(firebaseAuth, googleProvider);
            const idToken = await firebaseResult.user.getIdToken();

            const { data } = await api.post('/auth/firebase', { idToken });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Google login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            return { success: true, user: data.user, message: data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        signOut(firebaseAuth).catch(() => {});
        setUser(null);
        toast.info('Logged out successfully!');
    };

    const updateProfile = async (profileData) => {
        try {
            const { data } = await api.put('/users/profile', profileData);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            toast.success('Profile updated successfully!');
            return { success: true, user: data.user };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
            return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, updateProfile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
