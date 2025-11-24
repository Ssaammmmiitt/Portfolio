import React from "react";

const Services = () => {
  return (
    <>
      <div className="bg-white text-black mx-10">
        <div className="main-container pb-8 lg:pb-12">
          <h3>Services</h3>
        </div>
      </div>

      <div className="relative">
        <div className="bg-black text-white px-2 py-8 lg:py-10">
          <div className="main-container grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/*left side */}
            <div className="flex gap-6 lg:gap-8">
              <span className="text-gray-400 text-lg lg:text-2xl tracking-wide block mb-4 font-heading">
                01
              </span>
              <h2 className="text-[8vw] md:text-6xl font-heading font-bold leading-none">
                Frontend & Mobile Development
              </h2>
            </div>
            {/*right side*/}
            <div className="flex items-center">
              <p className="text-lg lg:text-xl leading-relaxed ">
                Building responsive web interfaces with React, Next.js and
                developing cross-platform mobile apps using React Native,
                focusing on clean design and smooth user experience.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#353839] text-white px-2 py-8 lg:py-10">
          <div className="main-container grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/*left side */}
            <div className="flex gap-6 lg:gap-8">
              <span className="text-gray-400 text-lg lg:text-2xl tracking-wide block mb-4 font-heading">
                02
              </span>
              <h2 className="text-[8vw] md:text-6xl font-heading font-bold leading-none">
                Full-Stack Application Prototyping
              </h2>
            </div>
            {/*right side*/}
            <div className="flex items-center">
              <p className="text-lg lg:text-xl leading-relaxed ">
                Creating functional prototypes using React with basic Express or
                Python backends, handling UI, API integration, and end-to-end
                feature development.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#212122] text-white px-2 py-8 lg:py-10">
          <div className="main-container grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/*left side */}
            <div className="flex gap-6 lg:gap-8">
              <span className="text-gray-400 text-lg lg:text-2xl tracking-wide block mb-4 font-heading">
                03
              </span>
              <h2 className="text-[8vw] md:text-6xl font-heading font-bold leading-none">
                AI, ML & Data Processing{" "}
              </h2>
            </div>
            {/*right side*/}
            <div className="flex items-center">
              <p className="text-lg lg:text-xl leading-relaxed ">
                Creating AI-driven tools such as text summarizers and
                note-merging systems, working on ML projects like wildfire
                prediction, and building data pipelines including OCR, text
                extraction, and preprocessing for training models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
