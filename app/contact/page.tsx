import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'équipe Ghostech pour parler de vos projets, d'un partenariat ou de nos activités.",
};

export default function ContactPage() {
  return <ContactForm />;
}
