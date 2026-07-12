import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class AssetCategoryRepository extends GenericRepository {
  constructor() {
    super(prisma.assetCategory)
  }
}

export default new AssetCategoryRepository()
