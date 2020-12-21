import React from "react";

interface Props {}

const Nav: React.FC<Props> = () => {
  return (
    <div className="full-screen-nav">
      <ul>
        <li>
          <a href="#/">HOME</a>
        </li>
        <li>
          <a href="#/">ABOUT</a>
        </li>
        <li>
          <a href="#/">PORTFOLIO</a>
        </li>
        <li>
          <a href="#/">BLOG</a>
        </li>
        <li>
          <a href="#/">CONTACT</a>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
