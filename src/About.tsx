import React from "react";
import './About.scss'
import QRCode from 'qrcode.react'
import Share from './App/Share'
import config from './config.json'

const Content = () => {
  const url = window.location.href.replace(/\?.+$/, '').replace(/#.+$/, '')

  return (
    <div className="about">
      <div className="branding">
        <div className="image"><img src={config.logo_image} alt=""/></div>
        <h1 className="logo">{config.title}</h1>
      </div>

      <h2 className="description">{config.description}</h2>
      <div className="qrcode"><QRCode value={url} bgColor="transparent" fgColor="#FFFFFF" /></div>
      <Share />
    </div>
  );
};

export default Content;
