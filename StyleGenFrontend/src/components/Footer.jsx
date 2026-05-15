import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ background: '#FFF', borderTop: '1px solid #EEE', padding: '5rem 0 2rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1.2fr', gap: '3rem', marginBottom: '4rem' }}>

                    {/* Brand Info */}
                    <div>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '1.5rem' }}>
                            <div style={{ width: '25px', height: '25px', background: '#FF4D1C', borderRadius: '2px' }}></div>
                            <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#000', letterSpacing: '-1px' }}>StyleGen</span>
                        </Link>
                        <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.8', marginBottom: '2rem' }}>
                            Premium handcrafted leather goods for the modern professional. Quality and craftsmanship in every stitch.
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <Mail size={18} color="#666" style={{ cursor: 'pointer' }} />
                            <Phone size={18} color="#666" style={{ cursor: 'pointer' }} />
                            <MapPin size={18} color="#666" style={{ cursor: 'pointer' }} />
                        </div>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Customer Care</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="#" style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>Track Order</Link>
                            <Link to="#" style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>Shipping & Returns</Link>
                            <Link to="#" style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>Store Locator</Link>
                            <Link to="#" style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>Care Guide</Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Quick Links</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="#" style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>Privacy Policy</Link>
                            <Link to="#" style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>Terms of Service</Link>
                            <Link to="#" style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>Contact Us</Link>
                            <Link to="#" style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>About StyleGen</Link>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Join our newsletter</h4>
                        <p style={{ color: '#666', fontSize: '12px', marginBottom: '1.5rem' }}>Get early access to new drops and exclusive offers.</p>
                        <div style={{ display: 'flex' }}>
                            <input type="email" placeholder="Your email address" style={{ flex: 1, padding: '12px', border: '1px solid #EEE', outline: 'none', fontSize: '13px' }} />
                            <button style={{ background: '#000', color: 'white', padding: '0 20px', border: 'none', fontWeight: '900', fontSize: '11px', cursor: 'pointer' }}>JOIN</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ borderTop: '1px solid #EEE', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#999', fontSize: '12px' }}>© 2024 StyleGen Leather Craft. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <img src="https://img.icons8.com/color/48/visa.png" style={{ height: '20px', filter: 'grayscale(1)' }} alt="visa" />
                        <img src="https://img.icons8.com/color/48/mastercard.png" style={{ height: '20px', filter: 'grayscale(1)' }} alt="mastercard" />
                        <img src="https://img.icons8.com/color/48/amex.png" style={{ height: '20px', filter: 'grayscale(1)' }} alt="amex" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
