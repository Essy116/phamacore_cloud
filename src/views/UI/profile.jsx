import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import FontAwesome
import { Toast, ToastContainer } from "react-bootstrap";

export default function Profile() {
  const [user, setUser] = useState({
    fullname: "",
    phone: "",
    emailAddress: "",
    psCompanyName: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("danger");

  const getUserData = async () => {
    try {
      const userEmail = localStorage.getItem("user");

      const response = await axios.get(
        `http://20.164.20.36:86/api/auth/GetUserByEmail/${userEmail}`,
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

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">User Profile</h2>
      <div className="card p-4 shadow-sm text-center">
        <div className="profile-icon"></div>
        <p>
          <i className="fas fa-user"></i> <strong>Name:</strong>{" "}
          {user.fullname || "N/A"}
        </p>
        <p>
          <i className="fas fa-phone"></i> <strong>Phone:</strong>{" "}
          {user.phone || "N/A"}
        </p>
        <p>
          <i className="fas fa-envelope"></i> <strong>Email:</strong>{" "}
          {user.emailAddress || "N/A"}
        </p>
        <hr />
        <Link to="/" className="btn btn-primary">
          <i className="fas fa-home"></i> Log out
        </Link>
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
      </div>
    </div>
  );
}
