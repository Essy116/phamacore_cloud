import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Card,
  CardBody,
  Toast,
  ToastContainer,
} from 'react-bootstrap';
import { BsLockFill } from 'react-icons/bs';
import loginApi from '../APIS/loginApi';
import cloudlogo from '../../assets/MicrosoftTeams-image.png';
import corebaseLogo from '../../assets/corebaseLogo.jpeg';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ userIdOrEmail: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('s_token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.userIdOrEmail)
      newErrors.userIdOrEmail = 'Email or User ID is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await loginApi({
        email: formData.userIdOrEmail,
        password: formData.password,
        token,
      });

      const selectedPackage = location.state?.selectedPackage || '';

      if (response.userType === 'User') {
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...response.userDetails,
            userType: response.userType,
            email: response.userDetails?.email,
          })
        );
      } else {
        const clientDetails = {
          ...response.clientDetails,
          userType: response.userType,
          psCusCode: response.clientDetails?.cusCode,
        };
        localStorage.setItem('user', JSON.stringify(clientDetails));
        localStorage.setItem('cusCode', response.clientDetails?.cusCode);
      }

      navigate('/form', {
        replace: true,
        state: {
          packageCode: location.state?.packageCode,
          selectedPackage,
        },
      });

      setToastMessage(response.message || 'Login successful!');
      setToastVariant('success');
      setShowToast(true);
    } catch (error) {
      console.error('Login failed:', error);
      setToastMessage('Login failed. Please check your credentials.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevClick = () => navigate('/');

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center">
      <div
        className="d-flex justify-content-start"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '200px',
          zIndex: 1050,
          padding: '10px',
        }}
      >
        <button
          className="btn btn-sm my-5"
          onClick={handlePrevClick}
          style={{
            backgroundColor: '#C58C4F',
            borderColor: '#C58C4F',
            color: '#FFF',
            width: '50%',
          }}
        >
          Prev
        </button>
      </div>

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
            <div className="text-center">
              <h5 className="mb-0">Welcome Back!</h5>
              <p className="text-secondary" style={{ fontSize: '10px' }}>
                Please enter your credentials to log in.
              </p>
            </div>

            {errors.general && (
              <p className="text-danger text-center">{errors.general}</p>
            )}

            <Form onSubmit={handleSubmit} className="flex-grow-1">
              <FormGroup className="mb-2">
                <FormLabel className="text-secondary">Email Address</FormLabel>
                <FormControl
                  type="email"
                  name="userIdOrEmail"
                  value={formData.userIdOrEmail}
                  onChange={handleChange}
                  autoComplete="off"
                  className="custom-input"
                />
                {errors.userIdOrEmail && (
                  <p className="text-danger small">{errors.userIdOrEmail}</p>
                )}
              </FormGroup>

              <FormGroup className="mb-3">
                <FormLabel className="text-secondary">Password</FormLabel>
                <div className="input-group">
                  <FormControl
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="custom-input"
                  />
                  <span
                    className="input-group-text bg-transparent border-start-0"
                    role="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-icon`}
                    />
                  </span>
                </div>
                {errors.password && (
                  <p className="text-danger small">{errors.password}</p>
                )}
              </FormGroup>

              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  className="auth auth-btn btn-sm w-100"
                  style={{
                    backgroundColor: '#C58C4F',
                    borderColor: '#C58C4F',
                    color: '#FFF',
                    fontSize: '14px',
                  }}
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="d-flex justify-content-center mt-2">
                  <p className="m-0" role="button">
                    <BsLockFill className="me-1" style={{ fontSize: 10 }} />
                    <a
                      href="/resetlink"
                      style={{
                        color: 'rgb(197, 140, 79)',
                        fontSize: 10,
                        textDecoration: 'none',
                      }}
                    >
                      Forgot Password?
                    </a>
                  </p>
                </div>

                <div className="text-center my-1">
                  <p className="m-0" style={{ color: '#6C757D' }}>
                    Don't have an account?{' '}
                    <a
                      href="/signin"
                      className="signup-link"
                      style={{ color: 'rgb(197, 140, 79)', fontSize: '14px' }}
                    >
                      Sign up
                    </a>
                  </p>
                </div>
              </div>

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
            </Form>
          </CardBody>
        </Card>

        <footer id="footer">
          <div className="copy-right text-center my-2">
            <p
              className="m-0 company-sm"
              style={{ fontWeight: 600, fontSize: '9px' }}
            >
              Powered by
            </p>
            <img
              src={corebaseLogo}
              width={15}
              className="img-fluid"
              alt="CoreBase logo"
            />
            <p className="m-0 company-lg">CoreBase Solutions</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Login;
