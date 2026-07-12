import AssetCategoryRepository from '../repositories/AssetCategoryRepository.js'

export class AssetCategoryService {
  async getAll() {
    return AssetCategoryRepository.findAll()
  }

  async create(data) {
    return AssetCategoryRepository.create(data)
  }

  async getById(id) {
    return AssetCategoryRepository.findById(id)
  }

  async update(id, data) {
    return AssetCategoryRepository.update(id, data)
  }

  async delete(id) {
    return AssetCategoryRepository.softDelete(id)
  }
}

export default new AssetCategoryService()
