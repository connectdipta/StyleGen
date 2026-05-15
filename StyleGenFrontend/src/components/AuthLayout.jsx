const AuthLayout = ({ eyebrow, title, description, children }) => {
  return (
    <div className="auth-page">
      <div className="auth-page__panel auth-page__panel--brand">
        <div className="auth-page__badge">StyleGen</div>
        <h1>{title}</h1>
        <p>{description}</p>

        <div className="auth-page__points">
          <div className="auth-page__point">
            <span>01</span>
            <div>
              <strong>Secure access</strong>
              <p>Keep your account protected with a fast login experience.</p>
            </div>
          </div>
          <div className="auth-page__point">
            <span>02</span>
            <div>
              <strong>Simple onboarding</strong>
              <p>Create an account in seconds and get right back to shopping.</p>
            </div>
          </div>
          <div className="auth-page__point">
            <span>03</span>
            <div>
              <strong>Artisan focused</strong>
              <p>Access the tools you need to manage products and orders.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-page__panel auth-page__panel--form">
        <div className="auth-page__eyebrow">{eyebrow}</div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;