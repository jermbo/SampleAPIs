import React, { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

const OuterNav: React.FC = () => {
  const { navVisible, setNavVisible } = useContext(GlobalContext);

  const toggleNav = (e: any) => {
    setNavVisible(!navVisible);
  };

  return (
    <div className="outer-nav">
      {/* eslint-disable-next-line */}
      <a className="active" onClick={toggleNav}>
        Home
        </a>
      {/* eslint-disable-next-line */}
      <a onClick={toggleNav}>About</a>
      {/* eslint-disable-next-line */}
      <a onClick={toggleNav}>API List</a>
      {/* eslint-disable-next-line */}
      <a onClick={toggleNav}>Docs</a>
      {/* eslint-disable-next-line */}
      <a onClick={toggleNav}>Custom</a>
    </div>
  )
}

export default OuterNav;
