import AuthProviders from '@/components/auth/AuthProviders';
import MegaMenu from '@/components/MegaMenu';
import MobileTouchReveal from '@/components/MobileTouchReveal';
import ProfileButton from '@/components/nav/ProfileButton';
import SiteSearch from '@/components/search/SiteSearch';
import { fetchMenuSections } from '@/services/menuApi';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // MegaMenu is a client component, so the taxonomy is read here and passed down.
  // `fetchMenuSections` is cached per render pass, so the /topics pages reading it
  // too costs nothing extra.
  const menuSections = await fetchMenuSections();

  return (
    <AuthProviders>
      {children}
      {/* Corner buttons, rendered right to left: menu, profile, search. */}
      <SiteSearch />
      <ProfileButton />
      <MegaMenu sections={menuSections} />
      <MobileTouchReveal />
    </AuthProviders>
  );
}
