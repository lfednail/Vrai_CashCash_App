
"use client";

import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { generateAgencyActivityReportPDF } from "@/lib/pdf-utils";

export default function DownloadActivityReportButton({ agence, stats, technicians }: { agence: any, stats: any, technicians: any[] }) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            await generateAgencyActivityReportPDF(agence, stats, technicians);
        } catch (error) {
            console.error("PDF generation failed", error);
            alert("Erreur lors de la génération du PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleDownload}
            disabled={loading}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            Rapport d'Activité (PDF)
        </button>
    );
}
