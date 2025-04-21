import React from 'react'
import './Home.css'
import Hero3d from './../../components/Hero3d/Hero3d'
import Header from './../../components/Header/Header'

const Home = () => {
  return (
    <>

      <div id='hero' className='home--hero'>
        <Header />
        <Hero3d />
      </div>

      <div className="home--summery">
        
      </div>
      
    </>
  )
}

export default Home
