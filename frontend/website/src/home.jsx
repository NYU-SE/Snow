import { Form, useNavigate, useOutletContext } from "react-router-dom";
import Stream from "./component/stream.jsx";
import { PostFrame } from "./component/post.jsx";
import { getFeeds } from './lib/flake.js';
import "../static/css/home/home.css";

export default function Home() {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  return (<>
    <div id="home-banner">
        <h1>Home</h1>
    </div>
    
    <div id="home-tweet-form">
      <div id="home-tweet-form-left-part">
        <div id="home-tweet-form-left-part-profile-photo"
             style={user.profile_image ? {backgroundImage: `url('${user.profile_image.url}')`} : {}}
        />
      </div>
      <div id="home-tweet-form-right-part">
        <PostFrame user={user} callback={(flake) => {
          navigate(0);
        }}/>
      </div>
    </div>
    
    <div id="small-diviser" />
    
    <div id="tweet-cell-container">
      <Stream user={user} fetchStream={getFeeds} /> 
    </div>
  </>)
}
