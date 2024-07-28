import React from "react";
import { setConstraint } from "../constraints";
import "../css/Navbar.css";
import axios from "axios";
import LostItem from "./Lost_item";
import pict from '../img/PICT-Logo-roundcropped.png'
import { ToastProvider } from "react-toast-notifications";
function Navbar() {
  const token = window.localStorage.getItem("token");
  const signout = () => {
    setConstraint(false);

    console.log("Signed out !");
    axios({
      url: "http://localhost:8000/signout",
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(localStorage.clear())
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="navbar">
        <div className="logo">
          <a style={{ textDecoration: "none", color: "white" }} href="/">

            <h2>FindHUB</h2>
          </a>
        </div>

        <div
          style={token ? { display: "none" } : {}}
          id="login"
          className="signin"
        >
          <ul>
            <a
              id="a"
              style={{ textDecoration: "none", color: "white" }}
              href="/sign-up"
            >
              Sign-up
            </a>
          </ul>
          <ul>
            <a
              id="a"
              style={{ textDecoration: "none", color: "white" }}
              href="/log-in"
            >
              Log-in
            </a>
          </ul>
        </div>
        <div style={token ? {} : { display: "none" }} className="postsignin">
          <ToastProvider autoDismiss={true} placement={"bottom-right"}>
            <div>
              <LostItem />
            </div>
          </ToastProvider>
          <ul>
            <a style={{ textDecoration: "none", color: "white" }} href="/feed">
              Feed
            </a>
            <a
              style={{ textDecoration: "none", color: "white" }}
              href="/responses"
            >
              Responses
            </a>
            <a
              style={{ textDecoration: "none", color: "white" }}
              href="/mylistings"
            >
              My Listings
            </a>
            <a
              style={{ textDecoration: "none", color: "white" }}
              onClick={signout}
              href="/log-in"
            >
              Sign-out
            </a>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
