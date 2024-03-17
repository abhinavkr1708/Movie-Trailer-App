import React from "react";
import Youtube from "react-youtube";

const Trailer = ({ trailer, setPlaying }) => {
  return (
    <div className="trailer-container">
      <div className="trailer-wrapper">
        <Youtube
          videoId={trailer ? trailer.key : ""}
          className={"youtube amru"}
          containerClassName={"youtube-container amru"}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 1,
              controls: 0,
              cc_load_policy: 0,
              fs: 0,
              iv_load_policy: 0,
              modestbranding: 0,
              rel: 0,
              showinfo: 0,
            },
          }}
        />
        <button
          onClick={() => setPlaying(false)}
          className={"button close-video"}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Trailer;
