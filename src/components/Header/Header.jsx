import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './Header.css';
import logo from './img/logo.png';

const Header = () => {
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const buttonRef = useRef(null);




  useEffect(() => {
    // Create a GSAP context for easier cleanup
    const ctx = gsap.context(() => {
      // Logo animation - fade in from left
      gsap.from(logoRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        delay: 0.2
      });
      
  
      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 1,
        ease: "back.out(1.2)",
        delay: 0.4
      });

      // Button animation - fade in from right
      gsap.to(buttonRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease: "expo.out",
        delay: 0.6
      });
    });

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <header className='header'>
      <div className="header--logo" ref={logoRef}>
        <img src={logo} alt="logo" />
      </div>

      <nav className="header--navbar" ref={navRef} >
        <ul >
          <li >Home</li>
          <li >About us</li>
          <li >NFT</li>
          <li >Community</li>
        </ul>
      </nav>

      <div className="header--signin">
        <button ref={buttonRef}>Sign in</button>
      </div>
    </header>
  );
};

export default Header;