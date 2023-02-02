import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAPI } from "../context/contextApi";
const SignUp = () => {
  const { registerUser } = useAPI();
  const [state, setstate] = useState({
    username: "",
    password: "",
    confirm_password: "",
  });
  const handleChange = (e) => {
    setstate((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };
  const handleClick = () => {
    if (state.password === state.confirm_password) {
      registerUser(state);
    } else {
      window.alert("Please add Correct Password");
    }
  };
  return (
    <>
      <h1>SignUp</h1>
      <label>User Name</label>
      <input
        type="text"
        value={state.username}
        onChange={handleChange}
        name="username"
      />
      <label>Password</label>
      <input
        type="password"
        value={state.password}
        onChange={handleChange}
        name="password"
      />
      <label>Confirm Password</label>
      <input
        type="password"
        value={state.confirm_password}
        onChange={handleChange}
        name="confirm_password"
      />
      <button className="btn" onClick={handleClick}>Register</button>
      <Link className="btn" to="/">SignIn</Link>
    </>
  );
};

export default SignUp;
