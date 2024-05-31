import React, { useState } from 'react';
import WalletComp from '../components/WalletComp';
import Name from '../components/Name';
import './Content.css';
function ContentLayout() {
  return (
    <div className="content-wrap">
      <Name />
    </div>
  );
}

export default ContentLayout;
