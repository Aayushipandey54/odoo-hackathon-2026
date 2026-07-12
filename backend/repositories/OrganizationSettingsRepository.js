import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class OrganizationSettingsRepository extends GenericRepository {
  constructor() {
    super(prisma.organizationSettings)
  }
}

export default new OrganizationSettingsRepository()
