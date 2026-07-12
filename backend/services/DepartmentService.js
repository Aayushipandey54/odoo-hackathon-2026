import DepartmentRepository from '../repositories/DepartmentRepository.js'
import { buildQuery } from '../utils/queryBuilder.js'

export class DepartmentService {
  async getAll(queryParams = {}) {
    const { where, options } = buildQuery(queryParams, ['name'])
    // Merge include options
    options.include = { ...options.include, parent: true, head: true }
    return DepartmentRepository.findAll(where, options)
  }

  async create(data) {
    return DepartmentRepository.create(data)
  }

  async getById(id) {
    return DepartmentRepository.findById(id)
  }

  async update(id, data) {
    return DepartmentRepository.update(id, data)
  }

  async delete(id) {
    return DepartmentRepository.softDelete(id)
  }
}

export default new DepartmentService()
