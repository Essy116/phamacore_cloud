import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import cloudlogo from "../../assets/MicrosoftTeams-image.png";
import { Toast, ToastContainer } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import FontAwesome

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState({
    fullname: "",
    phone: "",
    emailAddress: "",
    psCompanyName: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const getUserData = async () => {
    try {
      const { email } = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(
        `http://20.164.20.36:86/api/auth/GetUserByEmail/${email}`,
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

      setUser((prev) => ({
        ...prev,
        psCompanyName: response.data.organisationName,
        fullname: response.data.name,
        emailAddress: response.data.email,
        phone: phoneNo.join(""),
      }));

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

  const getFirstName = (fullname) => {
    if (!fullname) return "";
    const nameParts = fullname.split(" ");
    return nameParts[0];
  };

  const getNavLinkClass = (path) => {
    return location.pathname === path ? "nav-link active-link" : "nav-link";
  };

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

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <header className="header sticky-header">
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div style={{ width: "200px" }}></div>

          <div
            className="d-flex align-items-center"
            style={
              !localStorage.getItem("user")
                ? {
                    position: "fixed",
                    display: "flex",
                    top: "0",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: "white",
                  }
                : {} // Empty style if user is logged in
            }
          >
            {/* Logo */}
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src={cloudlogo} alt="Logo" height="100" />
            </Link>

            {/* Navigation Links */}
            <nav>
              <ul className="navbar-nav d-flex flex-row">
                <li className="nav-item">
                  <Link className={getNavLinkClass("/")} to="/">
                    Packages
                  </Link>
                </li>
                <li className="nav-item">
                  {localStorage.getItem("user") && (
                    <Link className={getNavLinkClass("/form")} to="/form">
                      Details
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>

          {localStorage.getItem("user") && (
            <div className="d-flex align-items-center">
              <div className="profile-container d-flex align-items-center">
                <div
                  className="profile-icon"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {getFirstName(user.fullname)}
                </div>

                {showDropdown && (
                  <div className="profile-dropdown">
                    <p>
                      <i className="fas fa-user-circle"></i>{" "}
                      {user.fullname || "User"}
                    </p>
                    <p>
                      <i className="fas fa-phone"></i> {user.phone || "N/A"}
                    </p>
                    <p>
                      <i className="fas fa-envelope"></i>{" "}
                      {user.emailAddress || "N/A"}
                    </p>
                    <hr />
                    <p style={{ cursor: "pointer" }}>
                      <i className="fas fa-sign-out-alt" onClick={handleLogout}>
                        {" "}
                        Logout
                      </i>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
