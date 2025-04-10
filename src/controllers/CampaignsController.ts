import { Handler } from "express";
import { prisma } from "../database";
import {
  CreateCampaignRequestSchema,
  UpdateCampaignRequestSchema,
} from "./zod_schemas/CampaignsRequestSchema";
import { HttpError } from "../errors/HttpError";

export class CampaignController {
  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await prisma.campaign.findMany();

      res.status(200).json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSchema.parse(req.body);
      const newCampaign = await prisma.campaign.create({ data: body });

      res.status(201).json(newCampaign);
    } catch (error) {
      next(error);
    }
  };

  select: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
          leads: {
            include: {
              lead: true,
            },
          },
        },
      });
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

      const campaign = await prisma.campaign.findUnique({ where: { id } });
      if (!campaign) throw new HttpError(404, "campanha não encontrada");

      const updatedCampaign = await prisma.campaign.update({
        where: { id },
        data: body,
      });

      res.status(200).json(updatedCampaign);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const campaign = await prisma.campaign.findUnique({ where: { id } });
      if (!campaign) throw new HttpError(404, "campanha não encontrada");

      const deletedCampaign = await prisma.campaign.delete({ where: { id } });

      res.status(200).json(deletedCampaign);
    } catch (error) {
      next(error);
    }
  };
}
