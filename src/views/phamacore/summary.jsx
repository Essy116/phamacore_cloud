import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast, Button } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const initialPackage = JSON.parse(
    localStorage.getItem('packages')
  )?.selectedPackage;
  const storedData = JSON.parse(localStorage.getItem('pricingData')) || {};
  const { total, vat, inclusive, oneOff, annual } = storedData;

  const handleLogout = () => {
    setToastMessage('Logout successful. Redirecting to login...');
    setToastVariant('success');
    setShowToast(true);

    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login', { replace: true });
    }, 1500);
  };

  return (
    <div className="container-fluid my-5 d-flex flex-column align-items-center">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        bg={toastVariant}
        delay={3000}
        autohide
        className="position-fixed top-0 start-0 end-0 w-100 mt-3 px-3"
      >
        <Toast.Body className="text-white text-center">
          {toastMessage}
        </Toast.Body>
      </Toast>

      <Button
        onClick={handleLogout}
        variant="danger"
        className="btn-sm align-self-end mb-3"
      >
        Logout
      </Button>

      <div className="card shadow w-100" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <h3
            className="mb-4"
            style={{
              fontSize: '24px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
            }}
          >
            Client Summary
          </h3>

          <form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.fullname || ''}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData?.email || ''}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.phone || ''}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Package</label>
                <input
                  type="text"
                  className="form-control"
                  value={initialPackage || ''}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Billing Cycle</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.billingCycle || ''}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Branches</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.branchCount || ''}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Users</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.userCount || ''}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Additional Notes</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.additionalNotes || ''}
                  readOnly
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Total</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${new Intl.NumberFormat('en-GB').format(total)} Ksh`}
                  readOnly
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">VAT (16%)</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${new Intl.NumberFormat('en-GB').format(vat)} Ksh`}
                  readOnly
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Inclusive</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${new Intl.NumberFormat('en-GB').format(inclusive)} Ksh`}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">One-off</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${new Intl.NumberFormat('en-GB').format(oneOff)} Ksh`}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Annual</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${new Intl.NumberFormat('en-GB').format(annual)} Ksh`}
                  readOnly
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Summary;
