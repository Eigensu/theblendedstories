import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhatIsTBS from '@/components/WhatIsTBS';
import AboutUs from '@/components/AboutUs';
import LatestNews from '@/components/LatestNews';
import Explore from '@/components/Explore';
import TBSNights from '@/components/TBSNights';
import TBSTalks from '@/components/TBSTalks';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';

export default function Home() {
  return (
    <>
      <CustomCursor />
      {/* No width constraint here — each section handles its own full-width layout */}
      <Navbar />
      <Hero />
      <WhatIsTBS />
      <AboutUs />
      <LatestNews />
      <Explore />
      <TBSNights />
      <TBSTalks />
      <Footer />
    </>
  );
}
