import React from 'react'
import logo from "../assets/logo.png"

const Navbar = () => {
  return (
    <>
    <nav className=' fixed top-0 w-full'>
      <div className='main-container py-6 flex justify-between items-center '>
        <img src={logo} alt="S.P.]" className="w-24 h-24"/>
        <div className='flex flex-col gap-1.5 cursor-pointer'> 
          <span className='inline-block w-10 lg:w-12 h-0.5 bg-white'></span>
          <span className='inline-block w-10 lg:w-12 h-0.5 bg-white'></span>
        </div>
      </div>
    </nav>
    </>
  )
}

export default Navbar
