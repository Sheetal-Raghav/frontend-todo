import React from "react";
import ReactDOM from "react-dom/client";
import {APIContextProvder}from './context/contextApi'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import HeaderComp from "./components/HeaderComp";
import "./components/style.css"


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <APIContextProvder>
        <Routes>
          <Route element={<SignUp/>} path="/signup" />
          <Route element={<SignIn/>} path="/" />
          <Route element={ localStorage.getItem("token") ? ( <HeaderComp/>  ) : ( <Navigate replace to={"/"} /> ) } path="/headercomp" />
        </Routes>
      </APIContextProvder>
    </Router>
  </React.StrictMode>
);
