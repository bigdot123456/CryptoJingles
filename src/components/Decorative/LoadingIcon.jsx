import React from 'react';

import './LoadingIcon.scss';

const PlayIcon = () => (
  <div className="loading-icon-wrapper">
    <svg id="load" x="0px" y="0px" viewBox="0 0 150 150">
      <circle id="loading-inner" cx="75" cy="75" r="60" />
    </svg>
  </div>
);

export default PlayIcon;
