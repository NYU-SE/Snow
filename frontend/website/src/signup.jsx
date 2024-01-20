import { useState } from 'react';
import { Form, redirect } from 'react-router-dom';
import { signup } from "./lib/user.js";
import "../static/css/auth/signup.css";
import logo from "../static/branding/logo.png";

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");
  const password2 = formData.get("password_repeat");
  if (password != password2) {
    alert("Invalid credentials: password does not match!");
    return null;
  }
  const [user, messages] = await signup(email, username, password);
  if (user) {
    return redirect("/");
  } else {
    alert("Invalid credentials:\n" + messages.join("\n"));
    return null;
  }
}

export default function Signup(){
  const [signupFormVisible, setSignupFormVisible] = useState(false);

  return (<>
    <div id="left-box"/>

    <div id="right-box">
      <img src={logo} alt="logo" />
      <h1>Happening now</h1>
      <h3>Join Snow today.</h3>
      <button id="signup-button" onClick={()=>{ setSignupFormVisible(true); }}>Sign up</button>
      <button id="login-button"><a href="/auth/login">Log in</a></button>

      <p id="footer">This project is for non-profit and educational purposes.</p>
    </div>

    {signupFormVisible && <>
      <div id="hidden-signup-bg-grey" />
      <div id="hidden-signup-form">
        <button id="close-btn" onClick={()=>{ setSignupFormVisible(false); }}><i className="ri-close-line" /></button>
        <div id="img-container">
          <img src={logo} alt="logo"/>
        </div>
        <Form method="POST">
          <label>What's your email?</label>
          <input type="text" placeholder="Enter your email." name="email"/>
          <label>Create a username</label>
          <input type="text" placeholder="Create a username." name="username"/>
          <label>Create a password</label>
          <input type="password" placeholder="Create a password." name="password"/>
          <label>Confirm your password</label>
          <input type="password" placeholder="Enter your password again." name="password_repeat"/>
          <input id="signup-submit-btn" type="submit" value="Sign up" name="signup_submit_button" />
        </Form>
      </div>
    </>}
  </>)
}
