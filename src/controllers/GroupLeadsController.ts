import { Handler } from "express";
import { GetLeadsRequestSchema } from "./zod_schemas/LeadRequestSchema";
import { AddLeadRequestSchema } from "./zod_schemas/GroupsRequestSchema";
import { LeadWhereParams } from "../repositories/LeadsRepository";
import { GroupsService } from "../services/GroupsService";
import { LeadsService } from "../services/LeadsService";

export class GroupLeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly groupsService: GroupsService
  ) {}
  //GET /groups/groupId/leads
  getLeads: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const query = GetLeadsRequestSchema.parse(req.query);
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

      const where: LeadWhereParams = { groupId };

      if (name) where.name = { like: name, mode: "insensitive" };
      if (status) where.status = status;

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
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const { leadId } = AddLeadRequestSchema.parse(req.body);
      const groupId = +req.params.groupId;
      const updatedGroup = await this.groupsService.addLeadToGroup(
        groupId,
        leadId
      );
      res.status(201).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  deleteLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const leadId = +req.params.leadId;
      const updatedGroup = await this.groupsService.deleteLeadFromGroup(
        groupId,
        leadId
      );
      res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };
}
