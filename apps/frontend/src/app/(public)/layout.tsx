import MegaMenu from '@/components/MegaMenu';
import MobileTouchReveal from '@/components/MobileTouchReveal';
import SiteSearch from '@/components/search/SiteSearch';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <SiteSearch />
      <MegaMenu />
      <MobileTouchReveal />
    </>
  );
}
