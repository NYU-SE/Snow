import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { like, _delete } from "../lib/flake.js";
import { formatDate } from '../lib/date.js';

import "../../static/css/stream.css";

export default function Stream({ user, fetchStream }) {
  const [offset, setOffset] = useState(0);
  const [stream, setStream] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStream(offset, 40).then(function (data) {
      setStream(data);
    });
  }, [offset]);

  function updateStream(newFlake) {
    const newStream = stream.map((flake) => {
      if (flake.id === newFlake.id) {
        return newFlake;
      } else {
        return flake;
      }
    });
    setStream(newStream);
  }

  function deleteFlake(deleted) {
    const newStream = stream.filter((flake) => {
      return flake.id !== deleted.id;
    });
    setStream(newStream);
  }

  return (<>
    <div className="flake-cell-container">
    
      {stream.map((flake) => (
    
        <div className="flake-cell" key={flake.id}>
    
          <div className="flake-cell-left-part">
            <div className="flake-cell-left-part-profile-photo"
                 style={flake.author.profile_image ? {backgroundImage: `url('${flake.author.profile_image.url}')`} : {}}
            />
          </div>
          <div className="flake-cell-right-part">
            <p className="flake-cell-header">
              <b><Link to={`/profile/${flake.author.id}`}>{flake.author.nickname}</Link></b>
              @{flake.author.username} · {formatDate(flake.creation_date)}
            </p>
            <p>
              {flake.content.split('\n').map((paragraph, index) => (
                <span key={index}>
                  {paragraph}
                  <br/>
                </span>
              ))}
            </p>
    
            {flake.image && <div className="flake-image" style={{backgroundImage: `url('${flake.image.url}')`}} />}
    
            <div className="flake-cell-right-part-bottom-links">

              <div className="flake-cell-button-container">
                <button className="flake-cell-button" onClick={() => {
                  like(flake).then((newFlake) => {
                    if (newFlake) {
                      updateStream(newFlake);
                    }
                  });
                }}>&#128153;</button>
                <p>{flake.likes_count}</p>
              </div>

              <div className="flake-cell-button-container">
                <button className="flake-cell-button" onClick={()=>{ navigate(`/flake/${flake.id}`); }}>
                  <span className="fa fa-comment" />
                </button>
                <p>{flake.comments_count}</p>
              </div>
    
              {flake.author.id === user.id &&
                <div className="flake-cell-button-container">
                  <button className="flake-cell-button" onClick={()=>{
                    if (confirm("Do you really want to delete this flake? This cannot be undone.")) {
                      _delete(flake).then((success) => {
                        if (success) {
                          deleteFlake(flake);
                        }
                      })
                    }
                  }}>
                    <span className="fa fa-trash" />
                  </button>
                </div>
              }

            </div>
          </div>
        </div>
      ))}
    
    
      <div id="pagination-container">
        {offset > 0 && <Link onClick={()=>{ setOffset(Math.min(0, offset - 40)); }}><span className="fa fa-caret-left" /></Link>}
        {stream.length >= 40 && <Link  onClick={()=>{ setOffset(offset + 40); }}><span className="fa fa-caret-right"/></Link>}
      </div>

    </div>
  </>)
}
