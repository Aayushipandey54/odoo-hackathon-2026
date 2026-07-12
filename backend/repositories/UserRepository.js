import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class UserRepository extends GenericRepository {
  constructor() {
    super(prisma.user)
  }
}

export default new UserRepository()
