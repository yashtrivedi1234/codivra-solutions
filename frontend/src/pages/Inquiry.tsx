import { Header } from "@/components/Header";
import { Inquiry as InquirySection } from "@/components/Inquiry";
import { Footer } from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const Inquiry = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <PageBreadcrumb />
        <InquirySection />
      </main>
      <Footer />
    </div>
  );
};

export default Inquiry;

