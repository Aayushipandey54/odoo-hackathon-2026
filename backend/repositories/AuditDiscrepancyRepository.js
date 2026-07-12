import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class AuditDiscrepancyRepository extends GenericRepository {
  constructor() {
    super(prisma.auditDiscrepancy)
  }
}

export default new AuditDiscrepancyRepository()
