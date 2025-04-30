import { LeadsController } from "../controllers/LeadsController";
import { GroupsController } from "../controllers/GroupsController";
import { CampaignController } from "../controllers/CampaignsController";
import { CampaignLeadsController } from "../controllers/CampaignLeadsController";
import { GroupLeadsController } from "../controllers/GroupLeadsController";
import { PrismaLeadsRepository } from "../repositories/prisma/PrismaLeadsRepository";
import { PrismaGroupsRepository } from "../repositories/prisma/PrismaGroupsRepository";
import { PrismaCampaignsRepository } from "../repositories/prisma/PrismaCampaignsRepository";
import { LeadsService } from "../services/LeadsService";
import { GroupsService } from "../services/GroupsService";
import { CampaignsService } from "../services/CampaignsService";

export const leadsRepository = new PrismaLeadsRepository();
export const groupsRepository = new PrismaGroupsRepository();
export const campaignsRepository = new PrismaCampaignsRepository();

export const leadsService = new LeadsService(leadsRepository);
export const groupsService = new GroupsService(groupsRepository);
export const campaignsService = new CampaignsService(campaignsRepository);

export const leadsController = new LeadsController(leadsService);
export const groupsController = new GroupsController(groupsService);
export const groupLeadsController = new GroupLeadsController(
  leadsRepository,
  groupsService
);
export const campaignController = new CampaignController(campaignsService);
export const campaignLeadsController = new CampaignLeadsController(
  leadsRepository,
  campaignsService
);
