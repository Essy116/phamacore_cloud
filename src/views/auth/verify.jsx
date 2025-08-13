import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../APIS/verifyApi';
import { useState, useEffect } from 'react';
import { Toast, Button, Card, CardBody } from 'react-bootstrap';

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    const handleVerify = async () => {
      console.log('Token from URL:', token);

      try {
        const response = await verifyEmail(token);
        console.log('API Response:', response.data);

        setToastMessage(
          response.data?.message || 'Email verified successfully!'
        );
        setToastVariant('success');
        setShowToast(true);

        if (response.data?.success) {
          setVerificationSuccess(true);
        }
      } catch (error) {
        console.error('Error verifying email:', error);

        setToastMessage(
          error.response?.data?.message ||
            'An error occurred while verifying email. Please try again.'
        );
        setToastVariant('danger');
        setShowToast(true);
      }
    };

    if (token) {
      handleVerify();
    } else {
      setToastMessage('Verification token is missing in the URL.');
      setToastVariant('danger');
      setShowToast(true);
    }
  }, [token, navigate]);

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        bg={toastVariant}
        delay={3000}
        autohide
        className="position-absolute top-0 start-50 translate-middle-x mt-3"
      >
        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
      </Toast>

      <Card
        className="login-card shadow w-100 h-auto"
        style={{ maxWidth: '450px' }}
      >
        <CardBody className="d-flex flex-column justify-content-between p-4">
          {verificationSuccess ? (
            <div className="mt-4">
              <p className="text-success">
                ✅ You have successfully verified your email. Please click the
                button below to navigate to login.
              </p>
              <Button
                className="px-3"
                onClick={() =>
                  navigate('/login', {
                    state: {
                      toastMessage:
                        'You can now log in using your verified email.',
                      toastVariant: 'success',
                    },
                  })
                }
              >
                Login
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-danger">
                ❌ Email verification failed. Please try again later.
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Verify;
