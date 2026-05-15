import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToCart = (product) => {
        const isExisting = cart.find(item => item._id === product._id);
        if (isExisting) {
            toast.info(`Increased quantity for ${product.name}`);
            setCart(prev => prev.map(item => 
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            toast.success(`${product.name} added to cart`);
            setCart(prev => [...prev, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item._id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
        toast.info('Item removed from cart');
    };

    const toggleWishlist = (product) => {
        const isWishlisted = wishlist.find(item => item._id === product._id);
        if (isWishlisted) {
            toast.info('Removed from wishlist');
            setWishlist(prev => prev.filter(item => item._id !== product._id));
        } else {
            toast.success('Added to wishlist');
            setWishlist(prev => [...prev, product]);
        }
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ 
            cart, 
            wishlist, 
            addToCart, 
            removeFromCart, 
            updateQuantity,
            toggleWishlist, 
            clearCart,
            cartCount: cart.reduce((acc, item) => acc + item.quantity, 0),
            cartTotal: cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0),
            wishlistCount: wishlist.length
        }}>
            {children}
        </CartContext.Provider>
    );
};
