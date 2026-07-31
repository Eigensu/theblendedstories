import AuthProviders from '@/components/auth/AuthProviders';
import MegaMenu from '@/components/MegaMenu';
import MobileTouchReveal from '@/components/MobileTouchReveal';
import ProfileButton from '@/components/nav/ProfileButton';
import LocationSwitcher from '@/components/nav/LocationSwitcher';
import SiteSearch from '@/components/search/SiteSearch';
import { fetchMenuSections } from '@/services/menuApi';
import { fetchLocationRegions } from '@/services/locationApi';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // MegaMenu and LocationSwitcher are client components, so their taxonomies are
  // read here and passed down. Both fetches are cached per render pass, so any
  // page reading them again — /topics, or a listing filtering by location —
  // costs nothing extra.
  const [menuSections, locationRegions] = await Promise.all([
    fetchMenuSections(),
    fetchLocationRegions(),
  ]);

  return (
    <AuthProviders>
      {children}
      {/* Corner buttons, rendered right to left: menu, profile, search, location. */}
      <SiteSearch />
      <ProfileButton />
      <MegaMenu sections={menuSections} />
      <LocationSwitcher regions={locationRegions} />
      <MobileTouchReveal />
    </AuthProviders>
  );
}
