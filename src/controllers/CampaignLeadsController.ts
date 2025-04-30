import { Handler } from "express";
import {
  AddLeadRequestSchema,
  GetCampaignLeadsRequestSchema,
  UpdateLeadStatusRequestSchema,
} from "./zod_schemas/CampaignsRequestSchema";
import { LeadWhereParams } from "../repositories/LeadsRepository";
import { CampaignsService } from "../services/CampaignsService";
import { LeadsService } from "../services/LeadsService";

export class CampaignLeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly campaignsService: CampaignsService
  ) {}

  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const query = GetCampaignLeadsRequestSchema.parse(req.query);
      const {
        page = "1",
        pageSize = "10",
        name,
        status,
        sortBy = "name",
        order = "asc",
      } = query;

      const limit = +pageSize;
      const offset = (+page - 1) * limit;

      const where: LeadWhereParams = { campaignId, campaignStatus: status };

      if (name) where.name = { like: name, mode: "insensitive" };

      const leads = await this.leadsService.getFilteredLeads({
        where,
        sortBy,
        order,
        limit,
        offset,
      });

      const total = await this.leadsService.countLeads(where);

      res.json({
        leads,
        meta: {
          page: +page,
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / +pageSize),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const { leadId, status = "New" } = AddLeadRequestSchema.parse(req.body);
      await this.campaignsService.addLeadToCampaign(campaignId, leadId, status);
      res.status(201).end();
    } catch (error) {
      next(error);
    }
  };

  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const leadId = +req.params.leadId;
      const { status } = UpdateLeadStatusRequestSchema.parse(req.body);
      await this.campaignsService.updateCampaignLeadStatus(
        campaignId,
        leadId,
        status
      );
      res.status(204);
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const leadId = +req.params.leadId;
      await this.campaignsService.removeLeadFromCampaign(campaignId, leadId);
      res.status(204);
    } catch (error) {
      next(error);
    }
  };
}
