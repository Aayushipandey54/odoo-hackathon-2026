import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  try {
    // Check ResourceBooking table exists
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('\n=== Tables Created ===');
    tables.forEach(t => console.log(`- ${t.table_name}`));

    // Check EXCLUDE constraint
    const constraints = await prisma.$queryRaw`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'ResourceBooking'
      ORDER BY constraint_name;
    `;
    
    console.log('\n=== ResourceBooking Constraints ===');
    constraints.forEach(c => console.log(`- ${c.constraint_name} (${c.constraint_type})`));

    // Check btree_gist extension
    const extensions = await prisma.$queryRaw`
      SELECT extname FROM pg_extension WHERE extname = 'btree_gist';
    `;
    
    console.log('\n=== Extensions ===');
    console.log(extensions.length > 0 ? '✓ btree_gist enabled' : '✗ btree_gist NOT enabled');

    // Check indexes on ResourceBooking
    const indexes = await prisma.$queryRaw`
      SELECT indexname FROM pg_indexes WHERE tablename = 'ResourceBooking';
    `;
    
    console.log('\n=== ResourceBooking Indexes ===');
    indexes.forEach(i => console.log(`- ${i.indexname}`));

    console.log('\n✓ Schema verification complete\n');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
