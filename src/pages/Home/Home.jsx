import React from 'react';

import './Home.css';
import Hero3d from './../../components/Hero3d/Hero3d';
import Summery from './../../components/Summery/Summery';


const Home = () => {


  return (
    
      <div className="horizontal-container">

        <div  className="horizontal-wrapper">

          <div  id='hero' className='home--hero'>
            <Hero3d />
          </div>
          
          <div  id='summery' className="home--summery">
            <Summery />
          </div>

        </div>

      </div>
    
  );
};

export default Home;