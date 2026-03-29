"use client";

import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { generateInterventionPDF } from "@/lib/pdf-utils";

export default function DownloadPDFButton({ intervention, className }: { intervention: any, className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await generateInterventionPDF(intervention);
    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("Erreur lors de la génération du PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={loading}
      className={className || "flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg transition-all disabled:opacity-50"}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
      {loading ? "Génération..." : "Télécharger le PDF"}
    </button>
  );
}
