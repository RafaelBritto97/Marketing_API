import { Handler } from "express";
import {
  CreateCampaignRequestSchema,
  UpdateCampaignRequestSchema,
} from "./zod_schemas/CampaignsRequestSchema";
import { HttpError } from "../errors/HttpError";
import { CampaignsRepository } from "../repositories/CampaignsRepository";

export class CampaignController {

  constructor(
    private readonly campaignRepository: CampaignsRepository
  ) {}
  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignRepository.find()

      res.status(200).json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSchema.parse(req.body);
      const newCampaign = await this.campaignRepository.create(body)

      res.status(201).json(newCampaign);
    } catch (error) {
      next(error);
    }
  };

  select: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const campaign = await this.campaignRepository.findById(id)
      if (!campaign) throw new HttpError(404, "campanha não encontrada");

      res.status(200).json(campaign);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateCampaignRequestSchema.parse(req.body);

      const updatedCampaign = await this.campaignRepository.updateById(id, body)
      if (!updatedCampaign) throw new HttpError(404, "campanha não encontrada");

      res.status(200).json(updatedCampaign);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      
      const deletedCampaign = await this.campaignRepository.deleteById(id)
      if (!deletedCampaign) throw new HttpError(404, "campanha não encontrada");

      res.status(200).json(deletedCampaign);
    } catch (error) {
      next(error);
    }
  };
}
