import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap"; // Import Toast from React Bootstrap
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainingDaysMax, data, formData, alertMessage } =
    location.state || {};

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const initialPackage = JSON.parse(
    localStorage.getItem("packages")
  )?.selectedPackage;
  const storedData = JSON.parse(localStorage.getItem("pricingData")) || {};
  const { total, vat, inclusive, oneOff, annual } = storedData;

  const handleLogout = () => {
    setShowToast(true);
    setTimeout(() => {
      setToastMessage("Logout successful. Redirecting...");
      navigate("/", { replace: true });
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }, 1000);
  };

  return (
    <div>
      <div className="d-flex justify-content-end p-3">
        <p style={{ cursor: "pointer" }}>
          <i className="fas fa-sign-out-alt" onClick={handleLogout}>
            {" "}
            Logout
          </i>
        </p>
      </div>
      <ToastContainer position="top-center" className="p-3">
        <Toast
          bg={toastVariant}
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="container-fluid my-5 justify-content-center">
        <div className="d-flex justify-content-center align-items-center">
          <div
            className="card shadow my-5"
            style={{
              width: "600px",
              height: "300px",
              maxWidth: "700px",
              minHeight: "200px",
              margin: "0",
            }}
          >
            <div className="card-body summary">
              <h3
                className="d-flex justify-content-start p-1"
                style={{
                  fontSize: "24px",
                  fontFamily: "'poppins', sans-serif !important",
                  fontWeight: "600",
                  lineHeight: "1.5",
                  paddingBottom: "10px",
                }}
              >
                Client Summary
              </h3>

              {/* Display the form data here */}
              <div className="row mb-1">
                <div className="col-md-6 d-flex">
                  <div className="label" style={{ minWidth: "120px" }}>
                    <p>
                      <strong>Full Name:</strong>
                    </p>
                  </div>
                  <p>{formData?.fullname || ""}</p>
                </div>
                <div className="col-md-6 d-flex">
                  <div className="label" style={{ minWidth: "100px" }}>
                    <p>
                      <strong>Email Address:</strong>
                    </p>
                  </div>
                  <p>{formData?.emailAddress || ""}</p>
                </div>
              </div>

              {/* Other rows for Phone, Package, Organisation Name, etc. */}
              <div className="row mb-1">
                <div className="col-md-6 d-flex">
                  <div className="label" style={{ minWidth: "120px" }}>
                    <p>
                      <strong>Phone Number:</strong>
                    </p>
                  </div>
                  <p>{formData?.phone || ""}</p>
                </div>
                <div className="col-md-6 d-flex">
                  <div className="label" style={{ minWidth: "100px" }}>
                    <p>
                      <strong>Package:</strong>
                    </p>
                  </div>
                  <p>{initialPackage || ""}</p>
                </div>
              </div>

              {/* Add other rows as needed for data like Organisation Name, Branches, etc. */}

              <div className="row mb-1">
                <div className="col-md-4 d-flex">
                  <div className="label" style={{ minWidth: "60px" }}>
                    {" "}
                    <p>
                      <strong>Total:</strong>{" "}
                    </p>
                  </div>
                  <p>{new Intl.NumberFormat("en-GB").format(total)} Ksh</p>
                </div>
                <div className="col-md-4 d-flex">
                  <div className="label" style={{ minWidth: "60px" }}>
                    {" "}
                    <p>
                      <strong>VAT (16%):</strong>{" "}
                    </p>
                  </div>
                  <p>{new Intl.NumberFormat("en-GB").format(vat)} Ksh</p>
                </div>
                <div className="col-md-4 d-flex">
                  <div className="label" style={{ minWidth: "70px" }}>
                    {" "}
                    <p>
                      <strong>Inclusive:</strong>{" "}
                    </p>
                  </div>
                  <p>{new Intl.NumberFormat("en-GB").format(inclusive)} Ksh</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 d-flex">
                  <div className="label" style={{ minWidth: "60px" }}>
                    {" "}
                    <p>
                      <strong>One-off:</strong>{" "}
                    </p>
                  </div>
                  <p style={{ margin: "0" }}>
                    {new Intl.NumberFormat("en-GB").format(oneOff)} Ksh
                  </p>
                </div>
                <div className="col-md-4 d-flex">
                  <div className="label" style={{ minWidth: "60px" }}>
                    <p>
                      <strong>Annual:</strong>{" "}
                    </p>
                  </div>
                  <p style={{ margin: "0" }}>
                    {new Intl.NumberFormat("en-GB").format(annual)} Ksh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
