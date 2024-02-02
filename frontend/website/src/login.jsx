import { Form, redirect } from "react-router-dom";
import { login } from './lib/user.js';
import "../static/css/auth/login.css";
import logo from "../static/branding/logo.png";

export async function action({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const user = await login(username, password);
  if (user) {
    return redirect("/");
  } else {
    alert("Login failed.");
    return null;
  }
}

export default function Login(){
  return (
    <div id="login-container">
        <img src={logo} alt="logo" />
        <h1>Log in to Snow</h1>

        <Form method="POST">
            <input type="text" placeholder="Username" name="username" />
            <input type="password" placeholder="Password" name="password" />
            <input type="submit" value="Log in" id="login-submit-btn" name="login_form_submit_btn" />
        </Form>

        <p><a href="/auth/signup">Signup for Snow</a></p>
    </div>
  )
}
