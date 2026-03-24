import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInterventionPDF = (intervention: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(37, 99, 235); // Blue 600
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("CASHCASH", 20, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("FICHE D'INTERVENTION TECHNIQUE", 20, 32);
  
  doc.text(`Rapport #${intervention.numeroIntervent}`, pageWidth - 20, 25, { align: "right" });
  doc.text(new Date().toLocaleDateString("fr-FR"), pageWidth - 20, 32, { align: "right" });

  // Client Info
  doc.setTextColor(64, 64, 64);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT", 20, 55);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text([
    intervention.client.raisonSociale,
    intervention.client.adresse,
    `SIREN: ${intervention.client.siren}`,
    `Email: ${intervention.client.email}`
  ], 20, 62);

  // Technician Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TECHNICIEN", pageWidth / 2, 55);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text([
    `${intervention.technicien.employe.prenomEmploye} ${intervention.technicien.employe.nomEmploye}`,
    `Matricule: ${intervention.technicien.matricule}`,
    `Qualification: ${intervention.technicien.qualification}`
  ], pageWidth / 2, 62);

  // Intervention Details Table
  autoTable(doc, {
    startY: 85,
    head: [["Matériel", "N° Série", "Emplacement", "Temps (min)", "Commentaire"]],
    body: intervention.controles.map((c: any) => [
      c.materiel.typeMateriel.libelleTypeMateriel,
      c.numeroSerieMateriel,
      c.materiel.emplacement,
      c.tempsPasse || "N/A",
      c.commentaire || "R.A.S"
    ]),
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 20, right: 20 }
  });

  // Footer / Signature
  const finalY = (doc as any).lastAutoTable.finalY + 30;
  
  doc.setDrawColor(226, 232, 240);
  doc.line(20, finalY, 80, finalY);
  doc.line(pageWidth - 80, finalY, pageWidth - 20, finalY);
  
  doc.setFontSize(8);
  doc.text("Signature Client", 20, finalY + 5);
  doc.text("Signature Technicien", pageWidth - 20, finalY + 5, { align: "right" });

  doc.save(`intervention_${intervention.numeroIntervent}_${intervention.client.raisonSociale.replace(/\s+/g, "_")}.pdf`);
};
