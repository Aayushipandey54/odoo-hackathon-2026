import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class DepartmentRepository extends GenericRepository {
  constructor() {
    super(prisma.department)
  }
}

export default new DepartmentRepository()
