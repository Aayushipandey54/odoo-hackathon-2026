import AssetCategoryRepository from '../repositories/AssetCategoryRepository.js'
import { buildQuery } from '../utils/queryBuilder.js'

export class AssetCategoryService {
  async getAll(queryParams = {}) {
    const { where, options } = buildQuery(queryParams, ['name'])
    return AssetCategoryRepository.findAll(where, options)
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
