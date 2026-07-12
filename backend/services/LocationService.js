import LocationRepository from '../repositories/LocationRepository.js'
import { buildQuery } from '../utils/queryBuilder.js'

export class LocationService {
  async getAll(queryParams = {}) {
    const { where, options } = buildQuery(queryParams, ['name', 'address'])
    return LocationRepository.findAll(where, options)
  }

  async create(data) {
    return LocationRepository.create(data)
  }

  async getById(id) {
    return LocationRepository.findById(id)
  }

  async update(id, data) {
    return LocationRepository.update(id, data)
  }

  async delete(id) {
    return LocationRepository.softDelete(id)
  }
}

export default new LocationService()
