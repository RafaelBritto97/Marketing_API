import { Handler } from "express";
import { GetLeadsRequestSchema } from "./zod_schemas/LeadRequestSchema";
import { Prisma } from "@prisma/client";
import { prisma } from "../database";
import { AddLeadRequestSchema } from "./zod_schemas/GroupsRequestSchema";

export class GroupLeadsController {
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

      const where: Prisma.LeadWhereInput = {
        groups: {
          some: { id: groupId },
        },
      };

      if (name) where.name = { contains: name, mode: "insensitive" };
      if (status) where.status = status;

      const leads = await prisma.lead.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (+page - 1) * +pageSize,
        take: +pageSize,
        include: {
          groups: true,
        },
      });

      const total = await prisma.lead.count({ where });

      res.json({
        leads,
        meta: {
          page: +page,
          pageSize: +pageSize,
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
      const body = AddLeadRequestSchema.parse(req.body);
      const updatedGroup = prisma.group.update({
        where: {
          id: +req.params.groupId,
        },
        data: {
          leads: {
            connect: { id: body.leadId },
          },
        },
        include: { leads: true },
      });

      res.status(201).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  deleteLead: Handler = async (req, res, next) => {
    try {
      const updatedGroup = await prisma.group.update({
        where: { id: +req.params.groupId },
        data: {
          leads: {
            disconnect: { id: +req.params.leadId },
          },
        },
        include: { leads: true },
      });
      res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };
}
