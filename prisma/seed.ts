import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  console.log('Clearing database...');
  await prisma.controler.deleteMany();
  await prisma.intervention.deleteMany();
  await prisma.materiel.deleteMany();
  await prisma.contratMaintenance.deleteMany();
  await prisma.typeContrat.deleteMany();
  await prisma.typeMateriel.deleteMany();
  await prisma.famille.deleteMany();
  await prisma.client.deleteMany();
  await prisma.technicien.deleteMany();
  await prisma.employe.deleteMany();
  await prisma.agence.deleteMany();

  console.log('Seeding agencies...');
  const agencies = [
    { id: 1, nom: 'Agence Paris Île-de-France', adr: '12 Rue de la Paix, 75001 Paris', tel: '0123456789' },
    { id: 2, nom: 'Agence Lyon Rhône-Alpes',    adr: '45 Rue de la République, 69002 Lyon', tel: '0456789123' },
    { id: 3, nom: 'Agence Marseille PACA',       adr: '22 Quai des Belges, 13001 Marseille', tel: '0491001122' },
  ];
  for (const a of agencies) {
    await prisma.agence.create({
      data: { numeroAgence: a.id, nomAgence: a.nom, adresseAgence: a.adr, telephoneAgence: a.tel },
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Types de contrat
  // ─────────────────────────────────────────────────────────────
  console.log('Seeding contract types...');
  await prisma.typeContrat.createMany({
    data: [
      { refTypeContrat: 'GOLD',     delaiIntervention: 2,  tauxApplicable: 2.00 },
      { refTypeContrat: 'PREMIUM',  delaiIntervention: 4,  tauxApplicable: 1.50 },
      { refTypeContrat: 'STANDARD', delaiIntervention: 24, tauxApplicable: 1.00 },
      { refTypeContrat: 'BASIC',    delaiIntervention: 48, tauxApplicable: 0.80 },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // Familles
  // ─────────────────────────────────────────────────────────────
  console.log('Seeding families...');
  await prisma.famille.createMany({
    data: [
      { codeFamille: 'POM', libelleFamille: 'Postes de vente' },
      { codeFamille: 'MON', libelleFamille: 'Monétique' },
      { codeFamille: 'ADR', libelleFamille: 'Acquisition de données' },
      { codeFamille: 'ACC', libelleFamille: 'Accessoires' },
    ],
  });

  // ─────────────────────────────────────────────────────────────
  // Types de matériel
  // ─────────────────────────────────────────────────────────────
  console.log('Seeding material types...');
  const materialTypes = [
    { ref: 'TM-CAISSE',    label: 'Caisse Enregistreuse Tactile', fam: 'POM' },
    { ref: 'TM-TPE',       label: 'Terminal de Paiement Électronique', fam: 'MON' },
    { ref: 'TM-IMPRIMANTE',label: 'Imprimante Ticket Thermique', fam: 'ACC' },
    { ref: 'TM-SCANNER',   label: 'Scanner Code-Barre 2D', fam: 'ADR' },
    { ref: 'TM-ECRAN',     label: 'Écran Client Orientable', fam: 'ACC' },
    { ref: 'TM-TIROIR',    label: 'Tiroir-Caisse Motorisé', fam: 'ACC' },
    { ref: 'TM-MOBILE',    label: 'Terminal Mobile Android', fam: 'POM' },
  ];
  for (const mt of materialTypes) {
    await prisma.typeMateriel.create({ data: { referenceInterne: mt.ref, libelleTypeMateriel: mt.label, codeFamille: mt.fam } });
  }

  // ─────────────────────────────────────────────────────────────
  // Employés par agence
  // ─────────────────────────────────────────────────────────────
  console.log('Seeding employees...');

  type Employee = {
    matricule: string;
    nom: string;
    prenom: string;
    email: string;
    role: 'GESTIONNAIRE' | 'TECHNICIEN';
    agenceId: number;
    tech?: { mobile: string; qualif: string };
  };

  const employees: Employee[] = [
    // ── Agence 1 (Paris) ──────────────────────────────────────
    { matricule: 'GEST001', nom: 'Dupont',    prenom: 'Jean',     email: 'jean.dupont@cashcash.fr',         role: 'GESTIONNAIRE', agenceId: 1 },
    { matricule: 'TECH001', nom: 'Martin',    prenom: 'Luc',      email: 'luc.martin@cashcash.fr',          role: 'TECHNICIEN',   agenceId: 1, tech: { mobile: '0612345678', qualif: 'Expert Réseaux & Caisses' } },
    { matricule: 'TECH002', nom: 'Bernard',   prenom: 'Claire',   email: 'claire.bernard@cashcash.fr',      role: 'TECHNICIEN',   agenceId: 1, tech: { mobile: '0698761111', qualif: 'Technicien TPE & Monétique' } },
    { matricule: 'TECH003', nom: 'Moreau',    prenom: 'Pierre',   email: 'pierre.moreau@cashcash.fr',       role: 'TECHNICIEN',   agenceId: 1, tech: { mobile: '0655443322', qualif: 'Maintenicien Logiciel Caisse' } },
    { matricule: 'TECH004', nom: 'Rousseau',  prenom: 'Élodie',   email: 'eleodie.rousseau@cashcash.fr',    role: 'TECHNICIEN',   agenceId: 1, tech: { mobile: '0677889900', qualif: 'Technicien Matériel Périphérique' } },
    { matricule: 'TECH005', nom: 'Leroy',     prenom: 'Antoine',  email: 'antoine.leroy@cashcash.fr',       role: 'TECHNICIEN',   agenceId: 1, tech: { mobile: '0611223344', qualif: 'Intégrateur Systèmes Point de Vente' } },

    // ── Agence 2 (Lyon) ───────────────────────────────────────
    { matricule: 'GEST002', nom: 'Lecorp',    prenom: 'Bastien',  email: 'bastien.lecorp@cashcash.fr',      role: 'GESTIONNAIRE', agenceId: 2 },
    { matricule: 'TECH006', nom: 'Lefebvre',  prenom: 'Sophie',   email: 'sophie.lefebvre@cashcash.fr',     role: 'TECHNICIEN',   agenceId: 2, tech: { mobile: '0698765432', qualif: 'Technicien Support Niveau 2' } },
    { matricule: 'TECH007', nom: 'Girard',    prenom: 'Nicolas',  email: 'nicolas.girard@cashcash.fr',      role: 'TECHNICIEN',   agenceId: 2, tech: { mobile: '0644556677', qualif: 'Expert TPE & Sécurité' } },
    { matricule: 'TECH008', nom: 'Simon',     prenom: 'Aurélie',  email: 'aurelie.simon@cashcash.fr',       role: 'TECHNICIEN',   agenceId: 2, tech: { mobile: '0633445566', qualif: 'Technicien Caisse & Réseau' } },
    { matricule: 'TECH009', nom: 'Laurent',   prenom: 'Hugo',     email: 'hugo.laurent@cashcash.fr',        role: 'TECHNICIEN',   agenceId: 2, tech: { mobile: '0622334455', qualif: 'Intégrateur Solutions Cloud' } },
    { matricule: 'TECH010', nom: 'Michel',    prenom: 'Camille',  email: 'camille.michel@cashcash.fr',      role: 'TECHNICIEN',   agenceId: 2, tech: { mobile: '0611223355', qualif: 'Technicien Mobilité & Terminaux' } },

    // ── Agence 3 (Marseille) ──────────────────────────────────
    { matricule: 'GEST003', nom: 'Fabre',     prenom: 'Isabelle', email: 'isabelle.fabre@cashcash.fr',      role: 'GESTIONNAIRE', agenceId: 3 },
    { matricule: 'TECH011', nom: 'Garcia',    prenom: 'Manuel',   email: 'manuel.garcia@cashcash.fr',       role: 'TECHNICIEN',   agenceId: 3, tech: { mobile: '0688991100', qualif: 'Expert Caisse & Périphériques' } },
    { matricule: 'TECH012', nom: 'Blanc',     prenom: 'Julie',    email: 'julie.blanc@cashcash.fr',         role: 'TECHNICIEN',   agenceId: 3, tech: { mobile: '0677881100', qualif: 'Technicien Réseau & Wifi' } },
    { matricule: 'TECH013', nom: 'Thomas',    prenom: 'Kevin',    email: 'kevin.thomas@cashcash.fr',        role: 'TECHNICIEN',   agenceId: 3, tech: { mobile: '0666778899', qualif: 'Technicien TPE & POS' } },
    { matricule: 'TECH014', nom: 'Robert',    prenom: 'Laure',    email: 'laure.robert@cashcash.fr',        role: 'TECHNICIEN',   agenceId: 3, tech: { mobile: '0655667788', qualif: 'Ingénieure Systèmes Embarqués' } },
    { matricule: 'TECH015', nom: 'Petit',     prenom: 'Sébastien',email: 'sebastien.petit@cashcash.fr',     role: 'TECHNICIEN',   agenceId: 3, tech: { mobile: '0644556688', qualif: 'Maintenicien Matériel Avancé' } },
  ];

  for (const emp of employees) {
    await prisma.employe.create({
      data: {
        matricule:     emp.matricule,
        nomEmploye:    emp.nom,
        prenomEmploye: emp.prenom,
        adresseEmploye:'123 Rue de l\'Employé, France',
        dateEmbauche:  new Date('2019-09-01'),
        email:         emp.email,
        mot_de_passe:  password,
        role:          emp.role,
        numeroAgence:  emp.agenceId,
        ...(emp.tech ? {
          technicien: {
            create: {
              telephoneMobile: emp.tech.mobile,
              qualification:   emp.tech.qualif,
              dateObtention:   new Date('2019-01-01'),
            },
          },
        } : {}),
      },
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Clients (10+ par agence) avec matériels et contrats multiples
  // ─────────────────────────────────────────────────────────────
  console.log('Seeding clients, contracts and materials...');

  type ClientDef = {
    name: string;
    siren: string;
    ape: string;
    adr: string;
    tel: string;
    agenceId: number;
    dist: number;
    duree: number;
    contracts: { typeContrat: string; signedYearsAgo: number; durationYears: number }[];
    materials: { typeMat: string; emplacement: string; prix: number; contractIndex: number }[];
  };

  const clientDefs: ClientDef[] = [
    // ═══════════════════════════════════════════
    // AGENCE 1 — Paris
    // ═══════════════════════════════════════════
    {
      name: 'Hypermarché Grande Épicerie', siren: '12345678901234', ape: '4711F',
      adr: '10 Boulevard Haussmann, 75009 Paris', tel: '0123456100', agenceId: 1, dist: 10, duree: 20,
      contracts: [
        { typeContrat: 'GOLD',    signedYearsAgo: 2, durationYears: 3 },
        { typeContrat: 'STANDARD',signedYearsAgo: 1, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',     emplacement: 'Caisse 1', prix: 2500, contractIndex: 0 },
        { typeMat: 'TM-TPE',        emplacement: 'Caisse 1', prix: 800,  contractIndex: 0 },
        { typeMat: 'TM-IMPRIMANTE', emplacement: 'Caisse 2', prix: 450,  contractIndex: 1 },
      ],
    },
    {
      name: 'Boutique Mode Élégance', siren: '98765432109876', ape: '4771Z',
      adr: '5 Rue du Faubourg Saint-Honoré, 75008 Paris', tel: '0123456101', agenceId: 1, dist: 8, duree: 15,
      contracts: [
        { typeContrat: 'PREMIUM', signedYearsAgo: 1, durationYears: 2 },
        { typeContrat: 'BASIC',   signedYearsAgo: 2, durationYears: 3 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Comptoir principal', prix: 1800, contractIndex: 0 },
        { typeMat: 'TM-SCANNER', emplacement: 'Comptoir principal', prix: 350,  contractIndex: 0 },
        { typeMat: 'TM-ECRAN',   emplacement: 'Vitrine',            prix: 600,  contractIndex: 1 },
      ],
    },
    {
      name: 'Restaurant Le Bistrot Parisien', siren: '11122233344455', ape: '5610A',
      adr: '15 Rue de Rivoli, 75004 Paris', tel: '0123456102', agenceId: 1, dist: 12, duree: 25,
      contracts: [
        { typeContrat: 'PREMIUM',  signedYearsAgo: 3, durationYears: 4 },
        { typeContrat: 'STANDARD', signedYearsAgo: 1, durationYears: 3 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',     emplacement: 'Bar',         prix: 2200, contractIndex: 0 },
        { typeMat: 'TM-TPE',        emplacement: 'Salle',       prix: 750,  contractIndex: 0 },
        { typeMat: 'TM-IMPRIMANTE', emplacement: 'Cuisine',     prix: 400,  contractIndex: 1 },
        { typeMat: 'TM-TIROIR',     emplacement: 'Bar',         prix: 300,  contractIndex: 1 },
      ],
    },
    {
      name: 'Pharmacie Centrale Paris', siren: '66677788899900', ape: '4773Z',
      adr: '42 Avenue des Champs-Élysées, 75008 Paris', tel: '0123456103', agenceId: 1, dist: 14, duree: 30,
      contracts: [
        { typeContrat: 'GOLD',    signedYearsAgo: 1, durationYears: 2 },
        { typeContrat: 'PREMIUM', signedYearsAgo: 2, durationYears: 3 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Accueil',   prix: 3000, contractIndex: 0 },
        { typeMat: 'TM-TPE',     emplacement: 'Accueil',   prix: 900,  contractIndex: 0 },
        { typeMat: 'TM-SCANNER', emplacement: 'Réserve',   prix: 400,  contractIndex: 1 },
        { typeMat: 'TM-MOBILE',  emplacement: 'Mobilité',  prix: 1100, contractIndex: 1 },
      ],
    },
    {
      name: 'Boulangerie Maison Dupain', siren: '99988877766655', ape: '1071C',
      adr: '8 Boulevard Saint-Germain, 75005 Paris', tel: '0123456104', agenceId: 1, dist: 7, duree: 15,
      contracts: [
        { typeContrat: 'STANDARD', signedYearsAgo: 2, durationYears: 3 },
        { typeContrat: 'BASIC',    signedYearsAgo: 1, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',     emplacement: 'Comptoir', prix: 1500, contractIndex: 0 },
        { typeMat: 'TM-IMPRIMANTE', emplacement: 'Comptoir', prix: 350,  contractIndex: 0 },
        { typeMat: 'TM-TIROIR',     emplacement: 'Comptoir', prix: 250,  contractIndex: 1 },
      ],
    },
    {
      name: 'Librairie Les Pages Infinies', siren: '55544433322210', ape: '4761Z',
      adr: '3 Place Saint-Michel, 75006 Paris', tel: '0123456105', agenceId: 1, dist: 9, duree: 20,
      contracts: [
        { typeContrat: 'PREMIUM',  signedYearsAgo: 1, durationYears: 3 },
        { typeContrat: 'STANDARD', signedYearsAgo: 2, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Accueil',    prix: 1700, contractIndex: 0 },
        { typeMat: 'TM-SCANNER', emplacement: 'Réserve',    prix: 300,  contractIndex: 0 },
        { typeMat: 'TM-MOBILE',  emplacement: 'Mobilité',   prix: 950,  contractIndex: 1 },
      ],
    },
    {
      name: 'Hôtel Lumière Paris', siren: '44433322211100', ape: '5511Z',
      adr: '25 Rue de la Paix, 75002 Paris', tel: '0123456106', agenceId: 1, dist: 11, duree: 25,
      contracts: [
        { typeContrat: 'GOLD',    signedYearsAgo: 1, durationYears: 3 },
        { typeContrat: 'PREMIUM', signedYearsAgo: 2, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Réception',  prix: 2800, contractIndex: 0 },
        { typeMat: 'TM-TPE',     emplacement: 'Bar',        prix: 850,  contractIndex: 0 },
        { typeMat: 'TM-ECRAN',   emplacement: 'Lobby',      prix: 700,  contractIndex: 1 },
        { typeMat: 'TM-MOBILE',  emplacement: 'Conciergerie', prix: 1200, contractIndex: 1 },
      ],
    },
    {
      name: 'Fleuriste Au Jardin Secret', siren: '33322211100990', ape: '4776Z',
      adr: '18 Rue Lepic, 75018 Paris', tel: '0123456107', agenceId: 1, dist: 15, duree: 30,
      contracts: [
        { typeContrat: 'STANDARD', signedYearsAgo: 3, durationYears: 4 },
        { typeContrat: 'BASIC',    signedYearsAgo: 1, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',     emplacement: 'Comptoir', prix: 1200, contractIndex: 0 },
        { typeMat: 'TM-IMPRIMANTE', emplacement: 'Atelier',  prix: 380,  contractIndex: 1 },
        { typeMat: 'TM-TIROIR',     emplacement: 'Comptoir', prix: 220,  contractIndex: 1 },
      ],
    },
    {
      name: 'Cybercafé TechZone', siren: '22211100998870', ape: '6201Z',
      adr: '60 Rue de Rivoli, 75001 Paris', tel: '0123456108', agenceId: 1, dist: 6, duree: 15,
      contracts: [
        { typeContrat: 'PREMIUM',  signedYearsAgo: 2, durationYears: 2 },
        { typeContrat: 'STANDARD', signedYearsAgo: 1, durationYears: 3 },
      ],
      materials: [
        { typeMat: 'TM-TPE',    emplacement: 'Caisse',   prix: 700,  contractIndex: 0 },
        { typeMat: 'TM-MOBILE', emplacement: 'Mobilité', prix: 1000, contractIndex: 0 },
        { typeMat: 'TM-CAISSE', emplacement: 'Accueil',  prix: 1600, contractIndex: 1 },
      ],
    },
    {
      name: 'Épicerie BioNature', siren: '11100998877760', ape: '4711D',
      adr: '7 Rue des Martyrs, 75009 Paris', tel: '0123456109', agenceId: 1, dist: 8, duree: 20,
      contracts: [
        { typeContrat: 'GOLD',    signedYearsAgo: 1, durationYears: 2 },
        { typeContrat: 'STANDARD', signedYearsAgo: 2, durationYears: 3 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Caisse 1', prix: 2000, contractIndex: 0 },
        { typeMat: 'TM-SCANNER', emplacement: 'Réserve',  prix: 320,  contractIndex: 0 },
        { typeMat: 'TM-TPE',     emplacement: 'Caisse 1', prix: 780,  contractIndex: 1 },
        { typeMat: 'TM-ECRAN',   emplacement: 'Accueil',  prix: 590,  contractIndex: 1 },
      ],
    },

    // ═══════════════════════════════════════════
    // AGENCE 2 — Lyon
    // ═══════════════════════════════════════════
    {
      name: 'Centre Commercial Lyon Part-Dieu', siren: '20000000000001', ape: '4719B',
      adr: '17 Rue Dr Bouchut, 69003 Lyon', tel: '0456789201', agenceId: 2, dist: 5, duree: 10,
      contracts: [
        { typeContrat: 'GOLD',    signedYearsAgo: 1, durationYears: 3 },
        { typeContrat: 'PREMIUM', signedYearsAgo: 2, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',     emplacement: 'Niveau 1 Caisse A', prix: 3500, contractIndex: 0 },
        { typeMat: 'TM-TPE',        emplacement: 'Niveau 1 Caisse A', prix: 950,  contractIndex: 0 },
        { typeMat: 'TM-IMPRIMANTE', emplacement: 'Niveau 2 Caisse B', prix: 420,  contractIndex: 1 },
        { typeMat: 'TM-ECRAN',      emplacement: 'Entrée',            prix: 680,  contractIndex: 1 },
      ],
    },
    {
      name: 'Brasserie Le Vieux Lyon', siren: '20000000000002', ape: '5610B',
      adr: '3 Rue Saint-Jean, 69005 Lyon', tel: '0456789202', agenceId: 2, dist: 8, duree: 15,
      contracts: [
        { typeContrat: 'PREMIUM',  signedYearsAgo: 2, durationYears: 3 },
        { typeContrat: 'STANDARD', signedYearsAgo: 1, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Bar',   prix: 2100, contractIndex: 0 },
        { typeMat: 'TM-TPE',     emplacement: 'Salle', prix: 780,  contractIndex: 0 },
        { typeMat: 'TM-TIROIR',  emplacement: 'Bar',   prix: 280,  contractIndex: 1 },
      ],
    },
    {
      name: 'Galerie d\'Art Lumière', siren: '20000000000003', ape: '9003A',
      adr: '10 Place Bellecour, 69002 Lyon', tel: '0456789203', agenceId: 2, dist: 6, duree: 12,
      contracts: [
        { typeContrat: 'STANDARD', signedYearsAgo: 1, durationYears: 3 },
        { typeContrat: 'BASIC',    signedYearsAgo: 2, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Accueil', prix: 1900, contractIndex: 0 },
        { typeMat: 'TM-MOBILE',  emplacement: 'Expo',    prix: 1050, contractIndex: 0 },
        { typeMat: 'TM-SCANNER', emplacement: 'Réserve', prix: 310,  contractIndex: 1 },
      ],
    },
    {
      name: 'Cinéma Les Lumières', siren: '20000000000004', ape: '5914Z',
      adr: '22 Rue de la République, 69002 Lyon', tel: '0456789204', agenceId: 2, dist: 9, duree: 18,
      contracts: [
        { typeContrat: 'GOLD',   signedYearsAgo: 1, durationYears: 2 },
        { typeContrat: 'BASIC',  signedYearsAgo: 2, durationYears: 3 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',     emplacement: 'Billetterie 1', prix: 2400, contractIndex: 0 },
        { typeMat: 'TM-IMPRIMANTE', emplacement: 'Billetterie 2', prix: 440,  contractIndex: 0 },
        { typeMat: 'TM-ECRAN',      emplacement: 'Hall',          prix: 650,  contractIndex: 1 },
        { typeMat: 'TM-TPE',        emplacement: 'Concessions',   prix: 820,  contractIndex: 1 },
      ],
    },
    {
      name: 'Garagiste Auto Rhône', siren: '20000000000005', ape: '4520A',
      adr: '55 Rue Garibaldi, 69006 Lyon', tel: '0456789205', agenceId: 2, dist: 12, duree: 25,
      contracts: [
        { typeContrat: 'PREMIUM',  signedYearsAgo: 3, durationYears: 4 },
        { typeContrat: 'STANDARD', signedYearsAgo: 1, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Accueil',  prix: 2200, contractIndex: 0 },
        { typeMat: 'TM-MOBILE',  emplacement: 'Atelier',  prix: 1100, contractIndex: 0 },
        { typeMat: 'TM-TIROIR',  emplacement: 'Accueil',  prix: 260,  contractIndex: 1 },
      ],
    },
    {
      name: 'Supermarché FreshMarket Lyon', siren: '20000000000006', ape: '4711F',
      adr: '80 Cours Lafayette, 69003 Lyon', tel: '0456789206', agenceId: 2, dist: 7, duree: 15,
      contracts: [
        { typeContrat: 'GOLD',    signedYearsAgo: 1, durationYears: 2 },
        { typeContrat: 'PREMIUM', signedYearsAgo: 2, durationYears: 3 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',     emplacement: 'Caisse 1', prix: 2700, contractIndex: 0 },
        { typeMat: 'TM-SCANNER',    emplacement: 'Caisse 1', prix: 360,  contractIndex: 0 },
        { typeMat: 'TM-TPE',        emplacement: 'Caisse 2', prix: 870,  contractIndex: 1 },
        { typeMat: 'TM-IMPRIMANTE', emplacement: 'Caisse 3', prix: 430,  contractIndex: 1 },
      ],
    },
    {
      name: 'Salon Coiffure ChicStyle', siren: '20000000000007', ape: '9602A',
      adr: '14 Rue Victor Hugo, 69002 Lyon', tel: '0456789207', agenceId: 2, dist: 6, duree: 12,
      contracts: [
        { typeContrat: 'STANDARD', signedYearsAgo: 2, durationYears: 3 },
        { typeContrat: 'BASIC',    signedYearsAgo: 1, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Accueil', prix: 1300, contractIndex: 0 },
        { typeMat: 'TM-TPE',     emplacement: 'Accueil', prix: 720,  contractIndex: 0 },
        { typeMat: 'TM-TIROIR',  emplacement: 'Comptoir',prix: 240,  contractIndex: 1 },
      ],
    },
    {
      name: 'École de Musique Harmonia', siren: '20000000000008', ape: '8552Z',
      adr: '5 Rue Sainte-Hélène, 69002 Lyon', tel: '0456789208', agenceId: 2, dist: 10, duree: 20,
      contracts: [
        { typeContrat: 'PREMIUM',  signedYearsAgo: 1, durationYears: 3 },
        { typeContrat: 'STANDARD', signedYearsAgo: 2, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Accueil',  prix: 1500, contractIndex: 0 },
        { typeMat: 'TM-MOBILE',  emplacement: 'Studio',   prix: 980,  contractIndex: 0 },
        { typeMat: 'TM-SCANNER', emplacement: 'Médiathèque', prix: 290, contractIndex: 1 },
      ],
    },
    {
      name: 'Cabinet Médical Lyon Centre', siren: '20000000000009', ape: '8621Z',
      adr: '33 Boulevard des Brotteaux, 69006 Lyon', tel: '0456789209', agenceId: 2, dist: 11, duree: 22,
      contracts: [
        { typeContrat: 'GOLD',    signedYearsAgo: 1, durationYears: 2 },
        { typeContrat: 'PREMIUM', signedYearsAgo: 2, durationYears: 3 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Accueil',   prix: 2600, contractIndex: 0 },
        { typeMat: 'TM-TPE',     emplacement: 'Accueil',   prix: 900,  contractIndex: 0 },
        { typeMat: 'TM-ECRAN',   emplacement: 'Salle att.',prix: 570,  contractIndex: 1 },
        { typeMat: 'TM-MOBILE',  emplacement: 'Mobilité',  prix: 1150, contractIndex: 1 },
      ],
    },
    {
      name: 'Fitness Club AlphaGym', siren: '20000000000010', ape: '9313Z',
      adr: '50 Rue d\'Aubigny, 69003 Lyon', tel: '0456789210', agenceId: 2, dist: 8, duree: 18,
      contracts: [
        { typeContrat: 'STANDARD', signedYearsAgo: 2, durationYears: 4 },
        { typeContrat: 'BASIC',    signedYearsAgo: 1, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',     emplacement: 'Accueil',       prix: 1800, contractIndex: 0 },
        { typeMat: 'TM-IMPRIMANTE', emplacement: 'Réception',     prix: 400,  contractIndex: 0 },
        { typeMat: 'TM-MOBILE',     emplacement: 'Vestiaires',    prix: 970,  contractIndex: 1 },
        { typeMat: 'TM-TPE',        emplacement: 'Accueil',       prix: 760,  contractIndex: 1 },
      ],
    },

    // ═══════════════════════════════════════════
    // AGENCE 3 — Marseille
    // ═══════════════════════════════════════════
    {
      name: 'Poissonnerie Le Vieux Port', siren: '30000000000001', ape: '4723Z',
      adr: '1 Quai des Belges, 13001 Marseille', tel: '0491002301', agenceId: 3, dist: 4, duree: 10,
      contracts: [
        { typeContrat: 'PREMIUM',  signedYearsAgo: 1, durationYears: 3 },
        { typeContrat: 'STANDARD', signedYearsAgo: 2, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Comptoir 1', prix: 1600, contractIndex: 0 },
        { typeMat: 'TM-TPE',     emplacement: 'Comptoir 1', prix: 740,  contractIndex: 0 },
        { typeMat: 'TM-TIROIR',  emplacement: 'Comptoir 2', prix: 230,  contractIndex: 1 },
      ],
    },
    {
      name: 'Savonnerie Marseille Tradition', siren: '30000000000002', ape: '2042Z',
      adr: '18 Rue Saint-Ferréol, 13001 Marseille', tel: '0491002302', agenceId: 3, dist: 6, duree: 12,
      contracts: [
        { typeContrat: 'GOLD',    signedYearsAgo: 1, durationYears: 2 },
        { typeContrat: 'STANDARD',signedYearsAgo: 2, durationYears: 3 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',     emplacement: 'Boutique', prix: 1900, contractIndex: 0 },
        { typeMat: 'TM-SCANNER',    emplacement: 'Réserve',  prix: 330,  contractIndex: 0 },
        { typeMat: 'TM-IMPRIMANTE', emplacement: 'Atelier',  prix: 390,  contractIndex: 1 },
      ],
    },
    {
      name: 'Hôtel Méditerranée Plage', siren: '30000000000003', ape: '5511Z',
      adr: '5 Corniche Président J.F. Kennedy, 13007 Marseille', tel: '0491002303', agenceId: 3, dist: 9, duree: 20,
      contracts: [
        { typeContrat: 'GOLD',    signedYearsAgo: 2, durationYears: 3 },
        { typeContrat: 'PREMIUM', signedYearsAgo: 1, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Réception',   prix: 2900, contractIndex: 0 },
        { typeMat: 'TM-TPE',     emplacement: 'Restaurant',  prix: 880,  contractIndex: 0 },
        { typeMat: 'TM-ECRAN',   emplacement: 'Lobby',       prix: 710,  contractIndex: 1 },
        { typeMat: 'TM-MOBILE',  emplacement: 'Piscine',     prix: 1200, contractIndex: 1 },
      ],
    },
    {
      name: 'Épicerie Fine Provençale', siren: '30000000000004', ape: '4721Z',
      adr: '22 Rue de Rome, 13001 Marseille', tel: '0491002304', agenceId: 3, dist: 7, duree: 15,
      contracts: [
        { typeContrat: 'STANDARD', signedYearsAgo: 1, durationYears: 3 },
        { typeContrat: 'BASIC',    signedYearsAgo: 2, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Comptoir', prix: 1700, contractIndex: 0 },
        { typeMat: 'TM-SCANNER', emplacement: 'Réserve',  prix: 310,  contractIndex: 0 },
        { typeMat: 'TM-TIROIR',  emplacement: 'Comptoir', prix: 215,  contractIndex: 1 },
      ],
    },
    {
      name: 'Garage Phocéen Motors', siren: '30000000000005', ape: '4520A',
      adr: '45 Boulevard Michelet, 13008 Marseille', tel: '0491002305', agenceId: 3, dist: 13, duree: 25,
      contracts: [
        { typeContrat: 'PREMIUM',  signedYearsAgo: 2, durationYears: 3 },
        { typeContrat: 'STANDARD', signedYearsAgo: 1, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Accueil',  prix: 2100, contractIndex: 0 },
        { typeMat: 'TM-MOBILE',  emplacement: 'Atelier',  prix: 1080, contractIndex: 0 },
        { typeMat: 'TM-ECRAN',   emplacement: 'Showroom', prix: 640,  contractIndex: 1 },
      ],
    },
    {
      name: 'Librairie La Canebière', siren: '30000000000006', ape: '4761Z',
      adr: '68 La Canebière, 13001 Marseille', tel: '0491002306', agenceId: 3, dist: 5, duree: 12,
      contracts: [
        { typeContrat: 'STANDARD', signedYearsAgo: 3, durationYears: 4 },
        { typeContrat: 'BASIC',    signedYearsAgo: 1, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',     emplacement: 'Caisse principale', prix: 1550, contractIndex: 0 },
        { typeMat: 'TM-SCANNER',    emplacement: 'Réserve',           prix: 295,  contractIndex: 0 },
        { typeMat: 'TM-IMPRIMANTE', emplacement: 'Accueil',           prix: 370,  contractIndex: 1 },
      ],
    },
    {
      name: 'Club Nautique Phocée', siren: '30000000000007', ape: '9312Z',
      adr: '1 Avenue Pierre Mendès France, 13233 Marseille', tel: '0491002307', agenceId: 3, dist: 11, duree: 22,
      contracts: [
        { typeContrat: 'GOLD',    signedYearsAgo: 1, durationYears: 2 },
        { typeContrat: 'PREMIUM', signedYearsAgo: 2, durationYears: 3 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Accueil',    prix: 2000, contractIndex: 0 },
        { typeMat: 'TM-TPE',     emplacement: 'Bar',        prix: 800,  contractIndex: 0 },
        { typeMat: 'TM-MOBILE',  emplacement: 'Mobilité',   prix: 1050, contractIndex: 1 },
        { typeMat: 'TM-TIROIR',  emplacement: 'Accueil',    prix: 245,  contractIndex: 1 },
      ],
    },
    {
      name: 'Pharmacie des Catalans', siren: '30000000000008', ape: '4773Z',
      adr: '30 Rue des Catalans, 13007 Marseille', tel: '0491002308', agenceId: 3, dist: 8, duree: 18,
      contracts: [
        { typeContrat: 'PREMIUM',  signedYearsAgo: 1, durationYears: 3 },
        { typeContrat: 'STANDARD', signedYearsAgo: 2, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',  emplacement: 'Accueil',  prix: 2800, contractIndex: 0 },
        { typeMat: 'TM-TPE',     emplacement: 'Accueil',  prix: 860,  contractIndex: 0 },
        { typeMat: 'TM-SCANNER', emplacement: 'Réserve',  prix: 340,  contractIndex: 1 },
        { typeMat: 'TM-MOBILE',  emplacement: 'Mobilité', prix: 1080, contractIndex: 1 },
      ],
    },
    {
      name: 'Restaurant Bouillabaisse & Co', siren: '30000000000009', ape: '5610A',
      adr: '19 Rue Fort Notre-Dame, 13007 Marseille', tel: '0491002309', agenceId: 3, dist: 10, duree: 20,
      contracts: [
        { typeContrat: 'GOLD',    signedYearsAgo: 1, durationYears: 2 },
        { typeContrat: 'STANDARD',signedYearsAgo: 2, durationYears: 3 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',     emplacement: 'Bar',     prix: 2300, contractIndex: 0 },
        { typeMat: 'TM-TPE',        emplacement: 'Salle',   prix: 810,  contractIndex: 0 },
        { typeMat: 'TM-IMPRIMANTE', emplacement: 'Cuisine', prix: 410,  contractIndex: 1 },
      ],
    },
    {
      name: 'Supermarché Mistral Market', siren: '30000000000010', ape: '4711F',
      adr: '100 Avenue du Prado, 13008 Marseille', tel: '0491002310', agenceId: 3, dist: 14, duree: 28,
      contracts: [
        { typeContrat: 'GOLD',    signedYearsAgo: 2, durationYears: 3 },
        { typeContrat: 'PREMIUM', signedYearsAgo: 1, durationYears: 2 },
      ],
      materials: [
        { typeMat: 'TM-CAISSE',     emplacement: 'Caisse 1', prix: 3200, contractIndex: 0 },
        { typeMat: 'TM-SCANNER',    emplacement: 'Caisse 1', prix: 350,  contractIndex: 0 },
        { typeMat: 'TM-TPE',        emplacement: 'Caisse 2', prix: 890,  contractIndex: 1 },
        { typeMat: 'TM-IMPRIMANTE', emplacement: 'Caisse 3', prix: 450,  contractIndex: 1 },
      ],
    },
  ];

  // Créer clients + contrats + matériels
  for (const cDef of clientDefs) {
    const client = await prisma.client.create({
      data: {
        raisonSociale:   cDef.name,
        siren:           cDef.siren,
        codeApe:         cDef.ape,
        adresse:         cDef.adr,
        telephoneClient: cDef.tel,
        email:           `contact@${cDef.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 20)}.fr`,
        dureeDeplacement:cDef.duree,
        distanceKM:      cDef.dist,
        numeroAgence:    cDef.agenceId,
      },
    });

    const today = new Date();
    const createdContracts: number[] = [];

    for (const ctr of cDef.contracts) {
      const signDate = new Date(today);
      signDate.setFullYear(signDate.getFullYear() - ctr.signedYearsAgo);
      const echeDate = new Date(signDate);
      echeDate.setFullYear(echeDate.getFullYear() + ctr.durationYears);

      const contract = await prisma.contratMaintenance.create({
        data: {
          dateSignature: signDate,
          dateEcheance:  echeDate,
          numeroClient:  client.numeroClient,
          refTypeContrat:ctr.typeContrat,
        },
      });
      createdContracts.push(contract.numeroContrat);
    }

    let matIdx = 0;
    for (const mat of cDef.materials) {
      const saleDate = new Date(today);
      saleDate.setFullYear(saleDate.getFullYear() - 2);
      const installDate = new Date(saleDate);
      installDate.setDate(installDate.getDate() + 10);

      await prisma.materiel.create({
        data: {
          numeroSerie:                  `SN-${client.numeroClient}-${String(matIdx + 1).padStart(3, '0')}`,
          dateVente:                    saleDate,
          dateInstallation:             installDate,
          prixVente:                    mat.prix,
          emplacement:                  mat.emplacement,
          referenceInterneTypeMateriel: mat.typeMat,
          numeroClient:                 client.numeroClient,
          numeroContrat:                createdContracts[mat.contractIndex] ?? null,
        },
      });
      matIdx++;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Interventions réalistes (30 derniers jours)
  // ─────────────────────────────────────────────────────────────
  console.log('Seeding interventions...');

  // Techniciens par agence pour créer des interventions
  const agencyTechs: Record<number, string[]> = {
    1: ['TECH001', 'TECH002', 'TECH003', 'TECH004', 'TECH005'],
    2: ['TECH006', 'TECH007', 'TECH008', 'TECH009', 'TECH010'],
    3: ['TECH011', 'TECH012', 'TECH013', 'TECH014', 'TECH015'],
  };

  const allClients = await prisma.client.findMany({
    include: { materiels: { where: { numeroContrat: { not: null } } } },
  });

  let interventionCount = 0; 
  const today = new Date();

  for (const client of allClients) {
    const agenceId = client.numeroAgence;
    const techs = agencyTechs[agenceId];
    const validMats = client.materiels.filter(m => m.numeroContrat !== null);
    if (validMats.length === 0) continue;

    // 2 à 3 interventions par client sur les 30 derniers jours
    const numInterventions = 2 + (interventionCount % 2);
    for (let i = 0; i < numInterventions; i++) {
      const daysAgo = Math.floor(Math.random() * 28) + 1;
      const visitDate = new Date(today);
      visitDate.setDate(visitDate.getDate() - daysAgo);

      const techMatricule = techs[interventionCount % techs.length];
      const hour = 8 + (i * 2);

      const intervention = await prisma.intervention.create({
        data: {
          dateVisite:          visitDate,
          heureVisite:         new Date(`1970-01-01T${String(hour).padStart(2,'0')}:00:00`),
          matriculeTechnicien: techMatricule,
          numeroClient:        client.numeroClient,
        },
      });

      // Associer 1 à 2 matériels à l'intervention
      const matsForIntervention = validMats.slice(0, Math.min(2, validMats.length));
      const isValidated = i === 0; // La première intervention de chaque client est validée

      for (const mat of matsForIntervention) {
        await prisma.controler.create({
          data: {
            numeroIntervent:      intervention.numeroIntervent,
            numeroSerieMateriel:  mat.numeroSerie,
            tempsPasse:           isValidated ? 30 + Math.floor(Math.random() * 60) : null,
            commentaire:          isValidated ? 'Intervention réalisée avec succès. RAS.' : null,
          },
        });
      }
      interventionCount++;
    }
  }

  // Quelques interventions pour aujourd'hui pour le technicien TECH001
  const firstClientAgency1 = allClients.find(c => c.numeroAgence === 1);
  if (firstClientAgency1) {
    const validMats = firstClientAgency1.materiels.filter(m => m.numeroContrat !== null);
    if (validMats.length > 0) {
      for (let i = 0; i < 3; i++) {
        const interv = await prisma.intervention.create({
          data: {
            dateVisite:          today,
            heureVisite:         new Date(`1970-01-01T${String(8 + i * 2).padStart(2,'0')}:00:00`),
            matriculeTechnicien: 'TECH001',
            numeroClient:        firstClientAgency1.numeroClient,
          },
        });
        await prisma.controler.create({
          data: {
            numeroIntervent:     interv.numeroIntervent,
            numeroSerieMateriel: validMats[0].numeroSerie,
            tempsPasse:          null,
            commentaire:         null,
          },
        });
      }
    }
  }

  console.log(`✅ Seeding finished — ${interventionCount} interventions created!`);
  console.log('\n📋 Comptes de test:');
  console.log('  Gestionnaire Paris  : jean.dupont@cashcash.fr    / password123');
  console.log('  Gestionnaire Lyon   : bastien.lecorp@cashcash.fr / password123');
  console.log('  Gestionnaire PACA   : isabelle.fabre@cashcash.fr / password123');
  console.log('  Technicien Paris    : luc.martin@cashcash.fr     / password123');
  console.log('  Technicien Lyon     : sophie.lefebvre@cashcash.fr/ password123');
  console.log('  Technicien Marseille: manuel.garcia@cashcash.fr  / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
