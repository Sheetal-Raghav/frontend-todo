import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAPI } from "../context/contextApi";
const SignIn = () => {
  const { loginUser } = useAPI();
  const [state, setstate] = useState({
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    setstate((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };
  const handleClick = () => {
    loginUser(state);
  };
  return (
    <>
    <h1>SignIn</h1>
    <div className="container">
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
      <div className="btns">
      <button className="btn" onClick={handleClick}>Login</button>
      <Link className="btn" to="/signup">SignUp</Link>
      </div>
      </div>
    </>
  );
};

export default SignIn;
