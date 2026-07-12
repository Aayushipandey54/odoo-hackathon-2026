import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class LocationRepository extends GenericRepository {
  constructor() {
    super(prisma.location)
  }
}

export default new LocationRepository()
