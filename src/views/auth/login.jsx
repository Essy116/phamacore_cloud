import { useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
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
      });

      if (!response.success) {
        const serverErrors = {};

        if (response.errorCode === 'NOT_FOUND') {
          serverErrors.userIdOrEmail = 'No account found with this email.';
        } else if (response.status === 500) {
          serverErrors.userIdOrEmail =
            'Internal server error. Try again later.';
        }

        setErrors(serverErrors);
        setToastMessage(response.message);
        setToastVariant('danger');
        setShowToast(true);
        return;
      }

      const selectedPackage = location.state?.selectedPackage || '';
      if (response.data.userType === 'User') {
        const userData = {
          userId: response.data.userDetails.userId,
          email: response.data.userDetails.email,
          roleId: response.data.userType,
          userType: response.data.userType,
          token: response.data.token,
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
      } else if (
        response.data.userType === 'Client' ||
        response.data.userType === 'Pending'
      ) {
        const clientDetails = {
          email: response.data.clientDetails.email,

          token: response.data.token,
          userType: response.data.userType,
        };

        localStorage.setItem('user', JSON.stringify(clientDetails));

        localStorage.setItem('token', response.data.token);
      } else {
        console.warn('Unhandled userType:', response.data.userType);
      }

      navigate('/form', {
        replace: true,
        state: {
          packageCode: location.state?.packageCode,
          selectedPackage,
        },
      });

      setToastMessage(response.data.message || 'Login successful!');
      setToastVariant('success');
      setShowToast(true);
    } catch (err) {
      console.error('Unexpected error:', err);
      setToastMessage('Something went wrong. Try again later.');
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
            <Toast
              show={showToast}
              onClose={() => setShowToast(false)}
              bg="warning"
              delay={4000}
              autohide
              className="position-absolute top-0 start-50 translate-middle-x mt-3"
            >
              <Toast.Body className="text-white">
                ⚠️ Please verify your email before logging in.
              </Toast.Body>
            </Toast>
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
