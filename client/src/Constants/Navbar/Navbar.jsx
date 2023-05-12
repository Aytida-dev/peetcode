import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";
import { backendUrl } from "../../constants";

const Navbar = () => {
  const [signin, setSignin] = useState(false);

  useEffect(() => {
    const check = async () => {
      const response = await fetch(`${backendUrl}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });

      const data = await response.json();

      if (data.user) {
        setSignin(true);
      }
    };
    check();
  }, []);

  const handleSignout = () => {
    localStorage.removeItem("token");
    setSignin(false);
  }

  return (
    <div id="navbar-main" className="flex-row">
      <Link to={"/"}>
        <div className="logo-box flex-row">
          <img
            className="logo"
            src="https://user-images.githubusercontent.com/63964149/152531278-5e01909d-0c2e-412a-8acc-4a06863c244d.png"
            alt="logo"
          />
          <p>NeetCode</p>
        </div>
      </Link>
      <div className="nav-options">
        <Link to={"/problemset/all/"}>Problems</Link>
      </div>
      {signin ? (
        <div className="nav-options">
          <Link onClick={handleSignout}>signout</Link>
        </div>
      ) : (<>
        <div className="nav-options">
        <Link to={'/signup'} >Signup</Link>
      </div>
      <div className="nav-options">
        <Link to={'/login'} >Login</Link>
      </div></>
      )}
    </div>
  );
};

export default Navbar;
