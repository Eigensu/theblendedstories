import MegaMenu from '@/components/MegaMenu';
import MobileTouchReveal from '@/components/MobileTouchReveal';
import ProfileButton from '@/components/nav/ProfileButton';
import SiteSearch from '@/components/search/SiteSearch';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* Corner buttons, rendered right to left: menu, profile, search. */}
      <SiteSearch />
      <ProfileButton />
      <MegaMenu />
      <MobileTouchReveal />
    </>
  );
}
