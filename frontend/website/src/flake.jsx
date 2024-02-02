import { useState } from 'react';
import { Link, useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import Stream from "./component/stream.jsx";
import { FloatingPostFrame } from "./component/post.jsx";
import { like, getFlake, getComments } from "./lib/flake.js";
import { formatDate } from "./lib/date.js";
import "../static/css/home/single_tweet.css";

export async function loader({ params }) {
  const flake = await getFlake(params.flakeId);
  if (!flake) {
    throw new Response("", {
      status: 404,
      statusText: "Flake Not Found",
    });
  }
  return flake;
}

export default function Flake() {
  const { user } = useOutletContext();
  const [flake, setFlake] = useState(useLoaderData());
  const navigate = useNavigate();

  const [showReplyPanel, setShowReplyPanel] = useState(false);

  async function fetchComments(offset, limit) {
    return getComments(flake, offset, limit);
  }

  return (<>
    <div id="single-tweet-header">
        <p><Link onClick={()=>{ navigate(-1); }}><span className="fa fa-arrow-left"></span></Link></p>
        <h4>Flake</h4>
    </div>
    
    <div id="single-tweet-content-container">
      <div id="single-tweet-content-container-top">
        <div id="single-tweet-content-container-top-left-box">
            <div id="single-tweet-content-top-profile-photo"
                 style={flake.author.profile_image ? {backgroundImage: `url('${flake.author.profile_image.url}')`} : {}}></div>
        </div>
        <div id="single-tweet-content-container-top-right-box">
          <Link to={`/profile/${flake.author.id}`}>
            <h3>{flake.author.nickname}</h3>
            <p>@{flake.author.username}</p>
          </Link>
        </div>
      </div>
      <div id="single-tweet-content-container-middle">
        <p id="single-tweet-content-content">
          {flake.content.split('\n').map((paragraph, index) => (
            <span key={index}>
              {paragraph}
              <br/>
            </span>
          ))}
        </p>

        {showReplyPanel && (
          <FloatingPostFrame user={user}
                             replyTo={flake}
                             setVisible={setShowReplyPanel}
                             callback={(comment) => { navigate(0); }}
          />)}
    

        {flake.image && <div id="single-tweet-content-img" style={{backgroundImage: `url('${flake.image.url}')`}} />}
    
        <p id="single-tweet-content-bottom">
          <span id="single-tweet-content-date">
            {formatDate(flake.creation_date)}
          </span>
          <span id="single-tweet-content-dot" className="fa fa-circle" />
          <span id="single-tweet-content-likes">
            <b>{flake.likes_count}</b> Likes
            <span id="right-space" />
            <b>{flake.comments_count}</b> Comments
          </span>
        </p>
    
      </div>
    </div>
    
    <div id="single-twee-operations">
      <button onClick={() => {
        like(flake).then((newFlake) => {
          if (newFlake) {
            setFlake(newFlake);
          }
        });
      }}>&#128153;</button>
    
      <button id="hidden-panel-open-btn"
              onClick={()=>{ setShowReplyPanel(!showReplyPanel); }}>
        <span className="fa fa-comment" />
      </button>
    </div>
    
    <div id="tweet-comments-container">
      <Stream user={user} fetchStream={fetchComments} key={flake.id} /> 
    </div>
  </>)
}
