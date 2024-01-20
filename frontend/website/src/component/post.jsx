import { useState, useId } from "react";
import { Form } from "react-router-dom";
import { post } from "../lib/flake.js";
import "../../static/css/post.css";

function PostFrame({ user, replyTo, callback }){
  const id = useId();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  return (<>
    <textarea placeholder="Type something!"
              name="content"
              value={content}
              onChange={(event) => { setContent(event.target.value); }}
    />
    <label htmlFor={id} className="flake-label flake-clickable flake-label-hover">
      <i className="ri-image-add-line" />
    </label>
    <input id={id}
           style={{display: "none"}}
           type="file"
           onInput={(event) => {
             const file = event.target.files[0];
             setImage(file);
           }}
    />
    <button id="flake-submit-btn" onClick={() => {
      post(content, image, replyTo).then(function (flake) {
        if (callback) {
          callback(flake);
        }
      });
      setContent("");
      setImage(null);
    }}>Snow</button>
    {image && <div id="tweet-image" style={{backgroundImage: `url('${URL.createObjectURL(image)}')`}} />}
  </>)    
}

function FloatingPostFrame({ user, setVisible, replyTo, callback }) {
  return(<>
    <div className="flake-panel-bg" />
    <div className="flake-panel">
      <div className="flake-panel-header">
        <button className="flake-panel-close-btn"
                onClick={() => {
                  setVisible(false);
                }}>
          <i className="ri-close-fill" />
        </button>
      </div>
      <div className="flake-panel-container">
        <div className="flake-panel-container-left-box">
          <div className="flake-panel-profile-photo"
               style={user.profile_image ? {backgroundImage: `url('${user.profile_image.url}')`} : {}}
          />
        </div>
        <div className="flake-panel-container-right-box">
          <PostFrame user={user} replyTo={replyTo} callback={(flake) => {
            setVisible(false);
            if (callback) {
              callback(flake);
            }
          }} />
        </div>
      </div>
    </div>
   </>);
}

export { PostFrame, FloatingPostFrame };
