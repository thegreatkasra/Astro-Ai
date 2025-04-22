import React from 'react'
import './Footer.css'

import play from './img/play.png'
import a from './img/a.png'
import b from './img/b.png'
import c from './img/c.png'
import d from './img/d.png'

const Footer = () => {
  return (
    <div>
        <div className="home--summery-cards-all">
            <div className="home--summery-cards-title">
            <h1>Why Play ASTRO?</h1>
            </div>
            <div className="summery--container-img">
            <img src={play} alt="play" />
            </div>




            <div className="home--summery-cards">
                <div className="home--summery-card">
                    <img src={a} alt="card" />
                    <h2>Own Unique NFTs</h2>
                    <p>Collect rare Astrohedz, starships, and planets as NFTs, each with unique traits and abilities.</p>
                </div>
                <div className="home--summery-card">
                    <img src={b} alt="card" />
                    <h2>Play to Earn Rewards</h2>
                    <p>Earn ASTRO tokens through quests, battles, and trading—your skills pay off in the Enefty Galaxy.</p>
                </div>
                <div className="home--summery-card">
                    <img src={c} alt="card" />
                    <h2>Immersive Sci-Fi Universe</h2>
                    <p>Explore a vast galaxy, battle enemies, and build your empire in a stunning sci-fi world.</p>
                </div>
                <div className="home--summery-card">
                    <img src={d} alt="card" />
                    <h2>Join a Thriving Community</h2>
                    <p>Connect with gamers, collectors, and creators on Discord and X to shape the future of ASTRO.</p>
                </div>

            </div>
            </div>
    </div>
  )
}
import './Footer.css'

export default Footer
