import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Keeping it just in case, though we manually draw

import { getSession } from "next-auth/react";

// Utils to format date
const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return "--";
  const d = new Date(dateString);
  return d.toLocaleDateString("fr-FR");
};

const formatTime = (timeString: string | Date | undefined) => {
  if (!timeString) return "--";
  const d = new Date(timeString);
  const val = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (val === "00:00" || val === "12:00 AM") return "--"; // naive fallback
  return val;
};

export const generateInterventionPDF = async (intervention: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const primaryColor: [number, number, number] = [0, 103, 79]; // CashCash Green #00674f
  const textColor: [number, number, number] = [30, 41, 59]; // Slate 800
  const lightTextColor: [number, number, number] = [100, 116, 139]; // Slate 500

  // --- 1. Load Logo ---
  let logoInfo: { data: string; width: number; height: number } | null = null;
  try {
    const res = await fetch("/images/cashcash-logov2.png");
    if (res.ok) {
      const blob = await res.blob();
      logoInfo = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          const img = new Image();
          img.onload = () => resolve({ data: dataUrl, width: img.width, height: img.height });
          img.src = dataUrl;
        };
        reader.readAsDataURL(blob);
      });
    }
  } catch (e) {
    console.warn("Logo load failed", e);
  }

  // --- 2. Professional Header ---
  // Background accent for header
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.rect(0, 0, pageWidth, 45, "F");
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.line(0, 45, pageWidth, 45);

  if (logoInfo) {
    const h = 18;
    const w = (logoInfo.width / logoInfo.height) * h;
    doc.addImage(logoInfo.data, "PNG", 20, 12, w, h);
  } else {
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("CashCash", 20, 25);
  }

  // Company Info (Left)
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightTextColor);
  doc.text("Maintenance & Solutions", 20, 35);
  doc.text("123 Rue de la Technologie, 75008 Paris", 20, 39);

  // Document Info (Right)
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text("BON D'INTERVENTION", pageWidth - 20, 22, { align: "right" });

  const intNumberStr = `INT-${String(intervention.numeroIntervent).padStart(5, '0')}`;
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text(intNumberStr, pageWidth - 20, 30, { align: "right" });

  doc.setFontSize(9);
  doc.setTextColor(...lightTextColor);
  doc.setFont("helvetica", "normal");
  doc.text(`Date d'émission : ${formatDate(new Date())}`, pageWidth - 20, 36, { align: "right" });

  let y = 60;

  // --- 3. Client & Technician Blocks ---
  const drawInfoBox = (title: string, x: number, yPos: number, w: number, content: string[]) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...lightTextColor);
    doc.text(title.toUpperCase(), x, yPos);
    
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, yPos + 2, w, 32, 2, 2, "FD");
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    content.forEach((line, i) => {
      doc.text(line, x + 5, yPos + 10 + (i * 5));
    });
  };

  const clientLines = [
    intervention.client?.raisonSociale || "Client Inconnu",
    intervention.client?.adresse || "Adresse non renseignée",
    `SIREN : ${intervention.client?.siren || "--"}`,
    `Tél : ${intervention.client?.telephoneClient || "--"}`
  ];

  const session = await getSession();

  const tech = intervention.technicien;
  const employe = tech?.employe;
  const client = intervention.client;
  
  const techName = employe 
    ? `${employe.prenomEmploye} ${employe.nomEmploye}` 
    : (session?.user?.name || "Technicien CashCash");

  const agencyName = tech?.employe?.agence?.nomAgence || 
                    client?.agence?.nomAgence || 
                    "Agence CashCash";

  const techLines = [
    techName,
    `Qualif : ${tech?.qualification || "Technicien de maintenance"}`,
    `Mobile : ${tech?.telephoneMobile || "--"}`,
    `Agence : ${agencyName}`
  ];

  drawInfoBox("Informations Client", 20, y, (pageWidth / 2) - 25, clientLines);
  drawInfoBox("Technicien Intervenant", (pageWidth / 2) + 5, y, (pageWidth / 2) - 25, techLines);

  y += 45;

  // --- 4. Mission Details ---
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text("DÉTAILS DE LA MISSION", 20, y);
  
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, y + 2, pageWidth - 20, y + 2);

  y += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightTextColor);
  doc.text("Date de réalisation :", 20, y);
  doc.text("Heure de passage :", 80, y);
  doc.text("Type d'intervention :", 140, y);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text(formatDate(intervention.dateVisite), 20, y + 5);
  doc.text(intervention.heureVisite ? formatTime(intervention.heureVisite) : "09:00", 80, y + 5);
  doc.text("Maintenance Curative", 140, y + 5);

  y += 20;

  // --- 5. Controls Table (Report) ---
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text("RAPPORT D'INTERVENTION ET CONTRÔLES", 20, y);

  const tableData = (intervention.controles || []).map((c: any) => [
    c.materiel?.typeMateriel?.libelleTypeMateriel || "Matériel",
    c.numeroSerieMateriel || "--",
    `${c.tempsPasse ?? 0} min`,
    c.commentaire || "Vérification standard effectuée."
  ]);

  autoTable(doc, {
    startY: y + 4,
    head: [["Désignation Matériel", "N° de Série", "Durée", "Observations / Travaux effectués"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: primaryColor, fontSize: 9, fontStyle: "bold" },
    bodyStyles: { fontSize: 8, textColor: textColor },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 35 },
      2: { cellWidth: 20 },
      3: { cellWidth: "auto" }
    },
    margin: { left: 20, right: 20 }
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // Check for page overflow
  if (y > pageHeight - 60) {
    doc.addPage();
    y = 30;
  }

  // --- 6. Signatures Section ---
  const sigY = y;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text("SIGNATURES ET VALIDATION", 20, sigY);
  doc.line(20, sigY + 2, pageWidth - 20, sigY + 2);

  y += 10;
  
  // Technician Sig
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...lightTextColor);
  doc.text("LE TECHNICIEN", 40, y, { align: "center" });
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.roundedRect(20, y + 3, 50, 25, 2, 2, "D");
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.text("Cachet et signature", 45, y + 25, { align: "center" });

  // Client Sig
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("LE CLIENT (Bon pour accord)", pageWidth - 50, y, { align: "center" });
  doc.roundedRect(pageWidth - 70, y + 3, 50, 25, 2, 2, "D");
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.text("Nom, Prénom et Signature", pageWidth - 45, y + 25, { align: "center" });

  // --- 7. Footer ---
  const footerY = pageHeight - 15;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightTextColor);
  doc.text("CashCash Services - RCS Paris B 123 456 789 - TVA Intracom. FR 12 345 678 901", pageWidth / 2, footerY, { align: "center" });
  doc.text(`Document généré électroniquement le ${formatDate(new Date())} - Page 1/1`, pageWidth / 2, footerY + 4, { align: "center" });

  // Save
  const fileName = `Intervention_${intNumberStr}_${(intervention.client?.raisonSociale || "Client").replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};

export const generateAgencyActivityReportPDF = async (agence: any, stats: any, technicians: any[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const primaryColor: [number, number, number] = [0, 103, 79]; // CashCash Green
    const textColor: [number, number, number] = [30, 41, 59];
    
    // Header
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setDrawColor(226, 232, 240);
    doc.line(0, 40, pageWidth, 40);
    
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("RAPPORT D'ACTIVITÉ MENSUEL", 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(`Agence : ${agence.nomAgence}`, 20, 33);
    doc.text(`Généré le : ${new Date().toLocaleDateString("fr-FR")}`, pageWidth - 20, 33, { align: "right" });
    
    let y = 60;
    
    // Section 1: Statistiques Clés
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textColor);
    doc.text("1. RÉSUMÉ DES PERFORMANCES", 20, y);
    doc.line(20, y + 2, 100, y + 2);
    
    y += 15;
    const statsData = [
        ["Indicateur", "Valeur"],
        ["Total Interventions", `${stats.total_interventions}`],
        ["Distance Parcourue", `${stats.distance_parcourue_km} km`],
        ["Temps de Maintenance", `${Math.floor(stats.temps_total_minutes / 60)}h ${stats.temps_total_minutes % 60}m`],
        ["Clients Actifs", `${agence.clients.length}`]
    ];
    
    autoTable(doc, {
        startY: y,
        head: [statsData[0]],
        body: statsData.slice(1),
        theme: "striped",
        headStyles: { fillColor: primaryColor },
        margin: { left: 20 }
    });
    
    y = (doc as any).lastAutoTable.finalY + 20;
    
    // Section 2: Équipe Technicienne
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("2. EFFECTIFS ET DISPONIBILITÉ", 20, y);
    doc.line(20, y + 2, 100, y + 2);
    
    y += 15;
    const techData = technicians.map(t => [
        `${t.employe.prenomEmploye} ${t.employe.nomEmploye}`,
        t.qualification,
        t.matricule
    ]);
    
    autoTable(doc, {
        startY: y,
        head: [["Nom du Technicien", "Qualification", "Matricule"]],
        body: techData,
        theme: "grid",
        headStyles: { fillColor: [51, 65, 85] },
        margin: { left: 20 }
    });
    
    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("CashCash Agence - Rapport Confidentiel - © 2026", pageWidth / 2, pageHeight - 10, { align: "center" });
    
    doc.save(`Rapport_Activite_${agence.nomAgence.replace(/\s+/g, '_')}_${new Date().getMonth() + 1}.pdf`);
};

