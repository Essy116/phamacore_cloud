import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Summary = () => {
  const location = useLocation();
  const { trainingDaysMax, data, formData, alertMessage, initialPackage } =
    location.state || {};
  const [showAlert, setShowAlert] = useState(true);

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div>
      {showAlert && alertMessage && (
        <div
          className={`alert ${
            alertMessage.includes("Error") ? "alert-danger" : "alert-success"
          } alert-dismissible fade show`}
          role="alert"
          style={{
            position: "fixed",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "1050",
            width: "100%",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          {alertMessage}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}
      <div className="container-fluid my-5 justify-content-center ">
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

              <div className="row mb-1">
                <div className="col-md-6 d-flex">
                  <div className="label" style={{ minWidth: "120px" }}>
                    {" "}
                    <p>
                      <strong>Full Name:</strong>
                    </p>
                  </div>
                  <p>{formData?.fullName || ""}</p>
                </div>
                <div className="col-md-6 d-flex">
                  <div className="label" style={{ minWidth: "100px" }}>
                    {" "}
                    <p>
                      <strong>Email Address:</strong>{" "}
                    </p>
                  </div>
                  <p>{formData?.email || ""}</p>
                </div>
              </div>
              <div className="row mb-1">
                <div className="col-md-6 d-flex">
                  <div className="label" style={{ minWidth: "120px" }}>
                    <p>
                      <strong>Phone Number:</strong>
                    </p>
                  </div>
                  <p> {formData?.phone || ""}</p>
                </div>
                <div className="col-md-6 d-flex">
                  <div className="label" style={{ minWidth: "100px" }}>
                    <p>
                      <strong>Package:</strong>{" "}
                    </p>
                  </div>{" "}
                  <p>{initialPackage || ""}</p>
                </div>
              </div>
              <div className="row mb-1">
                <div className="col-md">
                  {" "}
                  <p>
                    <strong>Organisation Name:</strong>{" "}
                    {formData?.companyName || ""}
                  </p>
                </div>
              </div>

              <div className="row mb-1">
                <div className="col-md-4 d-flex">
                  <div className="label" style={{ minWidth: "60px" }}>
                    {" "}
                    <p>
                      <strong>Branches:</strong>
                    </p>
                  </div>
                  <p> {formData?.branchCount || ""}</p>
                </div>
                <div className="col-md-4 d-flex">
                  <div className="label" style={{ minWidth: "60px" }}>
                    {" "}
                    <p>
                      <strong>Users:</strong>
                    </p>
                  </div>
                  <p> {formData?.users || ""}</p>
                </div>
                <div className="col-md-4 d-flex">
                  <div className="label" style={{ minWidth: "70px" }}>
                    <p>
                      <strong>T Sessions:</strong>{" "}
                    </p>
                  </div>
                  <p>{trainingDaysMax}</p>
                </div>
              </div>

              <div className="row mb-1">
                <div className="col-md-4 d-flex">
                  <div className="label" style={{ minWidth: "60px" }}>
                    {" "}
                    <p>
                      <strong>Total:</strong>{" "}
                    </p>
                  </div>
                  <p>
                    {new Intl.NumberFormat("en-GB").format(
                      Number(
                        Object.values(data).reduce((acc, curr) => acc + curr, 0)
                      ) || 0
                    )}{" "}
                    Ksh
                  </p>
                </div>
                <div className="col-md-4 d-flex">
                  <div className="label" style={{ minWidth: "60px" }}>
                    {" "}
                    <p>
                      <strong>VAT (16%):</strong>{" "}
                    </p>
                  </div>
                  <p>
                    {new Intl.NumberFormat("en-GB").format(
                      Number(
                        0.16 *
                          Object.values(data).reduce(
                            (acc, curr) => acc + curr,
                            0
                          )
                      )
                    )}{" "}
                    Ksh
                  </p>
                </div>
                <div className="col-md-4 d-flex">
                  <div className="label" style={{ minWidth: "70px" }}>
                    {" "}
                    <p>
                      <strong>Inclusive:</strong>{" "}
                    </p>
                  </div>
                  <p>
                    {new Intl.NumberFormat("en-GB").format(
                      Number(
                        0.16 *
                          Object.values(data).reduce(
                            (acc, curr) => acc + curr,
                            0
                          ) +
                          Object.values(data).reduce(
                            (acc, curr) => acc + curr,
                            0
                          )
                      )
                    )}{" "}
                    Ksh
                  </p>
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
                  <p>
                    {new Intl.NumberFormat("en-GB").format(
                      (data[
                        `totalConfiguration${capitalize(
                          String(initialPackage.split(" ")[1])
                        )}`
                      ] || 0) +
                        (data[
                          `totalHosting${capitalize(
                            String(initialPackage.split(" ")[1])
                          )}`
                        ] || 0) +
                        (data[
                          `totalTraining${capitalize(
                            String(initialPackage.split(" ")[1])
                          )}`
                        ] || 0)
                    )}{" "}
                    Ksh
                  </p>
                </div>
                <div className="col-md-4 d-flex">
                  <div className="label" style={{ minWidth: "60px" }}>
                    <p>
                      <strong>Annual:</strong>{" "}
                    </p>
                  </div>
                  <p>
                    {new Intl.NumberFormat("en-GB").format(
                      (data[
                        `totalUserAccess${capitalize(
                          String(initialPackage.split(" ")[1])
                        )}`
                      ] || 0) +
                        (data[
                          `totalSupport${capitalize(
                            String(initialPackage.split(" ")[1])
                          )}`
                        ] || 0)
                    )}{" "}
                    Ksh
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
