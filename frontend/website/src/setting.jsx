import { useEffect, useState } from 'react';
import { Link, useOutletContext } from "react-router-dom";
import { updateProfile } from "./lib/user.js";
import "../static/css/settings/settings.css";

export default function Setting() {
  const { user } = useOutletContext();
  const [currentUser, setCurrentUser] = useState(user);
  const [nickname, setNickname] = useState(currentUser.nickname);
  const [bio, setBio] = useState(currentUser.bio);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    if (profileImage) {
      setProfilePreview(URL.createObjectURL(profileImage));
    } else {
      if (user.profile_image) {
        setProfilePreview(currentUser.profile_image.url);
      }
    }
  }, [profileImage]);

  useEffect(() => {
    if (bannerImage) {
      setBannerPreview(URL.createObjectURL(bannerImage));
    } else {
      if (user.banner_image) {
        setBannerPreview(currentUser.banner_image.url);
      }
    }
  }, [bannerImage]);

  return (<>
    <div id="setting-left-part">
    
      <div id="left-part-header">
        <h3>Settings</h3>
      </div>
    
      <p id="left-part-link"><Link to="/setting" >Profile Settings <span className="fa fa-caret-right"/></Link></p>
    
    </div>
    <div id="settings-right-part">
    
      <div id="right-part-header">
        <h3>Profile Settings</h3>
      </div>
    
      <div id="profile-settings">
    
            <label className="flake-label">Nick Name</label>
            <input type="text"
                   placeholder="e.g. John Doe"
                   value={nickname}
                   onChange={(event)=>{
                     setNickname(event.target.value);
                   }}
             />
    
            <label className="flake-label">Bio</label>
            <textarea placeholder="..."
                      value={bio}
                      onChange={(event)=>{
                        setBio(event.target.value);
                      }}
            />
    
            <label className="flake-label">Profile Photo</label>
            <label htmlFor="profile-input" className="flake-label flake-clickable">
              <i className="ri-image-add-line" />
            </label>
            <input type="file"
                   id="profile-input"
                   style={{display: "none"}}
                   onChange={(evnet)=>{
                     setProfileImage(event.target.files[0]);
                   }}
            />
            {profilePreview && <div className="flake-image" style={{backgroundImage: `url('${profilePreview}')`}}/>}
    
            <label className="flake-label">Banner Photo</label>
            <label htmlFor="banner-input" className="flake-label flake-clickable">
              <i className="ri-image-add-line" />
            </label>
            <input type="file"
                   id="banner-input"
                   style={{display: "none"}}
                   onChange={(event)=>{
                     setBannerImage(event.target.files[0]);
                   }}
            />
            {bannerPreview && <div className="flake-image" style={{backgroundImage: `url('${bannerPreview}')`}}/>}
    
            <button className="save-btn"
                    onClick={()=>{
                      updateProfile(nickname, bio, profileImage, bannerImage)
                        .then((updatedUser)=>{
                          if (updatedUser) {
                            setCurrentUser(updatedUser);
                            setNickname(updatedUser.nickname);
                            setBio(updatedUser.bio);
                            setProfileImage(null);
                            setBannerImage(null);
                            alert("Profile updated!");
                          } else {
                            alert("Something wraong, profile is not updated!");
                          }
                        });
                    }}
            >
              Save
            </button>
    
      </div>
    
    </div>
  </>)
}
