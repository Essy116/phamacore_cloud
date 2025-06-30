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
  FormCheck,
  Row,
  Col,
  Toast,
  ToastContainer,
} from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { BsLockFill } from 'react-icons/bs';
import registerUser from '../APIS/registerUser';

import cloudlogo from '../../assets/MicrosoftTeams-image.png';
import corebaseLogo from '../../assets/corebaseLogo.jpeg';
import axios from 'axios';

export default function SignIn() {
  const navigate = useNavigate();
  console.log(JSON.parse(localStorage.getItem('packages')));
  const [formErrors, setFormErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    organisationName: '',
    role: 'user',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContact = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setLoading(true);

    const result = await registerUser(formData);

    setLoading(false);

    if (!result.success) {
      if (result.errors) {
        setFormErrors(result.errors);
      } else {
        setToastMessage(result.message);
        setToastVariant('danger');
        setShowToast(true);
      }
      return;
    }

    const storedPackage = JSON.parse(localStorage.getItem('packages')) || {};
    const selectedPackage = storedPackage.selectedPackage || '';

    console.log('Stored Selected Package:', selectedPackage);

    setToastMessage('Registration successful! Redirecting to login...');
    setToastVariant('success');
    setShowToast(true);

    setTimeout(() => navigate('/login'), 3000);
  };

  const handleNextClick = () => {
    navigate('/login');
  };
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center">
      <div
        className="d-flex justify-content-start"
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '200px',
          zIndex: 1050,
          padding: '10px',
        }}
      >
        <button
          className="btn btn-sm my-5"
          onClick={handleNextClick}
          style={{
            backgroundColor: '#C58C4F',
            borderColor: '#C58C4F',
            color: '#FFF',
            width: '50%',

            position: 'relative',
          }}
        >
          Prev
        </button>
      </div>
      <div className="mx-auto">
        <Card
          className="login-card shadow h-100 py-2"
          style={{ width: '450px' }}
        >
          <CardBody className="px-3 d-flex flex-column justify-content-between m-auto">
            <div className="text-center">
              <img
                src={cloudlogo}
                alt="Logo"
                className="card-logo"
                style={{ maxWidth: '120px' }}
              />
            </div>
            <div className="text-center">
              <h5 className="mb-0">Welcome!</h5>
              <p
                className="text-secondary"
                style={{
                  marginTop: '2px',
                  marginBottom: '0',
                  fontSize: '10px',
                }}
              >
                Please enter your credentials to sign in.
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-1">
                <FormLabel className="text-secondary">Full Name</FormLabel>
                <FormControl
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="off"
                  className="custom-input"
                />
                {formErrors.fullName && (
                  <p className="text-danger">{formErrors.fullName}</p>
                )}
              </FormGroup>

              <FormGroup className="mb-1">
                <FormLabel className="text-secondary">
                  Organization Name
                </FormLabel>
                <FormControl
                  type="text"
                  name="organisationName"
                  value={formData.organisationName}
                  onChange={handleChange}
                  autoComplete="off"
                  className="custom-input"
                />
                {formErrors.organisationName && (
                  <p className="text-danger">{formErrors.organisationName}</p>
                )}
              </FormGroup>

              <Row>
                <Col md={6}>
                  <FormGroup className="mb-1">
                    <FormLabel className="text-secondary">
                      Email Address
                    </FormLabel>
                    <FormControl
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="off"
                      className="custom-input"
                    />
                    {formErrors.email && (
                      <p className="text-danger">{formErrors.email}</p>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-1">
                    <FormLabel className="text-secondary">
                      Phone Number
                    </FormLabel>
                    <PhoneInput
                      country={'ke'}
                      inputClass="form-control form-control-sm"
                      value={formData.phone}
                      onChange={handleContact}
                      inputProps={{ name: 'phone', autoComplete: 'off' }}
                      inputStyle={{ width: '100%', fontSize: '12px' }}
                      masks={{ ke: '... ... ...' }}
                      className="custom-input"
                    />
                    {formErrors.phone && (
                      <p className="text-danger">{formErrors.phone}</p>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup className="mb-1 position-relative">
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
                        id="basic-addon2"
                        role="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`fa ${
                            showPassword ? 'fa-eye-slash' : 'fa-eye'
                          } password-icon`}
                        ></i>
                      </span>
                    </div>
                    {formErrors.password && (
                      <p className="text-danger">{formErrors.password}</p>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-1 position-relative">
                    <FormLabel className="text-secondary">
                      Confirm Password
                    </FormLabel>
                    <div className="input-group">
                      <FormControl
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="custom-input"
                      />
                      <span
                        className="input-group-text bg-transparent border-start-0"
                        id="basic-addon2"
                        role="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <i
                          className={`fa ${
                            showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'
                          } password-icon`}
                        ></i>
                      </span>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="text-danger">
                        {formErrors.confirmPassword}
                      </p>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <FormCheck
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mb-1 custom-checkbox"
                  style={{ fontSize: '16px' }}
                  label={
                    <span style={{ fontSize: '10px' }}>
                      I agree to the{' '}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'rgb(197, 140, 79)',
                          textDecoration: 'none',
                          fontSize: '12px',
                        }}
                      >
                        GDPR & Data Privacy Policy
                      </a>
                    </span>
                  }
                />
              </FormGroup>

              <Button
                type="submit"
                className="auth auth-btn btn-sm custom-btn"
                style={{
                  backgroundColor: '#C58C4F',
                  borderColor: '#C58C4F',
                  color: '#FFF',
                  fontSize: '14px',
                }}
                disabled={!agreed}
              >
                Sign up
              </Button>

              {/* Toast Notification */}
              <ToastContainer position="top-end" className="p-3">
                <Toast
                  onClose={() => setShowToast(false)}
                  show={showToast}
                  delay={3000}
                  autohide
                  bg={toastVariant}
                >
                  <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
              </ToastContainer>
            </Form>
          </CardBody>
        </Card>

        <footer id="footer1">
          <div className="copy-right text-center py-2">
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
}
