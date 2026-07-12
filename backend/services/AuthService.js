import UserRepository from '../repositories/UserRepository.js'
import EmployeeRepository from '../repositories/EmployeeRepository.js'
import { NotFoundError, ValidationError } from '../utils/errors.js'

export class AuthService {
  async register({ email, password, name, departmentId }) {
    // Basic placeholder for now. 
    // Usually we would hash the password, but keeping it simple for the hackathon.
    const user = await UserRepository.create({
      email,
      password,
      role: 'EMPLOYEE'
    })

    const employee = await EmployeeRepository.create({
      userId: user.id,
      name,
      departmentId
    })

    return { user, employee }
  }

  async login({ email, password }) {
    const user = await UserRepository.findOne({ email })
    if (!user) {
      throw new NotFoundError('User not found')
    }
    if (user.password !== password) {
      throw new ValidationError('Invalid password')
    }
    // Return dummy token for hackathon
    return { token: `dummy_token_${user.id}`, user }
  }
}

export default new AuthService()
