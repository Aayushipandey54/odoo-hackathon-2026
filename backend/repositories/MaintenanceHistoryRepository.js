import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class MaintenanceHistoryRepository extends GenericRepository {
  constructor() {
    super(prisma.maintenanceHistory)
  }
}

export default new MaintenanceHistoryRepository()
