import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class AuditRepository extends GenericRepository {
  constructor() {
    super(prisma.auditCycle)
  }
}

export default new AuditRepository()
