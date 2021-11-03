import React from "react";
import './Tabbar.scss'
import config from '../config.json'

const Content = () => {
  return (
    <div className="tabbar">
      <ul>
        {config.menus.map((menu, index) => <li key={index}><a href={`${process.env.PUBLIC_URL}/#${menu.url}`}><div className="icon"><i className={menu.icon}></i></div><div className="text">{menu.title}</div></a></li>)}
      </ul>
    </div>
  );
};

export default Content;
