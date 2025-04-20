import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './Header.css';
import logo from './img/logo.png';

const Header = () => {
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const buttonRef = useRef(null);
  const listItemsRef = useRef([]);

  // Add items to the listItemsRef array
  const addToRefs = (el) => {
    if (el && !listItemsRef.current.includes(el)) {
      listItemsRef.current.push(el);
    }
  };

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

      // Nav items animation - stagger fade in with upward motion
      gsap.from(listItemsRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
        delay: 0.4
      });

      // Button animation - fade in from right
      gsap.from(buttonRef.current, {
        x: 100,
        opacity: 0,
        duration: 1,
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

      <nav className="header--navbar" ref={navRef}>
        <ul>
          <li ref={addToRefs}>Home</li>
          <li ref={addToRefs}>About us</li>
          <li ref={addToRefs}>Pricing</li>
          <li ref={addToRefs}>Community</li>
        </ul>
      </nav>

      <div className="header--signin">
        <button ref={buttonRef}>Sign in</button>
      </div>
    </header>
  );
};

export default Header;