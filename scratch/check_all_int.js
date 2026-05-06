
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const interventions = await prisma.intervention.findMany({
    include: {
      technicien: {
        include: {
          employe: true
        }
      },
      controles: true
    }
  });
  
  interventions.forEach(i => {
    const isValidated = i.controles.length > 0 && i.controles.every(c => c.tempsPasse !== null);
    console.log(`Int #${i.numeroIntervent} | Tech: ${i.technicien.employe.nomEmploye} | Date: ${i.dateVisite.toISOString().split('T')[0]} | Validated: ${isValidated}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
