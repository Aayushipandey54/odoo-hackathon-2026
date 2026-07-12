import ResourceRepository from '../repositories/ResourceRepository.js'

export class ResourceService {
  async getAll() {
    return ResourceRepository.findAll()
  }

  async create(data) {
    return ResourceRepository.create(data)
  }

  async getById(id) {
    return ResourceRepository.findById(id)
  }

  async update(id, data) {
    return ResourceRepository.update(id, data)
  }

  async delete(id) {
    return ResourceRepository.softDelete(id)
  }
}

export default new ResourceService()
