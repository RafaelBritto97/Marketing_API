import { Handler } from "express";
import { prisma } from "../database";
import {
  CreateGroupRequestSchema,
  UpdateGroupRequestSchema,
} from "./zod_schemas/GroupsRequestSchema";
import { HttpError } from "../errors/HttpError";

export class GroupsController {
  index: Handler = async (req, res, next) => {
    try {
      const groups = await prisma.group.findMany();
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupRequestSchema.parse(req.body);
      const newGroup = await prisma.group.create({ data: body });

      res.status(201).json(newGroup);
    } catch (error) {
      next(error);
    }
  };

  select: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const group = await prisma.group.findUnique({
        where: { id },
        include: { leads: true },
      });

      if (!group) throw new HttpError(404, "grupo não encontrado");

      res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateGroupRequestSchema.parse(req.body);

      const group = await prisma.group.findUnique({ where: { id } });
      if (!group) throw new HttpError(404, "grupo não encontrado");

      const updatedGroup = await prisma.group.update({
        where: { id },
        data: body,
      });

      res.status(200).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;

      const group = await prisma.group.findUnique({ where: { id } });
      if (!group) throw new HttpError(404, "grupo não encontrado");

      const deletedGroup = await prisma.group.delete({ where: { id } });

      res.status(200).json(deletedGroup);
    } catch (error) {
      next(error);
    }
  };
}
