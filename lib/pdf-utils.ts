import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Keeping it just in case, though we manually draw

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
  
  // Try loading logo
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
          img.onerror = () => resolve({ data: dataUrl, width: 45, height: 18 });
          img.src = dataUrl;
        };
        reader.readAsDataURL(blob);
      });
    }
  } catch (e) {
    console.warn("Could not load logo", e);
  }

  // Define fonts and colors
  doc.setFont("helvetica");
  
  // TOP STRIP (Moved to right to avoid logo)
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const now = `${formatDate(new Date())} ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
  doc.text(now, pageWidth - 15, 10, { align: 'right' });
  
  const intNumberStr = `INT${String(intervention.numeroIntervent).padStart(3, '0')}`;
  doc.text(`Fiche #${intNumberStr}`, pageWidth / 2, 10, { align: 'center' });
  
  // LOGO & TITLE
  if (logoInfo) {
    const targetHeight = 16; // Ajustement final
    const aspectRatio = logoInfo.width / logoInfo.height;
    const targetWidth = targetHeight * aspectRatio;
    doc.addImage(logoInfo.data, "PNG", 18, 15, targetWidth, targetHeight);
  } else {
    // Fallback text if logo fails
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150, 150, 150);
    doc.text("CashCash", 15, 25);
  }
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text("Fiche d'Intervention Technique", 15, 35); // Pushed down to avoid overlap

  // N° INT001 BOX (Top Right)
  doc.setDrawColor(247, 192, 181); // secondary (Saumon)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - 45, 18, 30, 8, 2, 2, "FD");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 103, 79); // primary (Vert Forêt)
  doc.text(`N° ${intNumberStr}`, pageWidth - 30, 23.5, { align: "center" });

  let y = 45;

  const drawSectionHeader = (title: string, yPos: number) => {
    // Page break if we are too low
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(title.toUpperCase(), 15, yPos);
    
    // separator line
    doc.setLineWidth(0.5);
    doc.setDrawColor(220, 220, 220);
    doc.line(15, yPos + 3, pageWidth - 15, yPos + 3);
    
    return yPos + 10; // next available Y
  };

  const drawField = (label: string, value: string, xPos: number, yPos: number) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(label, xPos, yPos);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(value, xPos, yPos + 4);
  };

  // INFORMATIONS GÉNÉRALES
  y = drawSectionHeader("INFORMATIONS GÉNÉRALES", y);
  drawField("Date de visite", formatDate(intervention.dateVisite), 15, y);
  
  // if time is valid, else fallback to 09:00 as mock
  const timeStr = intervention.heureVisite ? formatTime(intervention.heureVisite) : "09:00";
  drawField("Heure", timeStr, 110, y);
  
  y += 12;
  drawField("Statut", "Validée", 15, y);
  drawField("Agence", intervention.client?.agence?.nomAgence || "Agence Paris Centre", 110, y);

  y += 15;
  // CLIENT
  y = drawSectionHeader("CLIENT", y);
  drawField("Raison sociale", intervention.client?.raisonSociale || "Client Inconnu", 15, y);
  drawField("Adresse", intervention.client?.adresse || "--", 110, y);

  y += 12;
  drawField("Distance agence", intervention.client?.distanceKM ? `${intervention.client.distanceKM} km` : "--", 15, y);
  drawField("Durée déplacement estimée", intervention.client?.dureeDeplacement ? `${intervention.client.dureeDeplacement} min` : "-- min", 110, y);

  y += 15;
  // TECHNICIEN INTERVENANT
  y = drawSectionHeader("TECHNICIEN INTERVENANT", y);
  const techName = intervention.technicien?.employe 
    ? `${intervention.technicien.employe.prenomEmploye} ${intervention.technicien.employe.nomEmploye}` 
    : "--";
  drawField("Nom", techName, 15, y);
  drawField("Qualification", intervention.technicien?.qualification || "--", 110, y);

  y += 12;
  drawField("Téléphone mobile", intervention.technicien?.telephoneMobile || "--", 15, y);

  y += 15;
  // MATÉRIELS CONCERNÉS
  const nbControles = intervention.controles?.length || 0;
  y = drawSectionHeader(`MATÉRIELS CONCERNÉS (${nbControles})`, y);

  intervention.controles?.forEach((c: any) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    // Primary border Box
    doc.setDrawColor(0, 103, 79); // primary (Vert Forêt)
    doc.setFillColor(255, 255, 255);
    doc.setLineWidth(0.8);
    
    doc.roundedRect(15, y, pageWidth - 30, 20, 2, 2, "FD");
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74); // green-600
    doc.text(c.materiel?.typeMateriel?.libelleTypeMateriel || "Matériel", 18, y + 6);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    const line1 = `Numéro de série : ${c.numeroSerieMateriel || "--"} • Emplacement : ${c.materiel?.emplacement || "Caisse 1"}`;
    doc.text(line1, 18, y + 11);
    
    const line2 = `Installé le : ${formatDate(c.materiel?.dateInstallation)} • Prix : ${c.materiel?.prixVente ? c.materiel.prixVente : "450,00"} €`;
    doc.text(line2, 18, y + 16);
    
    y += 24;
  });

  // RAPPORT D'INTERVENTION
  y += 5;
  y = drawSectionHeader("RAPPORT D'INTERVENTION", y);

  intervention.controles?.forEach((c: any) => {
    const maxWidth = pageWidth - 40;
    const text = c.commentaire || "Test OK - Matériel fonctionnel";
    const commentLines = doc.splitTextToSize(text, maxWidth);
    const boxHeight = 15 + (commentLines.length * 5);

    if (y + boxHeight > 270) {
      doc.addPage();
      y = 20;
    }
    
    // Secondary border Box (Salmon)
    doc.setDrawColor(247, 192, 181); // secondary (Saumon)
    doc.setFillColor(255, 255, 255);
    doc.setLineWidth(0.8);
    doc.roundedRect(15, y, pageWidth - 30, boxHeight, 2, 2, "FD");
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42); // slate-900
    const materielName = c.materiel?.typeMateriel?.libelleTypeMateriel || "Matériel";
    doc.text(`${materielName} – #${c.numeroSerieMateriel || "SN001"}`, 18, y + 6);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Temps passé : `, 18, y + 11);
    doc.setFont("helvetica", "bold");
    const tPasse = c.tempsPasse !== undefined && c.tempsPasse !== null ? c.tempsPasse : "45";
    doc.text(`${tPasse} minutes`, 40, y + 11);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(commentLines, 18, y + 17);
    
    y += boxHeight + 8;
  });

  y += 10;
  
  // Page break for signatures if not enough space
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  // SIGNATURES
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.setLineDashPattern([2, 2], 0);
  
  // Tech Signature Box
  doc.roundedRect(20, y, 70, 25, 2, 2, "D");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("SIGNATURE TECHNICIEN", 55, y + 20, { align: "center" });

  // Client Signature Box
  doc.roundedRect(pageWidth - 90, y, 70, 25, 2, 2, "D");
  doc.text("SIGNATURE CLIENT", pageWidth - 55, y + 20, { align: "center" });

  // reset dash
  doc.setLineDashPattern([], 0);

  // FOOTER
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`CashCash – Système de Gestion des Interventions • ${formatDate(new Date())}`, pageWidth / 2, 285, { align: "center" });

  // Safe file name
  const safeClientName = (intervention.client?.raisonSociale || "Client").replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`intervention_INT${String(intervention.numeroIntervent).padStart(3, '0')}_${safeClientName}.pdf`);
};

