import pkg from '@prisma/client'
const { PrismaClient } = pkg
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data for AssetFlow...')

  // 1. Create Departments
  const engDept = await prisma.department.upsert({
    where: { id: 'dept-eng-111' },
    update: {},
    create: {
      id: 'dept-eng-111',
      name: 'Engineering',
      status: 'ACTIVE'
    }
  })

  const itDept = await prisma.department.upsert({
    where: { id: 'dept-it-222' },
    update: {},
    create: {
      id: 'dept-it-222',
      name: 'IT Support',
      status: 'ACTIVE'
    }
  })

  console.log('Departments created:', engDept.name, itDept.name)

  // 2. Create Users & Employees
  // Admin User (Asset Manager)
  const adminUser = await prisma.user.upsert({
    where: { email: 'manager@assetflow.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'manager@assetflow.com',
      password: 'adminpassword',
      role: 'ADMIN'
    }
  })

  const adminEmployee = await prisma.employee.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      name: 'Sarah Jones (Asset Manager)',
      departmentId: itDept.id
    }
  })

  // Employee 1
  const emp1User = await prisma.user.upsert({
    where: { email: 'priya@assetflow.com' },
    update: { role: 'EMPLOYEE' },
    create: {
      email: 'priya@assetflow.com',
      password: 'userpassword',
      role: 'EMPLOYEE'
    }
  })

  const employee1 = await prisma.employee.upsert({
    where: { userId: emp1User.id },
    update: {},
    create: {
      userId: emp1User.id,
      name: 'Priya Shah (Software Engineer)',
      departmentId: engDept.id
    }
  })

  // Technician Employee
  const techUser = await prisma.user.upsert({
    where: { email: 'technician@assetflow.com' },
    update: { role: 'EMPLOYEE' },
    create: {
      email: 'technician@assetflow.com',
      password: 'techpassword',
      role: 'EMPLOYEE'
    }
  })

  const techEmployee = await prisma.employee.upsert({
    where: { userId: techUser.id },
    update: {},
    create: {
      userId: techUser.id,
      name: 'John Doe (IT Technician)',
      departmentId: itDept.id
    }
  })

  console.log('Users and Employees seeded.')

  // 3. Create Asset Categories
  const laptopCat = await prisma.assetCategory.upsert({
    where: { name: 'Laptop' },
    update: {},
    create: { name: 'Laptop' }
  })

  const networkCat = await prisma.assetCategory.upsert({
    where: { name: 'Network' },
    update: {},
    create: { name: 'Network' }
  })

  const furnitureCat = await prisma.assetCategory.upsert({
    where: { name: 'Furniture' },
    update: {},
    create: { name: 'Furniture' }
  })

  console.log('Asset Categories seeded.')

  // 4. Create Assets
  const asset1 = await prisma.asset.upsert({
    where: { tag: 'AF-0114' },
    update: {},
    create: {
      tag: 'AF-0114',
      name: 'MacBook Pro 16"',
      categoryId: laptopCat.id,
      departmentId: engDept.id,
      status: 'AVAILABLE',
      condition: 'NEW',
      location: 'HQ Floor 3'
    }
  })

  const asset2 = await prisma.asset.upsert({
    where: { tag: 'AF-0220' },
    update: {},
    create: {
      tag: 'AF-0220',
      name: 'Cisco Core Switch 48P',
      categoryId: networkCat.id,
      departmentId: itDept.id,
      status: 'AVAILABLE',
      condition: 'GOOD',
      location: 'Server Room A'
    }
  })

  const asset3 = await prisma.asset.upsert({
    where: { tag: 'AF-0341' },
    update: {},
    create: {
      tag: 'AF-0341',
      name: 'Herman Miller Aeron Chair',
      categoryId: furnitureCat.id,
      departmentId: engDept.id,
      status: 'AVAILABLE',
      condition: 'GOOD',
      location: 'HQ Room 12'
    }
  })

  console.log('Assets seeded:', asset1.name, asset2.name, asset3.name)
  console.log('Database seeding successfully finished!')
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
