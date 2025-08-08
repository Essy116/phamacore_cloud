import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import cloudlogo from '../../assets/MicrosoftTeams-image.png';
import phamacore from '../../assets/phamacore.png';
import { Toast, ToastContainer } from 'react-bootstrap';
import packagesList from '../../packages.json';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { getCurrentUser } from '../APIS/headerApi';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState({
    fullname: '',
    phone: '',
    email: '',
    psCompanyName: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const [selectedPackage, setSelectedPackage] = useState(
    JSON.parse(localStorage.getItem('packages'))?.selectedPackage ||
      'phAMACore Standard'
  );
  const getUserData = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    if (!token) return;

    try {
      const response = await getCurrentUser(token);

      const { phone, organisationName, fullname, email, userId, roleId } =
        response.data;

      const phoneNo = phone.startsWith('0') ? '254' + phone.slice(1) : phone;

      setUser((prev) => ({
        ...prev,
        organisationName,
        fullname,
        email,
        phone: phoneNo,
        userId: userId || '',
        roleId: roleId || '',
      }));

      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active-link' : 'nav-link';
  };
  const pkg =
    JSON.parse(localStorage.getItem('packages'))?.selectedPackage ||
    'phAMACore Standard';
  const [brand, plan] = pkg.split(' ');
  const handleLogout = () => {
    setShowToast(true);
    setTimeout(() => {
      setToastMessage('Logout successful. Redirecting...');
      navigate('/login', { replace: true });
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }, 1000);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user?.email || localStorage.getItem('email');

    if (email) {
      getUserData(email);
    }
  }, []);

  return (
    <header className="header sticky-header">
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {localStorage.getItem('user') && (
            <div className="image-container d-flex align-items-center">
              <img src={phamacore} alt="Description" height="50px" />
              <span className="ms-3 d-flex flex-column" style={{ gap: '0' }}>
                <span style={{ color: '#c58c4f', fontSize: '16px' }}>
                  {brand}
                </span>
                <span
                  style={{
                    color: '#ff4800',
                    fontSize: '16px',
                    marginTop: '-2px',
                  }}
                >
                  {plan}
                </span>
              </span>
            </div>
          )}

          <div
            className="d-flex align-items-center"
            style={
              !localStorage.getItem('user')
                ? {
                    position: 'fixed',
                    display: 'flex',
                    top: '0',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: 'white',
                  }
                : {} // Empty style if user is logged in
            }
          >
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src={cloudlogo} alt="Logo" height="100" />
            </Link>

            <nav>
              <ul className="navbar-nav d-flex flex-row">
                <li className="nav-item">
                  <Link className={getNavLinkClass('/')} to="/">
                    Packages
                  </Link>
                </li>
                <li className="nav-item">
                  {localStorage.getItem('user') && (
                    <Link className={getNavLinkClass('/form')} to="/form">
                      Details
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>

          {localStorage.getItem('user') && (
            <div className="d-flex align-items-center">
              <div className="profile-container d-flex align-items-center">
                <div
                  className="profile-label"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ cursor: 'pointer', color: '#c58c4f' }}
                >
                  {user.fullname}
                  <i className="fas fa-caret-down "></i>
                </div>

                {showDropdown && (
                  <div className="profile-dropdown">
                    <p>
                      <i className="fas fa-user-circle"></i>{' '}
                      {user.fullname || 'User'}
                    </p>
                    <p>
                      <i className="fas fa-phone"></i> {user.phone || 'N/A'}
                    </p>
                    <p>
                      <i className="fas fa-envelope"></i> {user.email || 'N/A'}
                    </p>
                    <hr />
                    <p style={{ cursor: 'pointer' }}>
                      <i className="fas fa-sign-out-alt" onClick={handleLogout}>
                        {' '}
                        Logout
                      </i>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
