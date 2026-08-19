import {
  mapSociety,
  mapOnboardingDraft,
  mapFeatureFlag,
  mapTicket,
} from "../data/superAdmin.mapper";
import type {
  PlatformSociety,
  SocietyOnboardingDraft,
  PlatformFeatureFlag,
} from "../../../shared/types/platformSociety.types";
import type { SupportTicket } from "../../../shared/types/platformSupport.types";

describe("Super Admin Mappers", () => {
  it("correctly maps society DTO to domain model", () => {
    const dto: PlatformSociety = {
      id: "soc-001",
      name: "Green Valley Heights",
      city: "Nashik",
      state: "Maharashtra",
      type: "COOPERATIVE_HOUSING_SOCIETY",
      status: "ACTIVE",
      planCode: "FREE_LAUNCH",
      billingMode: "DISABLED",
      totalUnits: 300,
      activeUsers: 842,
      enabledModulesCount: 18,
      createdAt: "2025-01-15T00:00:00Z",
    };

    const result = mapSociety(dto);
    expect(result).toEqual(dto);
  });

  it("correctly maps onboarding draft DTO to domain model", () => {
    const dto: SocietyOnboardingDraft = {
      id: "onb-001",
      societyName: "Riverfront Residency",
      societyType: "GATED_APARTMENT",
      city: "Pune",
      state: "Maharashtra",
      numberOfTowersWings: 5,
      approximateUnitCount: 520,
      primaryContactName: "Rajesh Patil",
      primaryContactMobile: "7276834907",
      primaryContactEmail: "rajesh.p@example.com",
      initialAdminEmail: "admin@riverfront.example.com",
      launchMode: "FREE_LAUNCH",
      defaultLanguage: "en",
      enabledModuleTemplate: "GATED_APARTMENT",
      status: "REVIEW",
      createdAt: "2026-06-01T10:00:00Z",
      updatedAt: "2026-06-28T14:00:00Z",
    };

    const result = mapOnboardingDraft(dto);
    expect(result).toEqual(dto);
  });

  it("correctly maps feature flag DTO to domain model", () => {
    const dto: PlatformFeatureFlag = {
      flagKey: "visitorManagement",
      displayName: "Visitor Management",
      moduleGroup: "Core",
      scope: "SOCIETY",
      defaultValue: true,
      environmentPlaceholder: "production",
      riskLevel: "LOW",
    };

    const result = mapFeatureFlag(dto);
    expect(result).toEqual(dto);
  });

  it("correctly maps support ticket DTO to domain model", () => {
    const dto: SupportTicket = {
      id: "tkt-001",
      ticketNumber: "SUP-2026-0001",
      societyId: "soc-001",
      societyName: "Green Valley Heights",
      category: "TECHNICAL_ISSUE",
      priority: "HIGH",
      status: "IN_PROGRESS",
      subject: "Visitor pass QR code not generating",
      description: "Multiple residents reporting QR codes are blank",
      createdBy: "Secretary - Green Valley",
      slaStatus: "WITHIN_SLA",
      lastUpdate: "2026-06-30T09:00:00Z",
      createdAt: "2026-06-29T14:00:00Z",
    };

    const result = mapTicket(dto);
    expect(result).toEqual(dto);
  });
});
