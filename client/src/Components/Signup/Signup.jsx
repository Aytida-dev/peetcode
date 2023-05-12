import React, { useState } from "react";

import "./Signup.css";
import { backendUrl } from "../../constants.js";
import Alert from "../alert/alert";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const signup = async () => {
    console.log(email, password);
    const response = await fetch(`${backendUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();
    console.log(data);
    //if status is 200, then redirect to login page
    if (data.msgg === "User created") {
      
      setAlertProps({
        message: "User created successfully ",
        type: "success",
      });
     
      
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
    else if(data.error === "email already exists"){
      
      setAlertProps({
        message: "User already exists",
        type: "danger",
      });
    }
    setAlert(true);
  };

  setTimeout(() => {
    setAlert(false);
  }, 2000);

  return (
    <div id="signup" className="flex-col">
      {alert && <Alert message={alertProps.message} type={alertProps.type} />}
      <h1>Signup</h1>
      <div className="signup-form">
        <div className="subform">
          <label htmlFor="email">Email: </label>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            name="email"
            placeholder="Your Email"
            value={email}
          />
        </div>

        <div className="subform">
          <label htmlFor="password">Password: </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            placeholder="Your Password"
            value={password}
          />
        </div>

        <div className="subform">
          <label htmlFor="confirm password">confirm password: </label>
          <input
            onChange={(e) => setCheckPassword(e.target.value)}
            type="password"
            placeholder="confirm password"
            value={checkPassword}
          />
        </div>

        <button
          type="submit"
          id="test"
          onClick={() => signup()}
          disabled={
            password === "" || email === "" || password !== checkPassword
          }
        >
          SIGNUP
        </button>
      </div>
      {password !== checkPassword && (
        <div className="alert">Passwords do not match</div>
      )}
    </div>
  );
};

export default Signup;

// neetcode1@gmail.com
