import { Handler } from "express";
import {
  CreateCampaignRequestSchema,
  UpdateCampaignRequestSchema,
} from "./zod_schemas/CampaignsRequestSchema";
import { CampaignsService } from "../services/CampaignsService";

export class CampaignController {
  constructor(private readonly campaignsService: CampaignsService) {}
  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignsService.getAllCampaigns();
      res.status(200).json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  select: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const campaign = await this.campaignsService.getCampaignById(id);
      res.status(200).json(campaign);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSchema.parse(req.body);
      const newCampaign = await this.campaignsService.createCampaign(body);
      res.status(201).json(newCampaign);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateCampaignRequestSchema.parse(req.body);
      const updatedCampaign = await this.campaignsService.updateCampaign(
        id,
        body
      );
      res.status(200).json(updatedCampaign);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const deletedCampaign = await this.campaignsService.deleteCampaign(id);
      res.status(200).json(deletedCampaign);
    } catch (error) {
      next(error);
    }
  };
}
