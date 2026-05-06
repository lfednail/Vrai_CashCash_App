
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const intervention = await prisma.intervention.findUnique({
    where: { numeroIntervent: 70 },
    include: {
      controles: true
    }
  });
  console.log(JSON.stringify(intervention, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
