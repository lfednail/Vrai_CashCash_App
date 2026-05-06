
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ints = await prisma.intervention.findMany({
    where: { numeroIntervent: { in: [61, 62, 63] } },
    include: { controles: true }
  });
  console.log(JSON.stringify(ints, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
