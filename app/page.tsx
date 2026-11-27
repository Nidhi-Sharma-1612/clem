import CtaBand from "@/components/CtaBand";
import BookDirect from "@/components/home/BookDirect";
import FeaturedSuites from "@/components/home/FeaturedSuites";
import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import LocationTeaser from "@/components/home/LocationTeaser";
import Testimonials from "@/components/home/Testimonials";
import WhyStay from "@/components/home/WhyStay";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <FeaturedSuites />
      <WhyStay />
      <BookDirect />
      <Testimonials />
      <LocationTeaser />
      <CtaBand />
    </>
  );
}
