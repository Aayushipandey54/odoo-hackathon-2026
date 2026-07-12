import AssetRepository from '../repositories/AssetRepository.js'
import ActivityLogRepository from '../repositories/ActivityLogRepository.js'

export class AssetService {
  async getAll() {
    return AssetRepository.findAll({}, {
      include: { category: true, department: true, currentAssignee: true }
    })
  }

  async create(data, userId) {
    const asset = await AssetRepository.create(data)
    await ActivityLogRepository.create({
      action: 'ASSET_REGISTERED',
      details: `Asset ${asset.tag} registered`,
      entityId: asset.id,
      entityType: 'ASSET',
      userId
    })
    return asset
  }

  async getById(id) {
    return AssetRepository.findById(id)
  }

  async update(id, data, userId) {
    const asset = await AssetRepository.update(id, data)
    await ActivityLogRepository.create({
      action: 'ASSET_UPDATED',
      details: `Asset ${asset.tag} updated`,
      entityId: asset.id,
      entityType: 'ASSET',
      userId
    })
    return asset
  }

  async search(query) {
    return AssetRepository.findAll({
      OR: [
        { tag: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } }
      ]
    }, {
      include: { category: true, department: true, currentAssignee: true }
    })
  }
}

export default new AssetService()
