import DepartmentRepository from '../repositories/DepartmentRepository.js'

export class DepartmentService {
  async getAll() {
    return DepartmentRepository.findAll({}, { 
      include: { parent: true, head: true } // Assuming we want basic relations if they exist
    })
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
