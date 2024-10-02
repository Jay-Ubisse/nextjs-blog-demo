import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const PagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen text-primary">
      <Header />
      <main className="flex flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PagesLayout;
