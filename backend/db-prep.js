import pkg from '@prisma/client'
const { PrismaClient } = pkg
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('Prepping database constraints for db push...')
  try {
    // Drop the Asset_assetNumber_key unique constraint/index
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" DROP CONSTRAINT IF EXISTS "Asset_assetNumber_key" CASCADE;`)
    console.log('Successfully dropped constraint Asset_assetNumber_key if existed.')
    
    // Also drop the column assetNumber if it exists to clean up
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" DROP COLUMN IF EXISTS "assetNumber" CASCADE;`)
    console.log('Successfully dropped column assetNumber if existed.')

    // Drop the Asset_serialNumber_key unique constraint/index
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" DROP CONSTRAINT IF EXISTS "Asset_serialNumber_key" CASCADE;`)
    console.log('Successfully dropped constraint Asset_serialNumber_key if existed.')
    
    // Also drop the column serialNumber if it exists to clean up
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" DROP COLUMN IF EXISTS "serialNumber" CASCADE;`)
    console.log('Successfully dropped column serialNumber if existed.')
  } catch (err) {
    console.error('Error running raw sql prep:', err.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
