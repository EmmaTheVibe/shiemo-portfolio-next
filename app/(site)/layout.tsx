import { Footer } from "@/lib/components/Footer";
import { SiteChrome } from "@/lib/components/SiteChrome";
import { IntroCompleteProvider } from "@/lib/context/IntroCompleteContext";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <IntroCompleteProvider>
      <SiteChrome />
      <main>{children}</main>
      <Footer />
    </IntroCompleteProvider>
  );
}
