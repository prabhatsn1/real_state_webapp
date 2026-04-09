import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/data";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { brand, navigation, footer } = getSiteContent();

  return (
    <>
      <NavBar navItems={navigation} brandName={brand.name} />
      <main>{children}</main>
      <Footer footer={footer} brand={brand} />
    </>
  );
}
