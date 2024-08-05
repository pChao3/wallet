import React, { useState } from 'react';
import Name from './Name';
import './Content.css';
function ContentLayout() {
  return (
    <div className="content-wrap">
      <Name />
    </div>
  );
}

export default ContentLayout;
