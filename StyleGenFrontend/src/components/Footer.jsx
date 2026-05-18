import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">

                    {/* Brand Info */}
                    <div>
                        <Link to="/" className="footer__brand-link">
                            <div className="footer__brand-mark"></div>
                            <span className="footer__brand-name">StyleGen</span>
                        </Link>
                        <p className="footer__description">
                            Premium handcrafted leather goods for the modern professional. Quality and craftsmanship in every stitch.
                        </p>
                        <div className="footer__icon-row">
                            <Mail size={18} color="#666" style={{ cursor: 'pointer' }} />
                            <Phone size={18} color="#666" style={{ cursor: 'pointer' }} />
                            <MapPin size={18} color="#666" style={{ cursor: 'pointer' }} />
                        </div>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="footer__section-title">Customer Care</h4>
                        <div className="footer__links">
                            <Link to="#" className="footer__link">Track Order</Link>
                            <Link to="#" className="footer__link">Shipping & Returns</Link>
                            <Link to="#" className="footer__link">Store Locator</Link>
                            <Link to="#" className="footer__link">Care Guide</Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="footer__section-title">Quick Links</h4>
                        <div className="footer__links">
                            <Link to="#" className="footer__link">Privacy Policy</Link>
                            <Link to="#" className="footer__link">Terms of Service</Link>
                            <Link to="#" className="footer__link">Contact Us</Link>
                            <Link to="#" className="footer__link">About StyleGen</Link>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="footer__section-title">Join our newsletter</h4>
                        <p className="footer__newsletter-text">Get early access to new drops and exclusive offers.</p>
                        <div className="footer__newsletter">
                            <input type="email" placeholder="Your email address" className="footer__input" />
                            <button className="footer__button">JOIN</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer__bottom">
                    <p className="footer__copyright">© 2024 StyleGen Leather Craft. All rights reserved.</p>
                    <div className="footer__payments">
                        <img src="https://img.icons8.com/color/48/visa.png" className="footer__payment-icon" alt="visa" />
                        <img src="https://img.icons8.com/color/48/mastercard.png" className="footer__payment-icon" alt="mastercard" />
                        <img src="https://img.icons8.com/color/48/amex.png" className="footer__payment-icon" alt="amex" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
