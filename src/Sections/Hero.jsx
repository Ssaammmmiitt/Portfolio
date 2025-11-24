import Spline from "@splinetool/react-spline";
import React from "react";
import GradientButton from "../Components/GradientButton";

const Hero = () => {
  return (
    <>
      <div className="relative overflow-hidden">
        <div className="main-container h-screen flex flex-col lg:justify-center items-start lg:py-12 max-lg:pt-40">
          <h1 className="text-3xl lg:text-[3.2vw] uppercase font-heading font-semibold">
            Sammit Poudyal
          </h1>
          <h2 className="text-6xl lg:text-[8vw] font-heading font-bold leading-none lg:tracking-wide tracking-widest mt-3 mb-6">
            Web Developer <br /> <span className="text-stroke">(Frontend)</span>
          </h2>
          <GradientButton
            text="Let's Connect"
            link="mailto:poudyal.sammit@gmail.com"
          />
        </div>
      <div className='absolute -z-10 top-28 lg:top-32 right-[-15%] lg:right-12 w-96 h-96'>
        <Spline scene="https://prod.spline.design/rrwZ-JfRgHA8TcXd/scene.splinecode" />
      </div>
      </div>
    </>
  );
};

export default Hero;
