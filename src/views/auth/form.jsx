import React, { useState, useEffect, useRef } from "react";
import Header from "../UI/header";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Form() {
  const location = useLocation();
  const formRef = useRef(null);
  const navigate = useNavigate();

  const initialPackage =
    location.state?.selectedPackage || "phAMACore Standard";
  const initailPackageCode = location.state?.packageCode || "PK002";
  const [selectedPackage, setSelectedPackage] = useState(initialPackage);
  const [phone, setPhone] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const [packageDetails, setPackageDetails] = useState({
    trainingDaysMin: 0,
    trainingDaysMax: 0,
    characteristics: [],
  });

  const [post, setPost] = useState({
    companyName: "",
    branchName: "",
    branchCode: "",
    fullName: "",
    users: "",
    branchCount: "",
    packageCode: "" || initailPackageCode,
    email: "",
    phone: "",
  });
  const [data, setData] = useState([]);
  useEffect(() => {
    const { users, branchCount } = post;
    if (users && branchCount) {
      axios
        .get(
          "http://102.37.102.247:5028/api/NewClients/GetPhamacoreCloudPricing",
          {
            params: {
              users: users,
              branches: branchCount,
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
          console.log(selectedPackage)

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
          // setData(
          //   Object.entries(response.data[0]).filter((item) =>
          //     item[0].includes(String(initialPackage.split(" ")[1]))
          //   )
          // );
          setData(obj);
        })
        .catch((err) => alert(err.response.data.message));
    }
  }, [post.users, post.branchCount,selectedPackage]);
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
    // Function to update package-specific pricing
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

  // Get the details for the selected package
  const details = packageInfo[packageId] || {
    trainingDaysMin: 0,
    trainingDaysMax: 0,
    characteristics: [],
  };

  setPackageDetails(details);

  // Update the training days in post object
  setPost((prevPost) => ({
    ...prevPost,
    trainingDays: details.trainingDaysMax || "",
  }));
  const packageKey = pkg.split(" ")[1]; // Extract 'Lite', 'Standard', or 'Enterprise'
  let filteredDataObj = {};

  // Filter data by checking if keys match package type
  for (let [key, value] of Object.entries(data)) {
    if (key.toLowerCase().includes(packageKey.toLowerCase())) {
      filteredDataObj[key] = value;
    }
  }
  setData(filteredDataObj); // Update data state with filtered data
};
  };

  const handleContact = (value) => {
    setPhone(value);
    setPost((prevPost) => ({
      ...prevPost,
      phone: value,
    }));
  };

  const handleChange = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setPost((prevPost) => ({ ...prevPost, packageCode: pkg }));
    console.log("Selected Package Code:", pkg);
  };

  const handleErrors = (values) => {
    const errors = {};

    if (!values.companyName) {
      errors.companyName = "Required";
    }
    if (!values.users) {
      errors.users = "Required";
    }

    if (!values.phone) {
      errors.phone = "Required";
    }

    
    if (!values.email) {
      errors.email = "Required";
    }

    if (!values.packageCode) {
      errors.packageCode = "Required";
    }
    if (!values.branchCount) {
      errors.branchCount = "Required";
    }
    if (!values.fullName) {
      errors.fullName = "Required";
    }

    setFormErrors(errors);
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
        "http://102.37.102.247:5028/api/NewClients/CreateClient",
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
        companyName: "",
        branchName: "",
        branchCode: "",
        branchCount: "",
        fullName: "",
        packageCode: "" || initailPackageCode,
        email: "",
        users: "",
        phone: "",
      });

      console.log("API Response:", response.data);
      setAlertMessage("Form successfully submitted!");
      navigate("/summary", {
        state: {
          data,
          formData: post,
          initialPackage: initialPackage,
          summary: data,
          trainingDaysMax: packageDetails.trainingDaysMax,

          alertMessage: "Form successfully submitted!",
        },
      });
    } catch (err) {
      console.error("API Error:", err);
      if (err.response && err.response.data) {
        setAlertMessage(
          `Error: ${err.response.data.message || "API error occurred."}`
        );
      } else {
        setAlertMessage(
          "Error: There was an error submitting the form. Please try again."
        );
      }
      navigate("/summary", {
        state: { alertMessage: `Error: ${errorMessage}` },
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  // Calculate the total annual amount
  const totalAnnual =
    (data[
      `totalUserAccess${capitalize(String(selectedPackage.split(" ")[1]))}`
    ] || 0) +
    (data[`totalSupport${capitalize(String(selectedPackage.split(" ")[1]))}`] ||
      0);

  // Monthly amount calculated from annual amount
  const monthlyAmount = totalAnnual / 12;
  const quarterlyAmount = totalAnnual / 4;

  return (
    <>
      <Header locationpath={location?.pathname ?? ""} />

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
                  <h3
                    className="d-flex justify-content-start p-1"
                    style={{
                      fontSize: "24px",
                      fontFamily: "'poppins', sans-serif !important",
                      fontWeight: "600",
                      lineHeight: "1.5",
                      padding: "0px",
                    }}
                  >
                    Biodata{" "}
                  </h3>
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
                  <form ref={formRef} onSubmit={handleSubmit}>
                    <div className="row mb-1">
                      <div className="col-md-12">
                        <label htmlFor="fullName" className="form-label">
                          Full Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          className="form-control form-control-sm border border-2 "
                          value={post.fullName}
                          onChange={handleChange}
                        />
                        {formErrors.fullName && (
                          <p className="text-danger">{formErrors.fullName}</p>
                        )}
                      </div>
                    </div>
                    <div className="row mb-1">
                    
                          <div className="col-md-6 pe-2 ">
                            <label htmlFor="email" className="form-label">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="form-control form-control-sm border border-2 "
                              value={post.email}
                              onChange={handleChange}
                            />
                            {formErrors.email && (
                              <p className="text-danger">{formErrors.email}</p>
                            )}
                          </div>
                     
                          <div className="col-md-6 ps-2">
                            <label htmlFor="phone" className="form-label">
                              Phone Number{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="phone-number-container">
                              <PhoneInput
                                country={"ke"}
                                inputClass="form-control form-control-sm border border-2"
                                value={phone}
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
                                <p className="text-danger">
                                  {formErrors.phone}
                                </p>
                              )}
                            </div>
                          </div>
                      
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label htmlFor="companyName" className="form-label">
                          Organisation Name{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          className=" form-control form-control-sm border border-2  "
                          value={post.companyName}
                          onChange={handleChange}
                        />
                        {formErrors.companyName && (
                          <p className="text-danger">
                            {formErrors.companyName}
                          </p>
                        )}
                      </div>
                    </div>
                    <h3
                      className="d-flex justify-content-start p-1"
                      style={{
                        fontSize: "24px",
                        fontFamily: "'poppins', sans-serif !important",
                        fontWeight: "600",
                        lineHeight: "1.5",
                      }}
                    >
                      Plan Details
                    </h3>
         
      <div className="dropdown mb-2 text-left">
        <button
          className="btn bg-white border border-2 dropdown-toggle w-100 dropdown-button text-start"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          aria-label="Select a package"
        >
          {selectedPackage}
        </button>
        <ul className="dropdown-menu text-start" aria-labelledby="dropdownMenuButton">
          {["phAMACore Lite", "phAMACore Standard", "phAMACore Enterprise"].map((pkg) => (
            <li key={pkg} className="dropdown-item" onClick={() => setSelectedPackage(pkg)}>
              {pkg}
            </li>
          ))}
        </ul>
      </div>
                    <div className="row mb-2">
                      <div className="col-md-4">
                        <label htmlFor="branchCount" className="form-label">
                          Branches <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          id="branchCount"
                          name="branchCount"
                          className="form-control form-control-sm  border border-2"
                          value={post.branchCount}
                          onChange={handleChange}
                          min="0"
                        />
                        {formErrors.branchCount && (
                          <p className="text-danger">
                            {formErrors.branchCount}
                          </p>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="users" className="form-label">
                          Users <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          id="users"
                          name="users"
                          className="form-control form-control-sm border border-2"
                          value={post.users}
                          onChange={handleChange}
                          min="0"
                        />
                        {formErrors.users && (
                          <p className="text-danger">{formErrors.users}</p>
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
                          className="form-control form-control-sm border border-2"
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
                  <h3
                    className="d-flex justify-content-start p-1"
                    style={{
                      fontSize: "24px",
                      fontFamily: "'poppins', sans-serif !important",
                      fontWeight: "600",
                      lineHeight: "1.5",
                    }}
                  >
                    Purchase Summary
                  </h3>

                  <div className="d-flex justify-content-center">
                    <div className="card shadow mb-1">
                      <div className="card-body">
                        <div className="row text-start g-0">
                          <p
                            className="d-flex justify-content-center p-0"
                            style={{
                              color: "#C58C4F",
                              fontSize: "16px",
                              fontFamily: " 'poppins', sans-serif !important",
                              lineHeight: "1.5",
                              fontWeight: "700",
                            }}
                          >
                            {selectedPackage}
                          </p>
                          <div className="col text-center mb-1">
                            <p className="card-title ">Branches</p>
                            <p
                              className="card-text  mb-0"
                              style={{ color: "#C58C4F" }}
                            >
                              {post.branchCount}
                            </p>
                          </div>
                          <div className="col text-center">
                            <p className="card-title mb-1">Users</p>
                            <p
                              className="card-text  mb-0"
                              style={{ color: "#C58C4F" }}
                            >
                              {post.users}
                            </p>
                          </div>
                          <div className="col text-center">
                            <p className="card-title mb-1">Training Sessions</p>
                            <p
                              className="card-text mb-0"
                              style={{ color: "#C58C4F" }}
                            >
                              {packageDetails.trainingDaysMax}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-1" />

            
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
    <a href="/terms" style={{ color: "blue", textDecoration: "underline", padding: "5px" }}>
      terms and conditions
    </a> 
    and the 
    <a href="/privacy-policy" style={{ color: "blue", textDecoration: "underline", padding: "5px" }}>
      privacy policy
    </a>.
  </p>
</label>



      {/* Conditional rendering */}
      {isAccepted && (
      <div style={{ marginTop: '20px', padding: '10px' }}>
 {/* First Table */}
<table className="table table-bordered">
  <thead className="table-dark">
    <tr>
      <th
        scope="col"
        className="text-start"
        style={{
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
          lineHeight: "1.5",
          fontWeight: "700",
          color: "white", // Ensures text is white
          padding: "10px", // Adds proper spacing
        }}
      >
       Pricing Plan
      </th>
      <th
        scope="col"
     
        className="text-center"
        style={{
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
          lineHeight: "1.5",
          fontWeight: "700",
          color: "white", // Ensures text is white
          padding: "10px", // Adds proper spacing
        }}
      >
    Amount
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="text-start">
      <td><p>Branch Configuration</p></td>
      <td colSpan="2" className="text-center">
        <p>{new Intl.NumberFormat("en-GB").format(data[`totalConfiguration${capitalize(selectedPackage.split(" ")[1])}`] || 0)} Ksh</p>
      </td>
    </tr>
    <tr className="text-start">
      <td className="text-start"><p>Training Sessions</p></td>
      <td colSpan="2" className="text-center">
        <p>{new Intl.NumberFormat("en-GB").format(data[`totalTraining${capitalize(selectedPackage.split(" ")[1])}`] || 0)} Ksh</p>
      </td>
    </tr>
    <tr className="text-start">
      <td className="text-start"><p>User Subscription</p></td>
      <td colSpan="2" className="text-center">
        <p>{new Intl.NumberFormat("en-GB").format(data[`totalUserAccess${capitalize(selectedPackage.split(" ")[1])}`] || 0)} Ksh</p>
      </td>
    </tr>
    <tr className="text-start">
      <td className="text-start"><p>Hosting Fee</p></td>
      <td colSpan="2" className="text-center">
        <p>{new Intl.NumberFormat("en-GB").format(data[`totalHosting${capitalize(selectedPackage.split(" ")[1])}`] || 0)} Ksh</p>
      </td>
    </tr>
    <tr className="text-start">
      <td className="text-start"><p>Annual Maintenance</p></td>
      <td colSpan="2" className="text-center">
        <p>{new Intl.NumberFormat("en-GB").format(data[`totalSupport${capitalize(selectedPackage.split(" ")[1])}`] || 0)} Ksh</p>
      </td>
    </tr>
  </tbody>
</table>

{/* Second Table */}
<table className="table table-bordered">
<tbody>
<tr className="text-center">
    <td className="text-center"><strong><p style={{ fontWeight: "900" }}>One-off</p></strong></td>
      <td className="text-center">
        <strong><p>{new Intl.NumberFormat("en-GB").format((data[`totalConfiguration${capitalize(selectedPackage.split(" ")[1])}`] || 0) +
          (data[`totalHosting${capitalize(selectedPackage.split(" ")[1])}`] || 0) +
          (data[`totalTraining${capitalize(selectedPackage.split(" ")[1])}`] || 0))} Ksh</p></strong>
      </td>
      <td className="text-center"><strong><p style={{ fontWeight: "900" }}>Total</p></strong></td>
      <td className="text-center">
        <p><strong>{new Intl.NumberFormat("en-GB").format(Number(Object.values(data).reduce((acc, curr) => acc + curr, 0)) || 0)} Ksh</strong></p>
      </td>
    </tr>
    <tr className="text-start">
      
    <td >
    <div className="d-inline-flex align-items-center" style={{ cursor: "pointer" }}>
  <label className="d-inline-flex align-items-center position-relative" style={{ marginRight: "10px" }}>
    <input type="checkbox" className="d-none" checked={isAnnual} onChange={toggleBilling} />
    <div className={`position-relative rounded-pill shadow-sm transition bg-caramel ${isAnnual ? "bg-secondary" : ""}`} style={{ width: "40px", height: "20px", transition: "0.3s" }}>
      <div className={`position-absolute rounded-circle ${isAnnual ? "bg-primary" : "bg-warning"}`} style={{ width: "15px", height: "15px", top: "2.5px", left: isAnnual ? "22px" : "3px", transition: "0.3s" }}></div>
    </div>
  </label>
  <p className="m-0 text-center" style={{ fontWeight: "900"}}>
    <strong>{isAnnual ? "Annual" : "Monthly"}</strong>
  </p>
</div>

</td>


      <td className="text-center"><strong><p>{new Intl.NumberFormat("en-GB").format(isAnnual ? totalAnnual : monthlyAmount)} Ksh</p></strong></td>
      <td className="text-center"><strong><p style={{ fontWeight: "900" }}>VAT (16%)</p></strong></td>
      <td className="text-center">
        <strong><p>{new Intl.NumberFormat("en-GB").format(Number(0.16 * Object.values(data).reduce((acc, curr) => acc + curr, 0)))} Ksh</p></strong>
      </td>
      
    </tr>
    <tr>
    <td className="text-center"><strong><p style={{ fontWeight: "900" }}>Quarterly</p></strong></td>
    <td className="text-center"><strong><p>{new Intl.NumberFormat("en-GB").format(quarterlyAmount)} Ksh</p></strong></td>
    <td className="text-center"><strong><p style={{ fontWeight: "900" }}>Inclusive</p></strong></td>
      <td className="text-center">
        <strong><p>{new Intl.NumberFormat("en-GB").format(Number(0.16 * Object.values(data).reduce((acc, curr) => acc + curr, 0) + Object.values(data).reduce((acc, curr) => acc + curr, 0)))} Ksh</p></strong>
      </td>
    </tr>
    
   
  </tbody>
</table>

<div className="d-flex justify-content-center">
  <button 
    type="submit" 
    className="btn text-white" 
    disabled={isLoading} 
    onClick={handleButtonClick}
    style={{ backgroundColor: "#C58C4F", width: "40%", margin: "20px", fontWeight: "800",  fontSize: "18px" }}
  >
    {isLoading ? <div className="spinner-border text-primary" role="status"></div> : "Place Order"}
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
