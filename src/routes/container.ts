import { LeadsController } from "../controllers/LeadsController";
import { GroupsController } from "../controllers/GroupsController";
import { CampaignController } from "../controllers/CampaignsController";
import { CampaignLeadsController } from "../controllers/CampaignLeadsController";
import { GroupLeadsController } from "../controllers/GroupLeadsController";
import { PrismaLeadsRepository } from "../repositories/prisma/PrismaLeadsRepository";
import { PrismaGroupsRepository } from "../repositories/prisma/PrismaGroupsRepository";
import { PrismaCampaignsRepository } from "../repositories/prisma/PrismaCampaignsRepository";

const leadsRepository = new PrismaLeadsRepository();
const groupsRepository = new PrismaGroupsRepository();
const campaignsRepository = new PrismaCampaignsRepository();

export const leadsController = new LeadsController(leadsRepository);
export const groupsController = new GroupsController(groupsRepository);
export const groupLeadsController = new GroupLeadsController(
  groupsRepository,
  leadsRepository
);
export const campaignController = new CampaignController(campaignsRepository);
export const campaignLeadsController = new CampaignLeadsController(
  campaignsRepository,
  leadsRepository
);
