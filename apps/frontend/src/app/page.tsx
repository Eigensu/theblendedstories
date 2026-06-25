import Hero from '@/components/Hero';
import NewsletterPopup from '@/components/NewsletterPopup';
import WhatIsTBS from '@/components/WhatIsTBS';
import AboutUs from '@/components/AboutUs';
import WhyWeExist from '@/components/WhyWeExist';
import TBSNights from '@/components/TBSNights';
import TheEdit from '@/components/TheEdit';
import TBSTalks from '@/components/TBSTalks';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <NewsletterPopup />
      <Hero />
      <WhatIsTBS />
      <AboutUs />
      <WhyWeExist />
      <TBSNights />
      <TheEdit />
      <TBSTalks />
      <Footer />
    </>
  );
}
