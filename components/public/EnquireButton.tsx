"use client";

import { useState } from "react";
import EnquiryModal from "./EnquiryModal";

interface Props {
  productName: string;
  productSku: string;
}

export default function EnquireButton({ productName, productSku }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full border-2 border-[#1a1a1a] bg-[#1a1a1a] text-white py-4 text-xs uppercase tracking-widest hover:bg-[#b5964e] hover:border-[#b5964e] transition-colors"
      >
        Enquire About This Item
      </button>
      <EnquiryModal
        isOpen={open}
        onClose={() => setOpen(false)}
        productName={productName}
        productSku={productSku}
      />
    </>
  );
}
