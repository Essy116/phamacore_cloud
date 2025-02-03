import React from "react";
import { Link, useLocation } from "react-router-dom";
import cloudlogo from "../../assets/MicrosoftTeams-image.png";

export default function Header({ locationpath }) {
  const location = useLocation();

  const getNavLinkClass = (path) => {
    return location.pathname === path ? "nav-link active-link" : "nav-link";
  };

  return (
    <header className="header sticky-header">
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container-fluid justify-content-center">
          <div className="d-flex justify-content-center align-items-center">
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src={cloudlogo} alt="Logo" width="100%" height="100" />
              <span className="ms-2"></span>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse " id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
               
                  
                   
                    <Link
                      className={getNavLinkClass("/")}
                     aria-current="page"
                     to="/"
                     >
                      Packages
                    </Link>
                
                </li>

                <li className="nav-item">
                  <Link className={getNavLinkClass("/form")} to="/form">
                    Details
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
