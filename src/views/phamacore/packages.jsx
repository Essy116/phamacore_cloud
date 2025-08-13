import { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllPackages } from '../APIS/packageApi';
import Header from '../UI/header';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('phAMACore Standard');
  const [packageCode, setPackageCode] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userType = user?.userType || user?.roleId || 'Unknown';
  const packageTrainingDays = {
    'phAMACore Lite': '6 to 8',
    'phAMACore Standard': '8 to 10',
    'phAMACore Enterprise': '8 to 10',
  };

  const maxTrainingDays = Object.fromEntries(
    Object.entries(packageTrainingDays).map(([pkg, range]) => {
      const max = range.split('to').pop().trim();
      return [pkg, Number(max)];
    })
  );

  localStorage.setItem('maxTrainingDays', JSON.stringify(maxTrainingDays));

  const fetchPackages = async () => {
    try {
      const packages = await getAllPackages();
      setPackages(packages);
    } catch (error) {
      setToastMessage(error);
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleCardClick = (pkg) => {
    if (userType === 'Client' || userType === 'Pending') {
      return;
    }

    if (selectedPackage === pkg.packageName) return;

    setSelectedPackage(pkg.packageName);
    setPackageCode(pkg.packageId);

    const stored = JSON.parse(localStorage.getItem('packages')) || {};
    localStorage.setItem(
      'packages',
      JSON.stringify({
        ...stored,
        selectedPackage: pkg.packageName,
        selectedPackageId: pkg.packageId,
      })
    );
  };

  useEffect(() => {
    const storedPackages = JSON.parse(localStorage.getItem('packages'));
    if (storedPackages?.selectedPackageId) {
      const pkg = packages.find(
        (p) => p.packageId === storedPackages.selectedPackageId
      );
      if (pkg) {
        setSelectedPackage(pkg.packageName);
        setPackageCode(pkg.packageId);
      }
    }
  }, [packages]);

  useEffect(() => {
    fetchPackages();
  }, []);
  const cardStyle = (pkgName) => ({
    border: selectedPackage === pkgName ? '5px solid #C58C4F' : 'none',
    transform: selectedPackage === pkgName ? 'scale(1.05)' : 'none',
  });

  const radioButtonStyle = {
    color: '#C58C4F',
    marginLeft: '10px',
    border: '3px solid #fff',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    appearance: 'none',
    display: 'inline-block',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };

  const radioButtonCheckedStyle = {
    border: '1px solid #C58C4F',
  };

  const footnoteStyle = {
    marginTop: 'auto',
    padding: '10px 5px',
    backgroundColor: '#f2f2f2',
    borderRadius: '5px',
    color: '#333',
    fontSize: '12px',
    textAlign: 'center',
    fontWeight: 'bold',
  };

  const popularBadgeStyle = {
    position: 'absolute',
    top: '-1em',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#C58C4F',
    color: 'white',
    padding: '0.5em 1em',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: 'bold',
    zIndex: 2,
    whiteSpace: 'nowrap',
  };

  const backgroundStyle = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0.6,
    marginTop: '3rem',
  };

  const containerStyle = {
    position: 'relative',
    zIndex: 1,
    paddingTop: '2rem',
    paddingBottom: '20px',
  };

  return (
    <>
      <Header locationpath="/" />
      <div style={backgroundStyle}></div>
      <div className="container" style={containerStyle}>
        <h4
          className="d-flex justify-content-center align-items-center"
          style={{
            padding:
              userType === 'Client' ||
              userType === 'User' ||
              userType === 'Pending'
                ? '10px 0 30px 0'
                : '110px 0 30px 0',
            fontWeight: '600',
            lineHeight: '20px',
            color: '#c58c4f',
            whiteSpace: 'nowrap',
          }}
        >
          SELECT THE PLAN THAT SUITS YOU
        </h4>

        <div className="row justify-content-center">
          {packages.map((pkg) => (
            <div className="col-md-4" key={pkg.packageId}>
              <div
                className="card h-100 w-80 shadow-lg package-card"
                style={cardStyle(pkg.packageName)}
                onClick={() => handleCardClick(pkg)}
              >
                {pkg.packageName === 'phAMACore Standard' && (
                  <div style={popularBadgeStyle}>Most Popular</div>
                )}
                <div className="card-text-top shadow d-flex justify-content-center align-items-center">
                  <h5 className="mb-0">{pkg.packageName}</h5>
                  <input
                    type="radio"
                    name="package"
                    style={{
                      ...radioButtonStyle,
                      ...(selectedPackage === pkg.packageName
                        ? radioButtonCheckedStyle
                        : {}),
                    }}
                    checked={selectedPackage === pkg.packageName}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <p style={{ fontSize: '14px', textAlign: 'center' }}>
                    {pkg.packageName} characteristics include:
                  </p>
                  <ul className="list-unstyled">
                    {pkg.features.map((feature, index) => (
                      <li key={index}>
                        <i className="bi bi-check-lg"></i> {feature}
                      </li>
                    ))}
                  </ul>
                  <div style={footnoteStyle}>
                    Training Sessions: {packageTrainingDays[pkg.packageName]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {userType !== 'Client' &&
          userType !== 'User' &&
          userType !== 'Pending' && (
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-sm my-5"
                onClick={() => navigate('/login')}
                style={{
                  backgroundColor: '#C58C4F',
                  borderColor: '#C58C4F',
                  color: '#FFF',
                  width: '20%',
                }}
              >
                Next
              </button>
            </div>
          )}
        <ToastContainer position="top-center" className="p-3">
          <Toast
            bg={toastVariant}
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={5000}
            autohide
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </>
  );
}
