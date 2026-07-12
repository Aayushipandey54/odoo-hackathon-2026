import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class EmployeeRepository extends GenericRepository {
  constructor() {
    super(prisma.employee)
  }
}

export default new EmployeeRepository()
