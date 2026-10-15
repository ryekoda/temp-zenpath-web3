import React from 'react';

import '../old/Switch.css';


import { FC } from "react";



interface nameProps {
  isOn: boolean
  handleToggle: any
  onColor?: any
}

const Switch: FC<nameProps> = ({ isOn, handleToggle, onColor }) => {
  return (
    <div className='V7OhT'>
      <input checked={ isOn } onChange={ handleToggle } className="react-switch-checkbox" id={`react-switch-new`} type="checkbox"/>

      <label  style={{ background: isOn && onColor }} className="react-switch-label" htmlFor={`react-switch-new`} >
        <span className={`react-switch-button`} />
        <div className='ZtQEU'>
            <p className='J08f3' id={ isOn ? 'kayuq' : 'XcOn4' }>Yearly</p>
            <p className='J08f3' id={ isOn ? 'siHTH' : 'dJPfk' }>Monthly</p>
        </div>
      </label>
    </div>
  );
};


export default Switch;