import React, { useState, useEffect, useRef } from "react";
import Header from "../UI/header";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import packagesList from "../../packages.json";

export default function Form() {
  const location = useLocation();
  const formRef = useRef(null);
  const navigate = useNavigate();

  // const initialPackage =
  //   location.state?.selectedPackage || "phAMACore Standard";
  // const initailPackageId = location.state?.packageId || "2";
  const [selectedPackage, setSelectedPackage] = useState(
    JSON.parse(localStorage.getItem("packages"))?.selectedPackage ||
      "phAMACore Standard"
  );
  const [phone, setPhone] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("danger");

  const [packageDetails, setPackageDetails] = useState({
    trainingDaysMin: 0,
    trainingDaysMax: 0,
    characteristics: [],
  });
  const [post, setPost] = useState({
    fullname: "",
    emailAddress: "",
    phone: "",
    password: "",
    psUserCount: "",
    psCompanyName: "",
    psBranchName: "",
    psCusCode: "",
    psBranchCount: "",
    packageId: JSON.parse(localStorage.getItem("packages"))?.packageID || 2,
    role: "client",
    psPickCompany: "",
    isAccountActive: true,
    createdAt: new Date().toISOString(),
  });

  const [data, setData] = useState([]);
  useEffect(() => {
    const { psUserCount, psBranchCount } = post;

    if (psUserCount && psBranchCount) {
      axios
        .get(
          "http://corebasevm.southafricanorth.cloudapp.azure.com:5028/api/NewClients/GetPhamacoreCloudPricing",
          {
            params: {
              users: psUserCount,
              branches: psBranchCount,
            },
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              accessKey:
                "R0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9",
            },
          }
        )
        .then((response) => {
          console.log(selectedPackage);

          console.log(
            Object.entries(response.data[0]).filter((item) =>
              item[0].includes(String(selectedPackage.split(" ")[1]))
            )
          );
          let obj = {};
          for (let [key, values] of Object.entries(response.data?.[0])) {
            if (
              key
                .toLowerCase()
                .includes(String(selectedPackage.split(" ")[1]).toLowerCase())
            )
              obj[`${key}`] = values;
          }
          console.log(obj);

          setData(obj);
        })
        .catch((err) => {
          console.log(err);
          setToastMessage(
            err.response?.data?.message ||
              "An error occurred. Please try again."
          );
          setToastVariant("danger");
          setShowToast(true);
        });
    }
  }, [post.psUserCount, post.psBranchCount, selectedPackage]);
  useEffect(() => {
    updatePackageDetails(selectedPackage);
  }, [selectedPackage]);
  const handleSelect = (pkg) => {
    setSelectedPackage(pkg);
  };
  const updatePackageDetails = (packageId) => {
    const packageInfo = {
      "phAMACore Lite": {
        trainingDaysMin: 6,
        trainingDaysMax: 8,
        characteristics: [
          "Feature 1",
          "Feature 2",
          "Feature 3",
          "Feature 4",
          "Feature 5",
          "Feature 6",
        ],
      },
      "phAMACore Standard": {
        trainingDaysMin: 8,
        trainingDaysMax: 10,
        characteristics: [
          "Lite plus",
          "Feature 2",
          "Feature 3",
          "Feature 4",
          "Feature 5",
          "Feature 6",
        ],
      },
      "phAMACore Enterprise": {
        trainingDaysMin: 8,
        trainingDaysMax: 10,
        characteristics: [
          "Standard plus",
          "Feature 2",
          "Feature 3",
          "Feature 4",
          "Feature 5",
          "Feature 6",
        ],
      },
    };

    const details = packageInfo[packageId] || {
      trainingDaysMin: 0,
      trainingDaysMax: 0,
      characteristics: [],
    };

    setPackageDetails(details);

    setPost((prevPost) => ({
      ...prevPost,
      trainingDays: details.trainingDaysMax || "",
    }));

    const updatePackageDetails = (packageId) => {
      const packageInfo = {
        "phAMACore Lite": {
          trainingDaysMin: 6,
          trainingDaysMax: 8,
          characteristics: [
            "Feature 1",
            "Feature 2",
            "Feature 3",
            "Feature 4",
            "Feature 5",
            "Feature 6",
          ],
        },
        "phAMACore Standard": {
          trainingDaysMin: 8,
          trainingDaysMax: 10,
          characteristics: [
            "Lite plus",
            "Feature 2",
            "Feature 3",
            "Feature 4",
            "Feature 5",
            "Feature 6",
          ],
        },
        "phAMACore Enterprise": {
          trainingDaysMin: 8,
          trainingDaysMax: 10,
          characteristics: [
            "Standard plus",
            "Feature 2",
            "Feature 3",
            "Feature 4",
            "Feature 5",
            "Feature 6",
          ],
        },
      };

      const details = packageInfo[packageId] || {
        trainingDaysMin: 0,
        trainingDaysMax: 0,
        characteristics: [],
      };

      setPackageDetails(details);

      setPost((prevPost) => ({
        ...prevPost,
        trainingDays: details.trainingDaysMax || "",
      }));
      const packageKey = pkg.split(" ")[1];
      let filteredDataObj = {};

      for (let [key, value] of Object.entries(data)) {
        if (key.toLowerCase().includes(packageKey.toLowerCase())) {
          filteredDataObj[key] = value;
        }
      }
      setData(filteredDataObj);
    };
  };
  async function packages() {
    try {
      const response = await axios.get(
        `http://20.164.20.36:86/api/packages/clientpackage/${123}`
      );
      console.log(response);
    } catch (error) {
      console.log(error);

      setToastMessage(
        error.response?.data?.message ||
          "Failed to fetch packages. Please try again later."
      );
      setToastVariant("danger");
      setShowToast(true);
    }
  }
  // useEffect(() => {
  //   packages();
  // }, []);
  const handleContact = (value) => {
    setPhone(value);
    setPost((prevPost) => ({
      ...prevPost,
      phone: value,
    }));
  };

  const handleChange = (e) => {
    setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handlePackageSelect = (event) => {
    const packageDescription = packagesList.find(
      (pkg) => pkg.packageNum === event.target.value
    );

    setSelectedPackage(packageDescription.description); // Update selected package description
    setPost((prevPost) => ({ ...prevPost, packageId: event.target.value })); // Update the pkgId in post
  };

  const handleErrors = (values) => {
    const errors = {};

    if (!values.psCompanyName) {
      errors.psCompanyName = "Required";
    }
    if (!values.psUserCount) {
      errors.psUserCount = "Required";
    }

    if (!values.phone) {
      errors.phone = "Required";
    }

    if (!values.emailAddress) {
      errors.emailAddress = "Required";
    }

    if (!values.packageId) {
      errors.packageId = "Required";
    }
    if (!values.psBranchCount) {
      errors.psBranchCount = "Required";
    }
    if (!values.fullname) {
      errors.fullname = "Required";
    }

    setFormErrors(errors);
    console.log(errors);
    return Object.keys(errors).length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (handleErrors(post)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://20.164.20.36:86/api/client/CreateClient",
        post,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            accessKey:
              "R0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9",
          },
        }
      );
      setPhone("");
      setPost({
        fullname: "",
        emailAddress: "",
        phone: "",
        password: "",
        psUserCount: "",
        psCompanyName: "",
        psBranchName: "",
        psCusCode: "",
        psBranchCount: "",
        packageId: JSON.parse(localStorage.getItem("packages")).packageID || 0,
        role: "client",
        psPickCompany: "",
        isAccountActive: true,
        createdAt: new Date().toISOString(),
      });

      console.log("API Response:", response.data);

      setToastMessage(response.data.message || "Form submitted successfully!");
      setToastVariant("success");
      setShowToast(true);

      navigate("/summary", {
        state: {
          data,
          formData: post,
          initialPackage: selectedPackage,
          summary: data,
          trainingDaysMax: packageDetails.trainingDaysMax,
        },
      });

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("API Error:", err);

      setToastMessage(
        err.response?.data?.message ||
          "There was an error submitting the form. Please try again."
      );
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };
  const totalAnnual =
    (data[
      `totalUserAccess${capitalize(String(selectedPackage.split(" ")[1]))}`
    ] || 0) +
    (data[`totalSupport${capitalize(String(selectedPackage.split(" ")[1]))}`] ||
      0);

  // Calculate total, VAT, inclusive, and one-off charges
  const total = Object.values(data).reduce((acc, curr) => acc + curr, 0) || 0;
  const vat = 0.16 * total;
  const inclusive = total + vat;
  const oneOff =
    (data[`totalConfiguration${capitalize(selectedPackage.split(" ")[1])}`] ||
      0) +
    (data[`totalHosting${capitalize(selectedPackage.split(" ")[1])}`] || 0) +
    (data[`totalTraining${capitalize(selectedPackage.split(" ")[1])}`] || 0);

  localStorage.setItem(
    "pricingData",
    JSON.stringify({
      total,
      vat,
      inclusive,
      oneOff,
      initialPackage: selectedPackage,
      annual: totalAnnual,
    })
  );

  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const toggleBilling = () => {
    setIsAnnual((prev) => !prev);
  };

  const monthlyAmount = totalAnnual / 12;
  const quarterlyAmount = totalAnnual / 4;

  const getUserData = async () => {
    try {
      const user = localStorage.getItem("user");

      const response = await axios.get(
        `http://20.164.20.36:86/api/auth/GetUserByEmail/${user}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            accessKey:
              "R0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9",
          },
        }
      );

      let phoneNo = response.data.phoneNumber?.split("");
      phoneNo.splice(0, 1, "254");

      setPost((prev) => ({
        ...prev,
        psCompanyName: response.data.organisationName,
        fullname: response.data.name,
        emailAddress: response.data.email,
        phone: phoneNo.join(""),
      }));
      setPhone(phoneNo.join(""));

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);

      setToastMessage(
        error.response?.data?.message ||
          "An error occurred while fetching user data. Please try again."
      );
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  if (!localStorage.getItem("user")) {
    return navigate("/login", { replace: true });
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Header locationpath={location?.pathname ?? ""} />
      <ToastContainer
        position="top-center"
        className="position-fixed top-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 9999 }}
      >
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

      <div className="container-fluid my-5 justify-content-center">
        <div className="d-flex justify-content-center align-items-center">
          <div className="row ">
            <div className="col-md-6 pe-2">
              <div
                className="card shadow h-100"
                style={{ maxWidth: "600px", margin: "0 " }}
              >
                <div className="card-body">
                  {" "}
                  <h5
                    className="d-flex justify-content-start p-1"
                    style={{
                      padding: "0px",
                    }}
                  >
                    Biodata{" "}
                  </h5>
                  {/* {isLoading && (
                    <div className="loading-overlay">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )} */}
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    autoComplete="off"
                  >
                    <div className="row mb-1">
                      <div className="col-md-12">
                        <label htmlFor="fullname" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          name="fullname"
                          autocomplete="off"
                          className="form-control form-control-sm  "
                          value={post.fullname}
                          onChange={handleChange}
                          style={{
                            fontSize: "14px",
                          }}
                        />
                        {formErrors.fullname && (
                          <p className="text-danger">{formErrors.fullname}</p>
                        )}
                      </div>
                    </div>
                    <div className="row mb-1">
                      <div className="col-md-6 pe-2 ">
                        <label htmlFor="emailAddress" className="form-label">
                          Email Address
                        </label>
                        <input
                          type="emailAddress"
                          id="emailAddress"
                          autocomplete="off"
                          name="emailAddress"
                          className="form-control form-control-sm "
                          value={post.emailAddress}
                          onChange={handleChange}
                          style={{
                            fontSize: "14px",
                          }}
                        />
                        {formErrors.emailAddress && (
                          <p className="text-danger">
                            {formErrors.emailAddress}
                          </p>
                        )}
                      </div>

                      <div className="col-md-6 ps-2">
                        <label htmlFor="phone" className="form-label">
                          Phone Number
                        </label>
                        <div className="phone-number-container">
                          <PhoneInput
                            country={"ke"}
                            inputClass="form-control form-control-sm "
                            value={phone}
                            autocomplete="off"
                            onChange={handleContact}
                            inputProps={{
                              id: "phone",
                              name: "phone",
                            }}
                            inputStyle={{
                              width: "100%",
                              fontSize: "12px",
                              lineHeight: "1.5",
                              height: "calc(1.6em + 0.5rem + 2px)",
                            }}
                            masks={{ ke: "... ... ..." }}
                          />
                          {formErrors.phone && (
                            <p className="text-danger">{formErrors.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label htmlFor="companyName" className="form-label">
                          Organisation Name{" "}
                        </label>
                        <input
                          type="text"
                          id="psCompanyName"
                          autocomplete="off"
                          name="psCompanyName"
                          className="form-control form-control-sm"
                          value={post.psCompanyName}
                          onChange={handleChange}
                          style={{
                            fontSize: "14px",
                          }}
                        />
                        {formErrors.psCompanyName && (
                          <p className="text-danger">
                            {formErrors.psCompanyName}
                          </p>
                        )}
                      </div>
                    </div>
                    <h5 className="d-flex justify-content-start p-1" style={{}}>
                      Plan Details
                    </h5>
                    <div className="mb-2">
                      <select
                        id="packages"
                        name="packageId"
                        className="form-select form-control form-control-sm"
                        value={
                          post.packageId ||
                          packagesList.find(
                            (pkg) => pkg.description === selectedPackage
                          )?.packageNum ||
                          ""
                        } // Select package based on post.pkgId or fallback to description match
                        onChange={(e) => handlePackageSelect(e)} // Trigger handlePackageSelect on change
                      >
                        {packagesList.map((pkg) => (
                          <option key={pkg.packageNum} value={pkg.packageNum}>
                            {pkg.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div className="dropdown mb-2 text-left">
                      <button
                        className="btn bg-white border border-2 dropdown-toggle w-80 dropdown-button text-start"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        aria-label="Select a package"
                      >
                        {selectedPackage}
                      </button>
                      
                      <ul
                        className="dropdown-menu text-start"
                        aria-labelledby="dropdownMenuButton"
                      >
                        {[
                          { packageNum: "1", description: "phAMACore Lite" },
                          {
                            packageNum: "2",
                            description: "phAMACore Standard",
                          },
                          {
                            packageNum: "3",
                            description: "phAMACore Enterprise",
                          },
                        ].map((pkg) => (
                          <li
                            key={pkg.packageNum}
                            className="dropdown-item"
                            // onClick={() => setSelectedPackage(pkg)}
                            onClick={() => handlePackageSelect(pkg)}
                          >
                            {pkg.description}
                          </li>
                        ))}
                      </ul>
                    </div> */}
                    <div className="row mb-2">
                      <div className="col-md-4">
                        <label htmlFor="psBranchCount" className="form-label">
                          Branches
                        </label>
                        <input
                          type="number"
                          id="psBranchCount"
                          name="psBranchCount"
                          className="form-control form-control-sm "
                          value={post.psBranchCount}
                          onChange={handleChange}
                          min="0"
                          style={{
                            fontSize: "14px",
                          }}
                        />
                        {formErrors.psBranchCount && (
                          <p className="text-danger">
                            {formErrors.psBranchCount}
                          </p>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label htmlFor=" psBranchCount" className="form-label">
                          Users
                        </label>
                        <input
                          type="number"
                          id="psUserCount"
                          name="psUserCount"
                          className="form-control form-control-sm "
                          value={post.psUserCount}
                          onChange={handleChange}
                          min="0"
                          style={{
                            fontSize: "14px",
                          }}
                        />
                        {formErrors.psUserCount && (
                          <p className="text-danger">
                            {formErrors.psUserCount}
                          </p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="trainingDays" className="form-label">
                          Training Sessions{" "}
                        </label>
                        <input
                          type="number"
                          id="trainingDays"
                          name="trainingDays"
                          className="form-control form-control-sm "
                          style={{
                            fontSize: "14px",
                          }}
                          value={packageDetails.trainingDaysMax}
                          readOnly
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-md-6 ps-2">
              <div
                className="card shadow h-100"
                style={{
                  maxWidth: "600px",
                  margin: "0 ",

                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div className="card-body">
                  <h5 className="d-flex justify-content-start p-1" style={{}}>
                    Purchase Summary
                  </h5>

                  <div className="d-flex justify-content-center">
                    <div
                      className="card shadow mb-1 "
                      style={{
                        maxWidth: "1000px",
                        width: "100%",
                        margin: "0",
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <div className="card-body">
                        <div className="row  g-0">
                          <h6
                            className="d-flex justify-content-center p-0"
                            style={{
                              color: "#C58C4F",
                            }}
                          >
                            {selectedPackage}
                          </h6>
                          <div className="col text-center mb-1">
                            <p className="card-title ">Branches</p>
                            <p
                              className="card-text  mb-0"
                              style={{ color: "#C58C4F", fontSize: "14px" }}
                            >
                              {post.psBranchCount}
                            </p>
                          </div>
                          <div className="col text-center">
                            <p className="card-title mb-1">Users</p>
                            <p
                              className="card-text  mb-0"
                              style={{ color: "#C58C4F", fontSize: "14px" }}
                            >
                              {post.psUserCount}
                            </p>
                          </div>
                          <div className="col text-center">
                            <p className="card-title mb-1">Training Sessions</p>
                            <p
                              className="card-text mb-0"
                              style={{ color: "#C58C4F", fontSize: "14px" }}
                            >
                              {packageDetails.trainingDaysMax}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-3" />

                  <div>
                    {/* Checkbox to accept terms */}
                    <label className="label-1">
                      <input
                        type="checkbox"
                        checked={isAccepted}
                        onChange={(e) => setIsAccepted(e.target.checked)}
                      />
                      <p>
                        I agree to the
                        <a
                          href="/terms"
                          style={{
                            color: "blue",
                            textDecoration: "underline",
                            padding: "5px",
                          }}
                        >
                          terms and conditions
                        </a>
                        and the
                        <a
                          href="/privacy-policy"
                          style={{
                            color: "blue",
                            textDecoration: "underline",
                            padding: "5px",
                          }}
                        >
                          privacy policy
                        </a>
                        .
                      </p>
                    </label>

                    {/* Conditional rendering */}
                    {isAccepted && (
                      <div style={{ marginTop: "20px", padding: "10px" }}>
                        {/* First Table */}
                        <table className="table table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th
                                scope="col"
                                className="text-start"
                                style={{
                                  fontSize: "14px",
                                  // fontFamily: "Poppins",
                                  lineHeight: "1.0",
                                  fontWeight: "600",
                                  color: "black",
                                  padding: "10px",
                                }}
                              >
                                Pricing Plan
                              </th>
                              <th
                                scope="col"
                                className="text-center"
                                style={{
                                  fontSize: "14px",
                                  // fontFamily: "Poppins, sans-serif",
                                  lineHeight: "1.0",
                                  fontWeight: "600",
                                  color: "black",
                                  padding: "10px",
                                }}
                              >
                                Amount (Ksh)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                label: "Branch Configuration",
                                key: "totalConfiguration",
                              },
                              {
                                label: "Training Sessions",
                                key: "totalTraining",
                              },
                              {
                                label: "User Subscription",
                                key: "totalUserAccess",
                              },
                              { label: "Hosting Fee", key: "totalHosting" },
                              {
                                label: "Annual Maintenance",
                                key: "totalSupport",
                              },
                            ].map((item, index) => (
                              <tr key={index} className="text-start">
                                <td>
                                  <p>{item.label}</p>
                                </td>
                                <td className="text-center">
                                  <p>
                                    {new Intl.NumberFormat("en-GB").format(
                                      data[
                                        `${item.key}${capitalize(
                                          selectedPackage.split(" ")[1]
                                        )}`
                                      ] || 0
                                    )}
                                  </p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Second Table */}
                        <div className="d-flex justify-content-end">
                          <table
                            className="table table-bordered"
                            style={{ height: "40px" }}
                          >
                            <thead className="table-light">
                              <tr>
                                <th
                                  scope="col"
                                  className="text-start"
                                  style={{
                                    fontSize: "14px",
                                    // fontFamily: "Poppins",
                                    lineHeight: "1.0",
                                    fontWeight: "600",
                                    color: "black",
                                    padding: "10px",
                                  }}
                                >
                                  Cost Summary
                                </th>
                                <th
                                  scope="col"
                                  className="text-center"
                                  style={{
                                    fontSize: "14px",
                                    // fontFamily: "Poppins, sans-serif",
                                    lineHeight: "1.0",
                                    fontWeight: "600",
                                    color: "black",
                                    padding: "10px",
                                  }}
                                >
                                  Amount (Ksh)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-start">
                                  <strong>
                                    <p>Total</p>
                                  </strong>
                                </td>
                                <td className="text-center">
                                  <strong>
                                    <p>
                                      {new Intl.NumberFormat("en-GB").format(
                                        Number(
                                          Object.values(data).reduce(
                                            (acc, curr) => acc + curr,
                                            0
                                          )
                                        ) || 0
                                      )}{" "}
                                      Ksh
                                    </p>
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-start">
                                  <strong>
                                    <p>VAT (16%)</p>
                                  </strong>
                                </td>
                                <td className="text-center">
                                  <strong>
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
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="text-start">
                                  <strong>
                                    <p>Inclusive </p>
                                  </strong>
                                </td>
                                <td className="text-center">
                                  <strong>
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
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="d-flex justify-content-start">
                          <table className="table table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th
                                  scope="col"
                                  className="text-center"
                                  style={{
                                    fontSize: "14px",
                                    // fontFamily: "Poppins",
                                    lineHeight: "1.0",
                                    fontWeight: "600",
                                    color: "black",
                                    padding: "10px",
                                  }}
                                >
                                  One Off (Ksh)
                                </th>
                                <th
                                  scope="col"
                                  className="text-center"
                                  style={{
                                    fontSize: "14px",
                                    // fontFamily: "Poppins, sans-serif",
                                    lineHeight: "1.0",
                                    fontWeight: "600",
                                    color: "black",
                                    padding: "10px",
                                  }}
                                >
                                  Annual (Ksh)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="text-start">
                                <td className="text-center">
                                  <strong>
                                    <p style={{ margin: "0" }}>
                                      {new Intl.NumberFormat("en-GB").format(
                                        (data[
                                          `totalConfiguration${capitalize(
                                            selectedPackage.split(" ")[1]
                                          )}`
                                        ] || 0) +
                                          (data[
                                            `totalHosting${capitalize(
                                              selectedPackage.split(" ")[1]
                                            )}`
                                          ] || 0) +
                                          (data[
                                            `totalTraining${capitalize(
                                              selectedPackage.split(" ")[1]
                                            )}`
                                          ] || 0)
                                      )}{" "}
                                      Ksh
                                    </p>
                                  </strong>
                                </td>
                                <td className="text-center">
                                  <strong>
                                    <p style={{ margin: "0" }}>
                                      {new Intl.NumberFormat("en-GB").format(
                                        totalAnnual
                                      )}{" "}
                                      Ksh
                                    </p>
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="d-flex justify-content-center">
                          <button
                            type="submit"
                            className="btn text-white custom-btn"
                            disabled={isLoading}
                            onClick={handleButtonClick}
                            style={{
                              backgroundColor: "#C58C4F",
                              borderColor: "#C58C4F",
                              color: "#FFF",
                              fontSize: "14px",
                            }}
                          >
                            {isLoading ? (
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              ></div>
                            ) : (
                              "Place Order"
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
