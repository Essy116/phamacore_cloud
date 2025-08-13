import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import cloudlogo from '../../assets/MicrosoftTeams-image.png';
import phamacore from '../../assets/phamacore.png';
import { Toast, ToastContainer } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { getCurrentUser } from '../APIS/headerApi';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState('phAMACore Standard');
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!storedUser;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const [userDetails, setUserDetails] = useState({
    psUserCount: '',
    psBranchCount: '',
    packageId:
      JSON.parse(localStorage.getItem('packages'))?.selectedPackageId || 2,
    additionalNotes: '',
    billingCycle: '',
    phone: '',
    email: '',
    organisationName: '',
    fullname: '',
    clientPackage: '',
  });

  const pkgName =
    JSON.parse(localStorage.getItem('packages'))?.selectedPackage ||
    'phAMACore Standard';
  const [brand = '', plan = ''] = pkgName.split(' ');

  const getUserData = async () => {
    const token = storedUser?.token;
    if (!token) return;

    try {
      const response = await getCurrentUser(token);
      const { phone, organisationName, fullname, email } = response.data;

      const formattedPhone =
        phone?.startsWith('0') && phone.length === 10
          ? '254' + phone.slice(1)
          : phone;

      setUserDetails({
        fullname,
        email,
        phone: formattedPhone,
        organisationName,
      });
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        'Failed to fetch user data. Please log in again.';
      setToastMessage(msg);
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleLogout = () => {
    setToastMessage('Logout successful. Redirecting...');
    setToastVariant('success');
    setShowToast(true);

    setTimeout(() => {
      setToastMessage('Logout successful. Redirecting...');
      navigate('/', { replace: true });
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login', { replace: true });
      window.location.reload();
    }, 1500);
  };

  const getNavLinkClass = (path) =>
    location.pathname === path ? 'nav-link active-link' : 'nav-link';

  useEffect(() => {
    if (isLoggedIn) getUserData();
  }, []);

  return (
    <header className="header sticky-header">
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {isLoggedIn && (
            <div className="image-container d-flex align-items-center">
              <img src={phamacore} alt="Phamacore Logo" height="50px" />
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
              !isLoggedIn
                ? {
                    position: 'fixed',
                    top: '0',
                    width: '100%',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    zIndex: '1000',
                  }
                : {}
            }
          >
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src={cloudlogo} alt="Main Logo" height="100" />
            </Link>

            <ul className="navbar-nav d-flex flex-row">
              <li className="nav-item">
                <Link className={getNavLinkClass('/')} to="/">
                  Packages
                </Link>
              </li>
              {isLoggedIn && (
                <li className="nav-item">
                  <Link className={getNavLinkClass('/form')} to="/form">
                    Details
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {isLoggedIn && (
            <div className="d-flex align-items-center">
              <div className="profile-container d-flex align-items-center">
                <div
                  className="profile-label"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ cursor: 'pointer', color: '#c58c4f' }}
                >
                  {userDetails.fullname}
                  <i className="fas fa-caret-down ms-2"></i>
                </div>

                {showDropdown && (
                  <div className="profile-dropdown">
                    <p>
                      <i className="fas fa-user-circle"></i>{' '}
                      {userDetails.fullname || 'User'}
                    </p>
                    <p>
                      <i className="fas fa-phone"></i>{' '}
                      {userDetails.phone || 'N/A'}
                    </p>
                    <p>
                      <i className="fas fa-envelope"></i>{' '}
                      {userDetails.email || 'N/A'}
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

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toastVariant}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </header>
  );
}
