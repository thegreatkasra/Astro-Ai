import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';
import Hero3d from './../../components/Hero3d/Hero3d';
import Summery from './../../components/Summery/Summery';

import Header from './../../components/Header/Header';

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useEffect(() => {
    // Animate the entire wrapper instead of individual sections
    gsap.to('.horizontal-wrapper', {
      x: '-100vw', // Move wrapper to the left to reveal #summery
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.horizontal-container',
        start: 'top top', // Start when top of container hits top of viewport
        end: '+=100vh', // End after scrolling 100vh
        scrub: 3, // Smoothly tie animation to scroll
        pin: true, // Pin the container during animation
      },
    });

    // Cleanup ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="horizontal-container">
      <Header />
      <div className="horizontal-wrapper">
        <div id="hero" className="home--hero">
          <Hero3d />
        </div>
        <div id="summery" className="home--summery">
          <Summery />
        </div>
      </div>
    </div>
  );
};

export default Home;