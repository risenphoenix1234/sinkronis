// src/app/contact/page.tsx
import { Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={null}>
        <ContactForm />
      </Suspense>
      <Footer />
    </main>
  );
}