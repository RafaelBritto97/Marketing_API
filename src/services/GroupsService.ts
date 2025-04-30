import { HttpError } from "../errors/HttpError";
import { GroupsRepository } from "../repositories/GroupsRepository";

export interface CreateGroupParams {
  name: string;
  description: string;
}

export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async getAllGroups() {
    const groups = await this.groupsRepository.find();
    return groups;
  }

  async findGroupById(groupId: number) {
    const group = await this.groupsRepository.findById(groupId);
    if (!group) throw new HttpError(404, "grupo não encontrado");
    return group;
  }

  async createGroup(params: CreateGroupParams) {
    const newGroup = await this.groupsRepository.create(params);
    return newGroup;
  }

  async updateGroup(groupId: number, params: Partial<CreateGroupParams>) {
    const updatedGroup = await this.groupsRepository.updateById(
      groupId,
      params
    );
    if (!updatedGroup) throw new HttpError(404, "grupo não encontrado");
    return updatedGroup;
  }

  async deleteGroup(groupId: number) {
    const deletedGroup = await this.groupsRepository.deleteById(groupId);
    if (!deletedGroup) throw new HttpError(404, "grupo não encontrado");
    return deletedGroup;
  }

  async addLeadToGroup(groupId: number, leadId: number) {
    const updatedGroup = await this.groupsRepository.addLead(groupId, leadId);
    return updatedGroup;
  }

  async deleteLeadFromGroup(groupId: number, leadId: number) {
    const updatedGroup = await this.groupsRepository.removeLead(
      groupId,
      leadId
    );
    return updatedGroup;
  }
}
