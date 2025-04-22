import React from 'react';
import './Summery.css';

import nft from './img/nft.png'
import bg from './img/bg.svg'

import one from './videos/one.mp4'
import two from './videos/two.mp4'
import three from './videos/three.mp4'

const Summery = () => {
  return (
    <div className='home--summery'> 
      <img src={bg} alt="background" className="home--summery-bg" /> 
      <div className="home--summery-NFT">

        <div className="home--summery-NFT-left">
          <h1>Explore the ASTRO Galaxy of NFT Gaming</h1>
          <p>"ASTRO isn’t just a game—it’s a sci-fi universe where you can own, trade, and battle unique NFTs. Play to earn ASTRO tokens, conquer galaxies, and join a thriving community of space explorers.</p>
          <button>EXPLORE</button>
        </div>

        <div className="home--summery-NFT-right">
          <img src={nft} alt="nft" />
        </div>

      </div>

      <div className="home--summery-video-all">
        <div className="video-title">
          <h2>PLAY ONLINE WITH FRIENDS</h2>
        </div>
        <div className="videos">

          <div className="video1">
            <video autoPlay loop muted playsInline>
              <source src={one} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="video2">
            <video autoPlay loop muted playsInline>
              <source src={two} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="video3">
            <video autoPlay loop muted playsInline>
              <source src={three} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

        </div>
      </div>

    </div>

  );
};

export default Summery;