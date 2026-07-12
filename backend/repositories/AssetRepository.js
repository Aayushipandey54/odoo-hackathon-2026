import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class AssetRepository extends GenericRepository {
  constructor() {
    super(prisma.asset)
  }

  async findByTag(tag) {
    return this.model.findUnique({
      where: { tag },
      include: {
        category: true,
        department: true,
        currentAssignee: true,
      }
    })
  }
}

export default new AssetRepository()
