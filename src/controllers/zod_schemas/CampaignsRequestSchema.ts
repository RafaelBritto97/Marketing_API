import { z } from "zod";

const LeadCampaignStatusSchema = z.enum([
  "New",
  "Engaged",
  "FollowUp_Scheduled",
  "Contacted",
  "Converted",
  "Unresponsive",
  "Qualified",
  "Disqualified",
  "Re_Engaged",
  "Opted_Out",
]);

export const CreateCampaignRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
});

export const UpdateCampaignRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.date().optional(),
});

export const GetCampaignLeadsRequestSchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  name: z.string().optional(),
  status: LeadCampaignStatusSchema.optional(),
  sortBy: z.enum(["name", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]),
});

export const AddLeadRequestSchema = z.object({
  leadId: z.number(),
  status: LeadCampaignStatusSchema.optional(),
});

export const UpdateLeadStatusRequestSchema = z.object({
  status: LeadCampaignStatusSchema,
});
