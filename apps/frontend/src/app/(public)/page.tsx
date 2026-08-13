import Hero from '@/components/Hero';
import NewsletterPopup from '@/components/NewsletterPopup';
import WhatIsTBS from '@/components/WhatIsTBS';
import AboutUs from '@/components/AboutUs';
import TBSNights from '@/components/TBSNights';
import TheEdit from '@/components/TheEdit';
import TBSTalks from '@/components/TBSTalks';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

// Helper to fetch data safely without crashing the frontend
async function fetchCMSData(endpoint: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(`Failed to fetch CMS data for ${endpoint}:`, error);
    return null;
  }
}

export default async function Home() {
  // Fetch all CMS data in parallel
  const [
    heroData,
    whatIsTbsData,
    whatWeCoverData,
    tbsNightsData,
    theEditData,
    tbsTalksData,
    footerData,
    settingsData
  ] = await Promise.all([
    fetchCMSData('/hero/'),
    fetchCMSData('/what-is-tbs/'),
    fetchCMSData('/what-we-cover/'),
    fetchCMSData('/tbs-nights/'),
    // Top Picks is a manually curated "featured" list — it must never go blank
    // just because a visitor's city has nothing tagged for it, so this doesn't
    // filter by location the way the /stories archive optionally does.
    fetchCMSData('/articles/?featured=true'),
    fetchCMSData('/tbs-talks/?featured=true'),
    fetchCMSData('/footer/'),
    fetchCMSData('/settings/')
  ]);

  return (
    <>
      <NewsletterPopup />
      <Hero data={heroData} />
      <WhatIsTBS data={whatIsTbsData} />
      <AboutUs data={whatWeCoverData} settings={settingsData} />
      <TBSNights data={tbsNightsData} />
      <TheEdit data={theEditData} settings={settingsData} />
      <TBSTalks data={tbsTalksData} settings={settingsData} />
      <Footer data={footerData} />
    </>
  );
}
