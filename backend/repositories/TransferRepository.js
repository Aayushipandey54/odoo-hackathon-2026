import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class TransferRepository extends GenericRepository {
  constructor() {
    super(prisma.transferRequest)
  }
}

export default new TransferRepository()
