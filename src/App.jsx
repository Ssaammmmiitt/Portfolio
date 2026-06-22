import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Hero from "./Sections/Hero";
import About from "./Sections/About";
import Services from "./Sections/Services";
import Work from "./Sections/Work";
import Marquee from "./Sections/Marquee";
import Contact from "./Sections/Contact";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Work />
        <Marquee />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
