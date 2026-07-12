import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class ResourceRepository extends GenericRepository {
  constructor() {
    super(prisma.resource)
  }
}

export default new ResourceRepository()
