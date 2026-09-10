import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Spazio team. We'd love to hear from you.",
};

export default async function ContactPage() {
  const settings = await prisma.siteSetting.findMany();
  const get = (key: string) => settings.find((s) => s.key === key)?.value ?? "";

  const address = get("address");
  const phone = get("phone");
  const email = get("email");
  const hours = get("hours");

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-14 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b5964e] mb-3">Get in Touch</p>
        <h1
          className="text-4xl md:text-5xl font-semibold text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Contact Us
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left: Info */}
        <div className="space-y-8">
          {address && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#b5964e] mb-2">Address</h3>
              <p className="text-[#1a1a1a] text-sm whitespace-pre-line">{address}</p>
            </div>
          )}
          {phone && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#b5964e] mb-2">Phone</h3>
              <a href={`tel:${phone}`} className="text-[#1a1a1a] text-sm hover:text-[#b5964e] transition-colors">{phone}</a>
            </div>
          )}
          {email && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#b5964e] mb-2">Email</h3>
              <a href={`mailto:${email}`} className="text-[#1a1a1a] text-sm hover:text-[#b5964e] transition-colors">{email}</a>
            </div>
          )}
          {hours && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#b5964e] mb-2">Showroom Hours</h3>
              <p className="text-[#1a1a1a] text-sm whitespace-pre-line">{hours}</p>
            </div>
          )}

          <div className="border-t border-[#e0d9cc] pt-8">
            <h3 className="text-xs uppercase tracking-widest text-[#b5964e] mb-3">Trade Enquiries</h3>
            <p className="text-sm text-[#6b6b6b]">
              Interior designers and trade professionals are welcome. Please mention your business in the message field and our trade team will be in touch.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
