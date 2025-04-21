import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';
import Hero3d from './../../components/Hero3d/Hero3d';
import Header from './../../components/Header/Header';
import Summery from './../../components/Summery/Summery';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);
  const horizontalWrapperRef = useRef(null);
  const heroRef = useRef(null);
  const summaryRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current || !summaryRef.current || !containerRef.current || !horizontalWrapperRef.current) return;

    // Calculate available height (viewport minus header)
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const availableHeight = window.innerHeight - headerHeight;

    // Set up horizontal sections
    const sections = [heroRef.current, summaryRef.current];
    const sectionWidth = window.innerWidth;

    // Set container and wrapper dimensions
    gsap.set(containerRef.current, {
      height: availableHeight,
      marginTop: headerHeight
    });

    gsap.set(horizontalWrapperRef.current, {
      width: sections.length * sectionWidth
    });

    gsap.set(sections, {
      width: sectionWidth,
      height: availableHeight
    });

    // Horizontal scroll animation
    const horizontalScroll = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1/(sections.length - 1),
        end: () => "+=" + (horizontalWrapperRef.current.offsetWidth - window.innerWidth)
      }
    });

    // Hero animation
    gsap.fromTo(heroRef.current,
      { opacity: 1, x: 0 },
      {
        opacity: 0,
        x: -100,
        scrollTrigger: {
          trigger: heroRef.current,
          containerAnimation: horizontalScroll,
          start: "left left",
          end: "right left",
          scrub: true
        }
      }
    );

    // Summary animation
    gsap.fromTo(summaryRef.current,
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: summaryRef.current,
          containerAnimation: horizontalScroll,
          start: "left left",
          end: "right left",
          scrub: true
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(instance => instance.kill());
    };
  }, []);

  return (
    <>
      <div ref={headerRef}>
        <Header />
      </div>
      
      <div ref={containerRef} className="horizontal-container">
        <div ref={horizontalWrapperRef} className="horizontal-wrapper">
          <div ref={heroRef} id='hero' className='home--hero'>
            <Hero3d />
          </div>
          <div ref={summaryRef} className="home--summery">
            <Summery />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;