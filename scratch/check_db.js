
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const controls = await prisma.controler.findMany({
    where: { numeroSerieMateriel: 'SN-1-002' },
    include: {
      intervention: true
    }
  });
  console.log(JSON.stringify(controls, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
