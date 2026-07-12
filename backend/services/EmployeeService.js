import EmployeeRepository from '../repositories/EmployeeRepository.js'

export class EmployeeService {
  async getAll() {
    return EmployeeRepository.findAll({}, {
      include: { department: true }
    })
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
