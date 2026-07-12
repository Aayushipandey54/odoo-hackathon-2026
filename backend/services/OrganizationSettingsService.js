import OrganizationSettingsRepository from '../repositories/OrganizationSettingsRepository.js'

export class OrganizationSettingsService {
  async getSettings() {
    let settings = await OrganizationSettingsRepository.findById("default")
    if (!settings) {
      settings = await OrganizationSettingsRepository.create({
        id: "default",
        companyName: "Acme Corp",
        currency: "USD",
        timezone: "UTC"
      })
    }
    return settings
  }

  async updateSettings(data) {
    let settings = await OrganizationSettingsRepository.findById("default")
    if (!settings) {
      return OrganizationSettingsRepository.create({ id: "default", ...data })
    }
    return OrganizationSettingsRepository.update("default", data)
  }
}

export default new OrganizationSettingsService()
