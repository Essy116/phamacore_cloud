import { useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import axios from 'axios';
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
import corebaseLogo from '../../assets/corebaseLogo.jpeg';
import { resetPassword } from '../APIS/resetApi';
const Reset = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');
  const [searchParams] = useSearchParams();
  // const token = searchParams.get('s_token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { newPassword, confirmNewPassword } = formData;
    const errors = {};

    if (!newPassword) errors.newPassword = 'New Password is required';
    if (!confirmNewPassword)
      errors.confirmNewPassword = 'Confirm Password is required';
    if (newPassword !== confirmNewPassword)
      errors.confirmNewPassword = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmNewPassword,
      };

      console.log('Sending payload:', payload);

      const response = await resetPassword(payload);
      console.log('API response:', response);

      if (response.status === 200) {
        console.log('Password reset successful, navigating to login...');
        navigate('/login');
      } else {
        console.error('Reset failed with status:', response.status);
        setToastMessage(response.data.message || 'Something went wrong.');
        setToastVariant('danger');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setToastMessage(
        error.response?.data?.detail ||
          'An error occurred while resetting password.'
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
              <h5 className="mb-1">Reset Password</h5>
              <p className="mb-0 text-secondary" style={{ fontSize: '10px' }}>
                Please enter a new password
              </p>
            </div>

            {errors.general && (
              <p className="text-danger text-center">{errors.general}</p>
            )}

            <Form onSubmit={handleSubmit} autoComplete="off">
              {/* New Password */}
              <FormGroup className="mb-2 position-relative">
                <FormLabel className="text-secondary">New Password</FormLabel>
                <div className="input-group">
                  <FormControl
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    autoComplete="off"
                    className="custom-input"
                  />
                  <span
                    className="input-group-text bg-transparent"
                    role="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    <i
                      className={`fa ${
                        showNewPassword ? 'fa-eye-slash' : 'fa-eye'
                      } password-icon`}
                    ></i>
                  </span>
                </div>
                {errors.newPassword && (
                  <p className="text-danger small">{errors.newPassword}</p>
                )}
              </FormGroup>

              {/* Confirm New Password */}
              <FormGroup className="mb-2 position-relative">
                <FormLabel className="text-secondary">
                  Confirm New Password
                </FormLabel>
                <div className="input-group">
                  <FormControl
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    autoComplete="off"
                    className="custom-input"
                  />
                  <span
                    className="input-group-text bg-transparent "
                    role="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i
                      className={`fa ${
                        showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'
                      } password-icon`}
                    ></i>
                  </span>
                </div>
                {errors.confirmNewPassword && (
                  <p className="text-danger small">
                    {errors.confirmNewPassword}
                  </p>
                )}
              </FormGroup>

              {/* Buttons */}
              <div className="d-grid gap-2">
                <Row className="justify-content-center">
                  <Col md={6} className="d-flex justify-content-center">
                    <Button
                      type="submit"
                      className="auth auth-btn btn-sm"
                      style={{
                        backgroundColor: '#228B22',
                        borderColor: '#228B22',
                        color: '#FFF',
                        fontSize: '14px',
                        width: '100%', // Makes button fill its container
                        maxWidth: '200px', // Prevents it from being too wide
                      }}
                    >
                      Reset Password
                    </Button>
                  </Col>
                  <Col md={6} className="d-flex justify-content-center">
                    <Button
                      type="button"
                      className="auth auth-btn btn-sm"
                      style={{
                        backgroundColor: '#fffffF',
                        borderColor: '#C58C4F',
                        color: '#C58C4F',
                        fontSize: '14px',
                        width: '100%', // Makes button fill its container
                        maxWidth: '200px', // Prevents it from being too wide
                      }}
                      onClick={() => navigate('/login')}
                    >
                      Back to Login
                    </Button>
                  </Col>
                </Row>
                <ToastContainer position="top-end" className="p-3">
                  <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    bg={toastVariant}
                  >
                    <Toast.Body className="text-white">
                      {toastMessage}
                    </Toast.Body>
                  </Toast>
                </ToastContainer>
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

export default Reset;
