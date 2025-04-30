import { Handler } from "express";
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from "./zod_schemas/LeadRequestSchema";
import { LeadsService } from "../services/LeadsService";

export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}
  index: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchema.parse(req.query);
      const { page = "1", pageSize = "10" } = query;

      const data = await this.leadsService.getAllLeadsPaginated({
        ...query,
        page: +page,
        pageSize: +pageSize,
      });

      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      const newLead = await this.leadsService.createLead(body);
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  select: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const lead = await this.leadsService.getLeadById(id);

      res.status(200).json(lead);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateLeadRequestSchema.parse(req.body);
      const updatedLead = await this.leadsService.updateLead(id, body);

      res.status(200).json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const deletedLead = await this.leadsService.deleteLead(id);
      res.status(200).json(deletedLead);
    } catch (error) {
      next(error);
    }
  };
}
