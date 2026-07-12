import GenericRepository from './GenericRepository.js'
import { prisma } from '../core/connection.js'

export class BookingRepository extends GenericRepository {
  constructor() {
    super(prisma.resourceBooking)
  }
}

export default new BookingRepository()
