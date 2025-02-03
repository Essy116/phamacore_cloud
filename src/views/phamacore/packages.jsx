import React, { useState } from "react";
import Header from "../UI/header";
import { useNavigate, useLocation } from "react-router-dom";

let packagesList = [
  { packageNum: "PK001", description: "phAMACore Lite" },
  { packageNum: "PK002", description: "phAMACore Standard" },
  { packageNum: "PK003", description: "phAMACore Enterprise" },
];

export default function Packages() {
  const location = useLocation();
  const [packageCode, setPackageCode] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(
    location.state?.package?.pkg || "phAMACore Standard"
  );
  const navigate = useNavigate();

  const handleCardClick = (packageId) => {
    setPackageCode(
      packagesList.find((pkg) => pkg.description === packageId)?.packageNum
    );
    setSelectedPackage(packageId);
  };

  const cardStyle = (packageId) => ({
    border: selectedPackage === packageId ? "5px solid #C58C4F " : "none",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transform: selectedPackage === packageId ? "scale(1.05)" : "none",ion: "relative",
  });

  const handleNextClick = () => {
    const maxTrainingDays =
      packageTrainingDays[selectedPackage].split(" to ")[1];
    navigate("/form", {
      replace: true,
      state: {
        selectedPackage,
        maxTrainingDays,
        from: location.pathname,
        packageCode: packageCode,
      },
    });
  };

  const backgroundStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0.6,
    marginTop: "3rem",
  };

  const containerStyle = {
    position: "relative",
    zIndex: 1,
    paddingTop: "2rem",
  };

  const radioButtonStyle = {
    color: "#C58C4F",
    marginLeft: "10px",
    border: "3px solid #fff",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    appearance: "none",
    display: "inline-block",
    verticalAlign: "middle",
    position: "relative",
    cursor: "pointer",
  };

  const radioButtonCheckedStyle = {
    border: "1px solid #C58C4F",
  };

  const footnoteStyle = {
    marginTop: "auto",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "5px",
    color: "#333",
    fontSize: "0.875rem",
    textAlign: "center",
    fontWeight: "bold",
  };

  const popularBadgeStyle = {
    position: "absolute",
    top: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#C58C4F",
    color: "white",
    padding: "5px 15px",
    borderRadius: "15px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    zIndex: 2,
  };

  const packageTrainingDays = {
    "phAMACore Lite": "6 to 8",
    "phAMACore Standard": "8 to 10",
    "phAMACore Enterprise": "8 to 10",
  };

  const packageCharacteristics = {
    "phAMACore Lite": [
      "For 1 branch with 2-5 concurrent Users.",
      "Purchase/Supplier Management.",
      "Inventory Management.",
      "Customer/Sales Manager.",
      "Quotations and Credit Notes.",
      "Stock levels Tracking.",
      "Cashier till manager.",
      "Multiple sales price selection.",
      "Batch tracking and expiry management.",
      "Barcode, M-pesa and SMS integrations.",
    ],
    "phAMACore Standard": [
      "All the modules in the Lite Package.",
      "2-8 branches with a multiple number of concurrent users.",
      "Top-level Sales and Profit Dashboard.",
      "Insurance integration (Smart, Slade, MTIBA, TLC) and copay management.",
      "Patient refills tracking and dosage labels.",
      "General Ledger.",
      "Smart Ordering for projections.",
      "Branches Order consolidation.",
      "Multiple stock-take options.",
      "Branches stock Management.",
    ],
    "phAMACore Enterprise": [
      "All the modules in both the Lite and the Standard Package.",
      "Multiple Branches with a multiple number of concurrent users.",
      "Customer portal.",
      "Supplier portal.",
      "Loyalty points and sales promotions.",
      "Customer self-checkout (QR code).",
      "Prescription management.",
      "Consultation Module.",
      "E-tims or Tims Integration.",
      "Sales document & dispatch tracking.",
    ],
  };

  return (
    <>
      <Header locationpath={"/"} />
      <div style={backgroundStyle}></div>
      <div className="container" style={containerStyle}>
        <h1
          className="d-flex justify-content-center align-items-center  "
          style={{
            padding: "10px",
            fontSize: "2rem",
            fontWeight: "800",
            lineHeight: "50px",
            color: "#c58c4f",
            fontFamily: " 'Poppins', sans-serif !important",
            whiteSpace: "nowrap",
            alignItems: "center",
          }}
        >
         Choose the plan that’s right for you

        </h1>
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div
              className="card h-100 shadow-lg package-card"
              style={cardStyle("phAMACore Lite")}
              onClick={() => handleCardClick("phAMACore Lite")}
            >
              
              <div className="card-text-top shadow d-flex justify-content-center align-items-center">
                <h4
                  className="mb-0"
                  style={{
                    fontSize: "1.25rem",
                    fontFamily: " 'poppins', sans-serif !important",
                    lineHeight: "1.5",
                    fontWeight: "700",
                  }}
                >
                  phAMACore Lite
                </h4>
                <input
                  type="radio"
                  name="package"
                  style={{
                    ...radioButtonStyle,
                    ...(selectedPackage === "phAMACore Lite"
                      ? radioButtonCheckedStyle
                      : {}),
                  }}
                  checked={selectedPackage === "phAMACore Lite"}
                  onChange={() => handleCardClick("phAMACore Lite")}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h2
                  style={{
                    fontSize: "1rem",

                    fontFamily: "'poppins', sans-serif !important",
                    fontWeight: "400",
                    lineHeight: "1.5",
                  }}
                >
                  Phamacore Lite characteristics include:
                </h2>
                <ul className="list-unstyled">
                  {packageCharacteristics["phAMACore Lite"].map(
                    (char, index) => (
                      <li key={index}>
                        <i className="bi bi-check-lg"></i> {char}
                      </li>
                    )
                  )}
                </ul>
                <div style={footnoteStyle}>
                  Training Sessions: {packageTrainingDays["phAMACore Lite"]}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card h-100 shadow-lg package-card"
              style={cardStyle("phAMACore Standard")}
              onClick={() => handleCardClick("phAMACore Standard")}
            >
            <div style={popularBadgeStyle}>Most Popular</div>
              <div className="card-text-top shadow d-flex justify-content-center align-items-center">
                <h4
                  className="mb-0"
                  style={{
                    fontSize: "1.25rem",
                    fontFamily: " 'poppins', sans-serif !important",
                    lineHeight: "1.5",
                    fontWeight: "700",
                  }}
                >
                  phAMACore Standard
                </h4>
                <input
                  type="radio"
                  name="package"
                  style={{
                    ...radioButtonStyle,
                    ...(selectedPackage === "phAMACore Standard"
                      ? radioButtonCheckedStyle
                      : {}),
                  }}
                  checked={selectedPackage === "phAMACore Standard"}
                  onChange={() => handleCardClick("phAMACore Standard")}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h2
                  style={{
                    fontSize: "1rem",

                    fontFamily: "'poppins', sans-serif !important",
                    fontWeight: "400",
                    lineHeight: "1.5",
                  }}
                >
                  Phamacore Standard characteristics include:
                </h2>
                <ul className="list-unstyled">
                  {packageCharacteristics["phAMACore Standard"].map(
                    (char, index) => (
                      <li key={index}>
                        <i className="bi bi-check-lg"></i> {char}
                      </li>
                    )
                  )}
                </ul>
                <div style={footnoteStyle}>
                  Training Sessions: {packageTrainingDays["phAMACore Standard"]}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card shadow-lg h-100 package-card"
              style={cardStyle("phAMACore Enterprise")}
              onClick={() => handleCardClick("phAMACore Enterprise")}
            >
              <div className="card-text-top shadow d-flex justify-content-center align-items-center">
                <h4
                  className="mb-0"
                  style={{
                    fontSize: "1.25rem",
                    fontFamily: " 'poppins', sans-serif !important",
                    lineHeight: "1.5",
                    fontWeight: "700",
                  }}
                >
                  phAMACore Enterprise
                </h4>
                <input
                  type="radio"
                  name="package"
                  style={{
                    ...radioButtonStyle,
                    ...(selectedPackage === "phAMACore Enterprise"
                      ? radioButtonCheckedStyle
                      : {}),
                  }}
                  checked={selectedPackage === "phAMACore Enterprise"}
                  onChange={() => handleCardClick("phAMACore Enterprise")}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h2
                  style={{
                    fontSize: "1rem",

                    fontFamily: "'poppins', sans-serif !important",
                    fontWeight: "400",
                    lineHeight: "1.5",
                  }}
                >
                  Phamacore Enterprise characteristics include:
                </h2>
                <ul className="list-unstyled">
                  {packageCharacteristics["phAMACore Enterprise"].map(
                    (char, index) => (
                      <li key={index}>
                        <i className="bi bi-check-lg"></i> {char}
                      </li>
                    )
                  )}
                </ul>
                <div style={footnoteStyle}>
                  Training Sessions:{" "}
                  {packageTrainingDays["phAMACore Enterprise"]}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end ">
          <button
            className="btn btn-primary my-5"
            onClick={handleNextClick}
            style={{
              backgroundColor: "#C58C4F",
              borderColor: "#C58C4F",
              padding: "10px 20px",
              fontSize: "1.2rem",
              width: "100%",
              maxWidth: "200px",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
