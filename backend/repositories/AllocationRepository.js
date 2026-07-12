import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class AllocationRepository extends GenericRepository {
  constructor() {
    super(prisma.assetAllocation)
  }
}

export default new AllocationRepository()
