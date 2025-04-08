import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "react-bootstrap";
import cloudlogo from "../../assets/MicrosoftTeams-image.png";
import corebaseLogo from "../../assets/corebaseLogo.jpeg";
const Reset = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("danger");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.newPassword)
      newErrors.newPassword = "New Password is required";
    if (!formData.confirmNewPassword)
      newErrors.confirmNewPassword = "Confirm New Password is required";
    if (formData.newPassword !== formData.confirmNewPassword)
      newErrors.confirmNewPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const resetToken = localStorage.getItem("resetauthToken");

      console.log("Reset Token:", resetToken);

      await axios.post(
        "http://20.164.20.36:86/api/auth/ResetPassword",
        {
          token: resetToken,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmNewPassword,
          role: "User",
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            accessKey:
              "R0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9",
          },
        }
      );

      navigate("/login");
    } catch (error) {
      console.error("Reset Error:", error);

      const errorMessage =
        error.response?.data?.message || "Something went wrong. Try again.";
      setToastMessage(errorMessage);
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center">
      <div className="mx-auto w-100" style={{ maxWidth: "450px" }}>
        <Card className="login-card shadow w-100 h-auto">
          <CardBody className="d-flex flex-column justify-content-between p-4 flex-grow-1">
            <div className="text-center">
              <img
                src={cloudlogo}
                alt="Logo"
                className="card-logo"
                style={{ maxWidth: "120px" }}
              />
            </div>
            <div className="text-center mb-2">
              <h5 className="mb-1">Reset Password</h5>
              <p class="mb-0 text-secondary" style={{ fontSize: "10px" }}>
                Please enter a new password
              </p>
            </div>

            {errors.general && (
              <p className="text-danger text-center">{errors.general}</p>
            )}

            <Form onSubmit={handleSubmit} autocomplete="off">
              {/* New Password */}
              <FormGroup className="mb-2 position-relative">
                <FormLabel className="text-secondary">New Password</FormLabel>
                <div className="input-group">
                  <FormControl
                    type={showNewPassword ? "text" : "password"}
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
                        showNewPassword ? "fa-eye-slash" : "fa-eye"
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
                    type={showConfirmPassword ? "text" : "password"}
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
                        showConfirmPassword ? "fa-eye-slash" : "fa-eye"
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
                        backgroundColor: "#228B22",
                        borderColor: "#228B22",
                        color: "#FFF",
                        fontSize: "14px",
                        width: "100%", // Makes button fill its container
                        maxWidth: "200px", // Prevents it from being too wide
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
                        backgroundColor: "#fffffF",
                        borderColor: "#C58C4F",
                        color: "#C58C4F",
                        fontSize: "14px",
                        width: "100%", // Makes button fill its container
                        maxWidth: "200px", // Prevents it from being too wide
                      }}
                      onClick={() => navigate("/login")}
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
                fontWeight: "600",
                fontSize: "9px",
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
