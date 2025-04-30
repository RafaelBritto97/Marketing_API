import { Handler } from "express";
import {
  CreateGroupRequestSchema,
  UpdateGroupRequestSchema,
} from "./zod_schemas/GroupsRequestSchema";
import { GroupsService } from "../services/GroupsService";

export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}
  index: Handler = async (req, res, next) => {
    try {
      const groups = await this.groupsService.getAllGroups();
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  };

  select: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const group = await this.groupsService.findGroupById(id);
      res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupRequestSchema.parse(req.body);
      const newGroup = await this.groupsService.createGroup(body);
      res.status(201).json(newGroup);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const body = UpdateGroupRequestSchema.parse(req.body);
      const updatedGroup = await this.groupsService.updateGroup(id, body);
      res.status(200).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const deletedGroup = await this.groupsService.deleteGroup(id);
      res.status(200).json(deletedGroup);
    } catch (error) {
      next(error);
    }
  };
}
