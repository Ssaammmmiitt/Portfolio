import React from 'react'

const GradientButton = ({text, link, className = " " }) => {
  return (
    <>
      <a href={link} className={`btn uppercase font-heading border-2 border-transparent text-center min-w-[205px] px-12 py-2 lg:py-3 rounded-full ${className}`}> {text} </a>
    </>
  )
}

export default GradientButton
