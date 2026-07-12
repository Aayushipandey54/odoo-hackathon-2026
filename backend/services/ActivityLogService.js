import ActivityLogRepository from '../repositories/ActivityLogRepository.js'

export class ActivityLogService {
  async getAll() {
    return ActivityLogRepository.findAll({}, {
      orderBy: { createdAt: 'desc' }
    })
  }
}

export default new ActivityLogService()
