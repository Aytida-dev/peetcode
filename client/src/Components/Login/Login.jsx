import React from "react";

import "./Login.css";
import { useState } from "react";
import { backendUrl } from "../../constants.js";
import Alert from "../alert/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const login = async () => {
    const response = await fetch(`${backendUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();
    if(data.error === "email or password is incorrect"){
        setAlertProps({
          message: "Email or password is incorrect",
          type: "danger",
        })

    }
    else if(data.token){
      setAlertProps({
        message: "Login successful",
        type: "success",
      })
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
    localStorage.setItem("token", data.token);
    setAlert(true);
    
  };

  setTimeout(() => {
    setAlert(false);
  }, 2000)

  return (
    <div id="login" className="flex-col">
      {alert && <Alert message={alertProps.message} type={alertProps.type} />}
      <h1>Login</h1>
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
          />
        </div>

        <div className="subform">
          <label htmlFor="password">Password: </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            placeholder="Your Password"
          />
        </div>

        <button type="submit" id="test" onClick={() => login()} disabled={!email || !password}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
