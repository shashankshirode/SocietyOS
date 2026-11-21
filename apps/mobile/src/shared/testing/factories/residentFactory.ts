import type { ResidentProfile } from "../../types/resident.types";

export function createResident(
  overrides: Partial<ResidentProfile> = {},
): ResidentProfile {
  return {
    id: "res-101",
    name: "Rajesh Kumar",
    role: "OWNER",
    societyName: "Green Valley Heights Phase 2 Cooperative Housing Society",
    tower: "Tower A",
    flatNumber: "A-1204",
    city: "Mumbai",
    memberSince: "2022-04-15",
    phone: "7276834907",
    email: "rajesh.kumar@email.com",
    ...overrides,
  };
}
