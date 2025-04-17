import React, { useEffect, useState } from "react";
import Header from "../UI/header";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import packagesList from "../../packages.json";
import { toast } from "react-toastify"; // If you're using toast from 'react-toastify', remove this if using React-Bootstrap
import { Toast, ToastContainer } from "react-bootstrap";

// let packagesList = [
//   { packageNum: "1", description: "phAMACore Lite" },
//   { packageNum: "2", description: "phAMACore Standard" },
//   { packageNum: "3", description: "phAMACore Enterprise" },
// ];

export default function Packages() {
  const location = useLocation();
  const [packagess, setPackages] = useState([]);
  const [packageCode, setPackageCode] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("danger");
  const [selectedPackage, setSelectedPackage] = useState(
    location.state?.package?.pkg || "phAMACore Standard"
  );
  const navigate = useNavigate();
  async function packages() {
    try {
      const response = await axios.get(
        "http://20.164.20.36:86/api/packages/GetAllPackages"
      );
      console.log(response);
      setPackages(response.data.data);
    } catch (error) {
      console.log(error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch packages. Please try again later.";

      setToastMessage(errorMessage);
      setToastVariant("danger");
      setShowToast(true);
    }
  }

  useEffect(() => {
    const savedPackage = JSON.parse(localStorage.getItem("packages"));
    if (savedPackage) {
      setSelectedPackage(savedPackage.selectedPackage);
      setPackageCode(savedPackage.packageID);
    }
    packages(); // Fetch the packages when the component mounts
  }, []);

  const handleCardClick = (packageId) => {
    setPackageCode(
      packagesList.find((pkg) => pkg.description === packageId)?.packageNum
    );
    setSelectedPackage(packageId);

    localStorage.setItem(
      "selectedPackage",
      JSON.stringify({
        selectedPackage: packageId,
      })
    );
  };

  const cardStyle = (packageId) => ({
    border: selectedPackage === packageId ? "5px solid #C58C4F" : "none",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transform: selectedPackage === packageId ? "scale(1.05)" : "none",
    position: "relative",
  });

  const handleNextClick = () => {
    const maxTrainingDays =
      packageTrainingDays[selectedPackage].split(" to ")[1];
    navigate("/login", {
      replace: true,
      state: {
        selectedPackage,
        maxTrainingDays,
        from: location.pathname,
        packageCode: packageCode,
      },
    });
    localStorage.setItem(
      "packages",
      JSON.stringify({
        selectedPackage,
        packageCode: packageCode,
        packageID: packageCode,
      })
    );
  };
  const handleCardClick2 = (packageItem) => {
    console.log(packageItem);

    const updatedPackageCode = packagesList.find(
      (pkg) => pkg.description === packageItem.packageName
    )?.packageNum;

    setPackageCode(updatedPackageCode);
    setSelectedPackage(packageItem.packageName);

    localStorage.setItem(
      "packages",
      JSON.stringify({
        selectedPackage: packageItem.packageName,
        packageID: packageItem.packageId,
      })
    );
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
    padding: "10px 5px",
    backgroundColor: "#f2f2f2",
    borderRadius: "5px",
    color: "#333",
    fontSize: "12px",
    textAlign: "center",
    fontWeight: "bold",
  };

  const popularBadgeStyle = {
    position: "absolute",
    top: "-1em", // Adjust based on font size
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#C58C4F",
    color: "white",
    padding: "0.5em 1em",
    borderRadius: "15px",
    fontSize: "012px",
    fontWeight: "bold",
    zIndex: 2,
    whiteSpace: "nowrap", // Prevents text wrapping
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
        <h4
          className="d-flex justify-content-center align-items-center  "
          style={{
            padding: localStorage.getItem("user")
              ? "10px 0 30px 0"
              : "80px 0 30px 0", // Conditionally change padding

            fontWeight: "600",
            lineHeight: "20px",
            color: "#c58c4f",
            // fontFamily: " 'Poppins' !important",
            whiteSpace: "nowrap",
            alignItems: "center",
          }}
        >
          SELECT THE PLAN THAT SUITS YOU
        </h4>

        <div className="row justify-content-center">
          {packagess.map((item) => (
            <div className="col-md-4">
              <div
                className="card h-100 w-80 shadow-lg package-card"
                style={cardStyle(item.packageName)}
                onClick={() => handleCardClick2(item)}
              >
                {item.packageName === "phAMACore Standard" && (
                  <div style={popularBadgeStyle}>Most Popular</div>
                )}

                <div className="card-text-top shadow d-flex justify-content-center align-items-center">
                  <h5 className="mb-0">{item.packageName}</h5>
                  <input
                    type="radio"
                    name="package"
                    style={{
                      ...radioButtonStyle,
                      ...(selectedPackage === item.packageName
                        ? radioButtonCheckedStyle
                        : {}),
                    }}
                    checked={selectedPackage === item.packageName}
                    onChange={() => handleCardClick2(item)}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <p
                    style={{
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    {item.packageName} characteristics include:
                  </p>
                  <ul className="list-unstyled">
                    {item.features.map((feature, index) => (
                      <li key={index}>
                        <i className="bi bi-check-lg"></i> {feature}
                      </li>
                    ))}
                  </ul>
                  <div style={footnoteStyle}>
                    Training Sessions:{" "}
                    {packageTrainingDays[`${item.packageName}`]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="row justify-content-center">
          <div className="col-md-4">
            <div
              className="card h-100 w-80 shadow-lg package-card"
              style={cardStyle("phAMACore Lite")}
              onClick={() => handleCardClick("phAMACore Lite")}
            >
              <div className="card-text-top shadow d-flex justify-content-center align-items-center">
                <h5 className="mb-0">phAMACore Lite</h5>
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
                <p
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  Phamacore Lite characteristics include:
                </p>

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
              className="card h-100 w-80 shadow-lg package-card"
              style={cardStyle("phAMACore Standard")}
              onClick={() => handleCardClick("phAMACore Standard")}
            >
              <div style={popularBadgeStyle}>Most Popular</div>
              <div className="card-text-top shadow d-flex justify-content-center align-items-center">
                <h5 className="mb-0">phAMACore Standard</h5>
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
                <p
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  Phamacore Standard characteristics include:
                </p>
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
              className="card shadow-lg h-100 w-80 package-card"
              style={cardStyle("phAMACore Enterprise")}
              onClick={() => handleCardClick("phAMACore Enterprise")}
            >
              <div className="card-text-top shadow d-flex justify-content-center align-items-center">
                <h5 className="mb-0">phAMACore Enterprise</h5>
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
                <p
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  Phamacore Enterprise characteristics include:
                </p>
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
        </div> */}
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

        <div className="d-flex justify-content-end ">
          <button
            className="btn btn-sm my-5"
            onClick={handleNextClick}
            style={{
              backgroundColor: "#C58C4F",
              borderColor: "#C58C4F",
              color: "#FFF",

              width: "20%",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
