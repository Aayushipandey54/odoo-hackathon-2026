import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class MaintenanceRepository extends GenericRepository {
  constructor() {
    super(prisma.maintenanceRequest)
  }
}

export default new MaintenanceRepository()
