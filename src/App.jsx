import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import TerminalBackground from "./Components/TerminalBackground";
import { ThemeProvider } from "./context/ThemeProvider";
import About from "./Sections/About";
import Contact from "./Sections/Contact";
import Hero from "./Sections/Hero";
import Marquee from "./Sections/Marquee";
import Services from "./Sections/Services";
import Work from "./Sections/Work";

function App() {
  return (
    <ThemeProvider>
      <TerminalBackground />
      <div className="relative z-10">
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
      </div>
    </ThemeProvider>
  );
}

export default App;
