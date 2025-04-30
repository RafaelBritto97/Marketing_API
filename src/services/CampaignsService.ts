import { HttpError } from "../errors/HttpError";
import {
  CampaignsRepository,
  CreateCampaignAttributes,
  LeadCampaignStatus,
} from "../repositories/CampaignsRepository";

export class CampaignsService {
  constructor(private readonly campaignsRepository: CampaignsRepository) {}

  async getAllCampaigns() {
    const campaigns = await this.campaignsRepository.find();
    return campaigns;
  }

  async getCampaignById(campaignId: number) {
    const campaign = await this.campaignsRepository.findById(campaignId);
    if (!campaign) throw new HttpError(404, "campanha não encontrada");
    return campaign;
  }

  async createCampaign(params: CreateCampaignAttributes) {
    const newCampaign = await this.campaignsRepository.create(params);
    return newCampaign;
  }

  async updateCampaign(
    campaignId: number,
    params: Partial<CreateCampaignAttributes>
  ) {
    const updatedCampaign = await this.campaignsRepository.updateById(
      campaignId,
      params
    );
    if (!updatedCampaign) throw new HttpError(404, "campanha não encontrada");
    return updatedCampaign;
  }

  async deleteCampaign(campaignId: number) {
    const deletedCampaign = await this.campaignsRepository.deleteById(
      campaignId
    );
    if (!deletedCampaign) throw new HttpError(404, "campanha não encontrada");
    return deletedCampaign;
  }

  async addLeadToCampaign(
    campaignId: number,
    leadId: number,
    status: LeadCampaignStatus
  ) {
    await this.campaignsRepository.addLead({ campaignId, leadId, status });
  }

  async updateCampaignLeadStatus(
    campaignId: number,
    leadId: number,
    status: LeadCampaignStatus
  ) {
    await this.campaignsRepository.updateLeadStatus({
      campaignId,
      leadId,
      status,
    });
  }

  async removeLeadFromCampaign(campaignId: number, leadId: number) {
    await this.campaignsRepository.removeLead(campaignId, leadId);
  }
}
