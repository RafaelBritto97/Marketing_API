import { HttpError } from "../errors/HttpError";
import {
  CreateLeadAttributes,
  LeadsRepository,
  LeadStatus,
  LeadWhereParams,
} from "../repositories/LeadsRepository";

interface GetLeadsWithPaginationParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: LeadStatus;
  sortBy?: "name" | "status" | "createdAt";
  order?: "asc" | "desc";
  campaignId?: number;
}
interface FilteredCampaignLeads {
  where: LeadWhereParams;
  sortBy?: "name" | "status" | "createdAt";
  order?: "asc" | "desc";
  limit: number;
  offset: number;
}

export class LeadsService {
  constructor(private readonly leadsRepository: LeadsRepository) {}
  async getAllLeadsPaginated(params: GetLeadsWithPaginationParams) {
    const { name, status, page = 1, pageSize = 10, sortBy, order } = params;
    const limit = pageSize;
    const offset = (page - 1) * limit;

    const where: LeadWhereParams = {};

    if (name) where.name = { like: name, mode: "insensitive" };
    if (status) where.status = status;

    const leads = await this.leadsRepository.find({
      where,
      sortBy,
      order,
      limit,
      offset,
    });

    const total = await this.leadsRepository.count(where);

    return {
      leads,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getLeadById(id: number) {
    const lead = await this.leadsRepository.findById(id);
    if (!lead) throw new HttpError(404, "lead não encontrado");
    return lead;
  }

  async getFilteredLeads(params: FilteredCampaignLeads) {
    const leads = await this.leadsRepository.find(params);
    return leads;
  }

  async createLead(params: CreateLeadAttributes) {
    if (!params.status) params.status = "New";
    const newLead = await this.leadsRepository.create(params);
    return newLead;
  }

  async countLeads(where: LeadWhereParams) {
    const total = await this.leadsRepository.count(where);
    return total;
  }

  async updateLead(leadId: number, params: Partial<CreateLeadAttributes>) {
    const lead = await this.leadsRepository.findById(leadId);

    if (!lead) throw new HttpError(404, "lead não encontrado");

    //Regra de Negócio - Fluxo de Status
    if (
      lead.status === "New" &&
      params.status !== undefined &&
      params.status !== "Contacted"
    ) {
      throw new HttpError(400, "O lead ainda não foi contatado");
    }

    //Regra de Negócio - Tempo de inatividade para arquivamento
    if (params.status && params.status === "Archived") {
      const now = new Date();
      const timeDiff = Math.abs(now.getTime() - lead.updatedAt.getTime());
      const daysDiff = Math.ceil(timeDiff / (1000 * 360 * 24));
      if (daysDiff < 180)
        throw new HttpError(
          400,
          "O lead só pode ser arquivado após 180 dias de inatividade"
        );
    }

    const updatedLead = await this.leadsRepository.updateById(leadId, params);
    return updatedLead;
  }

  async deleteLead(leadId: number) {
    const leadExists = await this.leadsRepository.findById(leadId);
    if (!leadExists) throw new HttpError(404, "lead não encontrado");

    const deletedLead = await this.leadsRepository.deleteById(leadId);
    return deletedLead;
  }
}
