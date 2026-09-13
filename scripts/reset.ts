import { db } from '../src/database/db';

async function main() {
  const { count } = await db.session.deleteMany({});
  console.log(`--- obrisano ${count} sesija (eventi i klasifikacije kaskadno) ---`);
  await db.$disconnect();
}

main();