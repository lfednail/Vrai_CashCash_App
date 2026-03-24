import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // 1. Agences
  const agency1 = await prisma.agence.upsert({
    where: { numeroAgence: 1 },
    update: {},
    create: {
      nomAgence: 'Agence Paris Nord',
      adresseAgence: '12 rue de la Paix 75001 Paris',
      telephoneAgence: '0123456789',
    },
  });

  const agency2 = await prisma.agence.upsert({
    where: { numeroAgence: 2 },
    update: {},
    create: {
      nomAgence: 'Agence Lyon Centre',
      adresseAgence: '45 rue de la République 69002 Lyon',
      telephoneAgence: '0456789123',
    },
  });

  // 2. Employés & Techniciens
  const employees = [
    { matricule: 'GEST001', nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@cashcash.fr', role: 'GESTIONNAIRE', agenceId: agency1.numeroAgence },
    { matricule: 'TECH001', nom: 'Martin', prenom: 'Luc', email: 'luc.martin@cashcash.fr', role: 'TECHNICIEN', agenceId: agency1.numeroAgence, tech: { mobile: '0612345678', qualif: 'Expert Réseaux' } },
    { matricule: 'TECH002', nom: 'Lefebvre', prenom: 'Sophie', email: 'sophie.lefebvre@cashcash.fr', role: 'TECHNICIEN', agenceId: agency2.numeroAgence, tech: { mobile: '0698765432', qualif: 'Technicien Support' } },
    { matricule: 'GEST002', nom: 'Lecorp', prenom: 'Bastion', email: 'bastion.lecorp@cashcash.fr', role: 'GESTIONNAIRE', agenceId: agency2.numeroAgence },
  ];

  for (const emp of employees) {
    await prisma.employe.upsert({
      where: { email: emp.email },
      update: {
        mot_de_passe: password
      },
      create: {

        matricule: emp.matricule,
        nomEmploye: emp.nom,
        prenomEmploye: emp.prenom,
        adresseEmploye: 'Adresse test',
        dateEmbauche: new Date(),
        email: emp.email,
        mot_de_passe: password,
        role: emp.role as any,
        numeroAgence: emp.agenceId,
        ...(emp.tech ? {
          technicien: {
            create: {
              telephoneMobile: emp.tech.mobile,
              qualification: emp.tech.qualif,
              dateObtention: new Date(),
            }
          }
        } : {})

      },
    });
  }

  // 3. Types
  await prisma.typeMateriel.upsert({
    where: { referenceInterne: 'TM-CAISSE' },
    update: {},
    create: { referenceInterne: 'TM-CAISSE', libelleTypeMateriel: 'Caisse Enregistreuse Tactile' }
  });

  await prisma.typeContrat.upsert({
    where: { refTypeContrat: 'PREMIUM' },
    update: {},
    create: { refTypeContrat: 'PREMIUM', delaiIntervention: 4, tauxApplicable: 1.5 }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
