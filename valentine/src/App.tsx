import FloatingHearts from "./components/FloatingHearts";
import Hero from "./components/Hero";
import Timeline from "./components/Timeline";
import Reasons from "./components/Reasons";
import HeartGame from "./components/HeartGame";
import TheAsk from "./components/TheAsk";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="relative font-poppins">
      <FloatingHearts />
      <Hero />
      <Timeline />
      <Reasons />
      <HeartGame />
      <TheAsk />
      <Footer />
    </div>
  );
}
