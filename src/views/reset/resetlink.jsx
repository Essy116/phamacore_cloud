import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Toast,
  ToastContainer,
} from 'react-bootstrap';
import cloudlogo from '../../assets/MicrosoftTeams-image.png';
import { resetPasswordRequest } from '../APIS/resetlinkApi.js';
import corebaseLogo from '../../assets/corebaseLogo.jpeg';

const ResetLink = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrors({});
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!email.includes('@')) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);

    try {
      const response = await resetPasswordRequest(email);

      const { success, message } = response?.data || {};

      if (success) {
        setToastMessage(
          'Please check your inbox for the reset link to continue the password reset process.'
        );
        setEmail('');
        setToastVariant('success');
        setShowToast(true);
      } else {
        setToastMessage(message || 'Failed to send reset link.');
        setToastVariant('danger');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Reset link error:', error);
      setToastMessage(
        error.response?.data?.message || 'Something went wrong. Try again.'
      );
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center">
      <div className="mx-auto w-100" style={{ maxWidth: '450px' }}>
        <Card className="login-card shadow w-100 h-auto">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            bg={toastVariant}
            delay={8000}
            autohide
            className="position-absolute top-0 start-10 translate-middle-x mt-3"
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>

          <CardBody className="d-flex flex-column justify-content-between p-4 flex-grow-1">
            <div className="text-center">
              <img
                src={cloudlogo}
                alt="Logo"
                className="card-logo"
                style={{ maxWidth: '120px' }}
              />
            </div>
            <div className="text-center mb-2">
              <h5 className="mb-1">Forgot Password</h5>
              <p className="mb-0 text-secondary" style={{ fontSize: '10px' }}>
                Please enter your email to reset your password
              </p>
            </div>

            <Form onSubmit={handleSubmit} autoComplete="off">
              <FormGroup className="mb-2 position-relative">
                <FormLabel className="text-secondary">Email</FormLabel>
                <FormControl
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  autoComplete="off"
                  className="custom-input"
                />
                {errors.email && (
                  <p className="text-danger small">{errors.email}</p>
                )}
              </FormGroup>
              <div className="d-grid gap-2">
                <Row className="justify-content-between gx-2">
                  <Col xs={6} className="d-flex justify-content-center">
                    <Button
                      type="submit"
                      className="auth auth-btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{
                        backgroundColor: '#228B22',
                        borderColor: '#228B22',
                        color: '#FFF',
                        fontSize: '14px',
                        maxWidth: '200px',
                      }}
                      disabled={loading}
                    >
                      {loading && (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      )}
                      {loading ? 'Processing...' : 'Reset'}
                    </Button>
                  </Col>

                  <Col xs={6} className="d-flex justify-content-center">
                    <Button
                      type="button"
                      className="auth auth-btn btn-sm w-100"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#C58C4F',
                        color: '#C58C4F',
                        fontSize: '14px',
                        maxWidth: '200px',
                      }}
                      onClick={() => navigate('/login')}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
          </CardBody>
        </Card>
        <footer id="footer">
          <div className="copy-right text-center my-2">
            <p
              className="m-0 company-sm"
              style={{
                fontWeight: '600',
                fontSize: '9px',
              }}
            >
              Powered by
            </p>
            <img
              src={corebaseLogo}
              width={15}
              className="img-fluid"
              alt="company brand logo"
            />
            <p className="m-0 company-lg">CoreBase Solutions</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ResetLink;
