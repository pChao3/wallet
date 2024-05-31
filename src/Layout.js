import React, { useState } from 'react';
import Header from './component/header/Header';
import ContentLayout from './component/content/Content';
import './Layout.css';

function Wrap() {
  return (
    <div className="wrap-box">
      <Header />
      <ContentLayout />
    </div>
  );
}

export default Wrap;
