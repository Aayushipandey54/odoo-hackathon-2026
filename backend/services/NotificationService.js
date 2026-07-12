import NotificationRepository from '../repositories/NotificationRepository.js'

export class NotificationService {
  async getAll() {
    return NotificationRepository.findAll({}, {
      orderBy: { createdAt: 'desc' }
    })
  }
}

export default new NotificationService()
