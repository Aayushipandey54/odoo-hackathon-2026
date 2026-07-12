import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class AuditItemRepository extends GenericRepository {
  constructor() {
    super(prisma.auditItem)
  }
}

export default new AuditItemRepository()
