import { useState } from 'react';
import { Outlet, Link, Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { FloatingPostFrame } from "./component/post.jsx";
import axios from 'axios';
import { getCurrentUser, getTrendingUsers, logout } from './lib/user.js';
import "../static/css/main_base.css";
import logo from "../static/branding/logo.png";

export async function loader() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect('/auth/login');
  }
  const trendingUsers = await getTrendingUsers();
  return { user, trendingUsers };
}

export default function Root() {
  const { user, trendingUsers } = useLoaderData();
  const navigate = useNavigate();

  const [showLogout, setShowLogout] = useState(false);
  const [showFlakePanel, setShowFlakePanel] = useState(false);

  return (<>
    <div id="left-navigation">
      <p><Link to="/"><img src={logo}/></Link></p>
      <p><Link to="/"><i className="ri-home-2-line"></i></Link></p>
      {/*
      <p><Link to="explore"><i className="ri-hashtag"></i></Link></p>
      <p><Link to="notification"><i className="ri-notification-4-line"></i></Link></p>
      */}
      <p><Link to="/profile"><i className="ri-user-2-line"></i></Link></p>
      <p><Link to="/settings"><i className="ri-settings-5-line"></i></Link></p>

      <button id="tweet-panel-open-btn"
              onClick={() => { setShowFlakePanel(true); }}>
         <i className="ri-add-line"></i>
      </button>
      <div id="profile-photo-left-nav"
           style={user.profile_image ? {backgroundImage: `url('${user.profile_image.url}')`} : {}}
           onClick={() => {
             setShowLogout(!showLogout);
           }}></div>
    </div>

    {showLogout && (
      <div id="hidden-logout-panel">
        <p>
          <a href="#"
            onClick={() => {
                logout().then(() => {
                  navigate("/auth/login");
                });
                event.preventDefault();
              }
            }
          >Log out @{user.username}</a>
        </p>
      </div>
    )}

    {showFlakePanel && (<FloatingPostFrame user={user} setVisible={setShowFlakePanel} callback={(flake)=>{ navigate(0); }}/>)}

    <div id="content-container">
      <Outlet context={{user: user}} />
    </div>


    <div id="right-navigation">

      {/*
      <div id="right-nav-search-container">
          <form action="{% url 'home' page %}" method="POST">
            {% csrf_token %}
            <input name="right_nav_search_submit_btn" id="search-submit-btn" type="submit" value="&#128269;" />
            <input name="search_input" id="search-text-input" type="text" placeholder="Search Snow" />
          </form>
      </div>
      */}

      <div id="who-to-follow">
        <div id="who-to-follow-header">
          <h3>Who to follow</h3>
          <div id="who-to-follow-horizontal-line"></div>
        </div>

        {trendingUsers.map((followee) => (
          <div id="who-to-follow-cell" key={followee.id}>
            <div id="who-to-follow-cell-left-part">
                <div id="who-to-follow-profile-photo"
                     style={followee.profile_image ? {backgroundImage: `url('${followee.profile_image.url}')`} : {}}
                ></div>
            </div>
            <div id="who-to-follow-cell-center-part">
              <h4>{followee.nickname}</h4>
              <p>@{followee.username}</p>
            </div>
            <div id="who-to-follow-cell-right-part">
              <Link to={`/profile/${followee.id}`} className="flake-btn">View Profile</Link>
            </div>
          </div>
        ))}

      </div>
    </div>
  </>)
}
