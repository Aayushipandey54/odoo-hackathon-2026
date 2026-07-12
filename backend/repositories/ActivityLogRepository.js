import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class ActivityLogRepository extends GenericRepository {
  constructor() {
    super(prisma.activityLog)
  }
}

export default new ActivityLogRepository()
