import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class NotificationRepository extends GenericRepository {
  constructor() {
    super(prisma.notification)
  }
}

export default new NotificationRepository()
