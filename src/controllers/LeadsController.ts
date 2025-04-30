import { Handler } from "express";
// import { prisma } from "../database";
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from "./zod_schemas/LeadRequestSchema";
import { HttpError } from "../errors/HttpError";
// import { Prisma } from "@prisma/client";
import {
  LeadsRepository,
  LeadWhereParams,
} from "../repositories/LeadsRepository";

export class LeadsController {
  private leadsRepository: LeadsRepository;

  constructor(leadsRepository: LeadsRepository) {
    this.leadsRepository = leadsRepository;
  }
  index: Handler = async (req, res, next) => {
    try {
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

      // const leads = await prisma.lead.findMany({
      //   where,
      //   skip: (pageNumber - 1) * pageSizeNumber,
      //   take: pageSizeNumber,
      //   orderBy: { [sortBy]: order },
      // });

      // const total = await prisma.lead.count({ where });

      res.json({
        data: leads,
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

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      const newLead = await this.leadsRepository.create(body);
      // const newLead = await prisma.lead.create({
      //   data: body,
      // });
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  select: Handler = async (req, res, next) => {
    try {
      // const lead = await prisma.lead.findUnique({
      //   where: { id: +req.params.id },
      //   include: {
      //     groups: true,
      //     campaigns: true,
      //   },
      // });

      const id = +req.params.id;
      const lead = await this.leadsRepository.findById(id);
      if (!lead) throw new HttpError(404, "lead não encontrado");

      res.status(200).json(lead);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateLeadRequestSchema.parse(req.body);
      // const lead = await prisma.lead.findUnique({
      //   where: { id: +req.params.id },
      // });

      const lead = await this.leadsRepository.findById(id);

      if (!lead) throw new HttpError(404, "lead não encontrado");

      //Regra de Negócio - Fluxo de Status
      if (body.status && lead.status === "New" && body.status !== "Contacted") {
        throw new HttpError(400, "O lead ainda não foi contatado");
      }

      //Regra de Negócio - Tempo de inatividade para arquivamento
      if (body.status && body.status === "Archived") {
        const now = new Date();
        const timeDiff = Math.abs(now.getTime() - lead.updatedAt.getTime());
        const daysDiff = Math.ceil(timeDiff / (1000 * 360 * 24));
        if (daysDiff < 180)
          throw new HttpError(
            400,
            "O lead só pode ser arquivado após 180 dias de inatividade"
          );
      }

      const updatedLead = await this.leadsRepository.updateById(id, body);
      // const updatedLead = await prisma.lead.update({
      //   data: body,
      //   where: { id: +req.params.id },
      // });

      res.status(200).json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      // const leadExists = await prisma.lead.findUnique({
      //   where: { id },
      // });
      const leadExists = await this.leadsRepository.findById(id);

      if (!leadExists) throw new HttpError(404, "lead não encontrado");

      // const deletedLead = await prisma.lead.delete({
      //   where: { id },
      // });

      const deletedLead = await this.leadsRepository.deleteById(id);

      res.status(200).json(deletedLead);
    } catch (error) {
      next(error);
    }
  };
}
