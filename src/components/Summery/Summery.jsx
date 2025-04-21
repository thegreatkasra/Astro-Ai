import React from 'react';
import './Summery.css';
import a from './a.png';

const Summery = () => {
  return (
    <div className='home--summery'>  {/* Make sure this matches exactly with Home.jsx */}
      <p>hIIIIIIIIIIIIIIIIIII</p>
      <div>
        <img src={a} alt="Description of image" />  {/* Added alt text */}
      </div>
    </div>
  );
};

export default Summery;