import EmployeeRepository from '../repositories/EmployeeRepository.js'
import { buildQuery } from '../utils/queryBuilder.js'

export class EmployeeService {
  async getAll(queryParams = {}) {
    const { where, options } = buildQuery(queryParams, ['name'])
    options.include = { ...options.include, department: true }
    return EmployeeRepository.findAll(where, options)
  }

  async create(data) {
    return EmployeeRepository.create(data)
  }

  async getById(id) {
    return EmployeeRepository.findById(id)
  }

  async update(id, data) {
    return EmployeeRepository.update(id, data)
  }

  async delete(id) {
    return EmployeeRepository.softDelete(id)
  }
}

export default new EmployeeService()
