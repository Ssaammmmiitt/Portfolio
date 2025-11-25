import React from 'react'
import GradientButton from '../Components/GradientButton'



const Work = () => {
  return (
    <>
      <div className='h-screen bg-white text-black py-24 lg:py-40'>
        {/*title*/}
        <div className='main-container pb-8 lg:pb-12 max-md:flex-col flex gap-6 justify-between items-start md:items-end'>
          <div className='max-w-xl'>
            <h3 className='mb-3'>Selected Works</h3>
            <div className="text-lg lg:text-xl">A showcase of my projects and collaborations.</div>
          </div>
          <GradientButton text="View Works" className='btn-light ' link="/" />
        </div>


        {/*projects*/}
        <div className="flex gap-4">
          <a href=''>
            <img src="" alt =" " />
            <span></span>
          </a>
        </div>
      </div>
    </>
  )
}

export default Work
