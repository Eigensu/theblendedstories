import MegaMenu from '@/components/MegaMenu';
import MobileTouchReveal from '@/components/MobileTouchReveal';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <MegaMenu />
      <MobileTouchReveal />
    </>
  );
}
