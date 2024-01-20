import { useEffect, useState } from 'react';
import { Link, useLoaderData, useOutletContext } from "react-router-dom";
import Stream from "./component/stream.jsx";
import { getUser, isFollowing, follow, unfollow } from "./lib/user.js";
import { listFlakes } from "./lib/flake.js";
import { formatDate } from "./lib/date.js";
import "../static/css/profile/profile.css";

export async function loader({ params }) {
  if ('userId' in params) {
    const target = await getUser(params.userId);
    if (!target) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }
    return target;
  } else {
    return null;
  }
}

export default function Profile() {
  const { user } = useOutletContext();
  const target = useLoaderData() || user;
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (user.id !== target.id) {
      isFollowing(user, target).then((result)=>{ setFollowing(result); });
    }
  });

  const getFlakes = async (offset, limit) => {
    return listFlakes(target, offset, limit);
  }

  return (<>
    <div id="profile-header">
        <h3>{target.nickname}</h3>
        <p>{target.flakes_count} Flakes</p>
    </div>
    
    <div id="profile-banner-container">
        <div id="profile-banner"
             style={target.banner_image ? {backgroundImage: `url('${target.banner_image.url}')`} : {}}
        />
    
      <div id="profile-banner-bottom-part">
          <div id="profile-photo"
               style={target.profile_image ? {backgroundImage: `url('${target.profile_image.url}')`} : {}}
          />
    
          <div id="clear"></div>

          {user.id === target.id ? (<Link to="/settings" className="flake-btn">Edit profile</Link>) : (
            following ? (
              <button className="flake-btn" onClick={()=>{
                unfollow(target).then((success)=>{
                  if (success) {
                    setFollowing(false);
                  }
                })
              }}>Unfollow</button>
            ) : (
              <button className="flake-btn" onClick={()=>{
                follow(target).then((success)=>{
                  if (success) {
                    setFollowing(true);
                  }
                })
              }}>Follow</button>
            )
          )}

          <div id="clear"></div>
      </div>
    
    </div>
    
    <div id="profile-bio">
      <h3>{target.nickname}</h3>
      <p id="bio-username">@{target.username}</p>
    
      <p id="bio-bio">{target.bio}</p>
    
      <p id="bio-date">{formatDate(target.creation_date)}</p>
    
      <p id="bio-followers"><b>{target.follows_count}</b>Following <span id="right-space" /> <b>{target.followers_count}</b>Followers</p>
    </div>
    
    
    <div id="profile-nav">
      <p><Link to="/profile">Flakes</Link></p>
    </div>
    
    <Stream user={target} fetchStream={getFlakes} key={target.id} />
  </>)
}
