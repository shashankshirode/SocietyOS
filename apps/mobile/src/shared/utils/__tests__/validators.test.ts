import {
  isPositiveNumber,
  isRequired,
  isValidEmail,
  isValidIndianMobile,
  isValidVehicleNumber,
  minLength,
} from "../validators";

describe("validators", () => {
  it("validates required text", () => {
    expect(isRequired("A-1204")).toBe(true);
    expect(isRequired("   ")).toBe(false);
  });

  it("validates Indian mobile numbers", () => {
    expect(isValidIndianMobile("7276834907")).toBe(true);
    expect(isValidIndianMobile("9123456789")).toBe(true);
    expect(isValidIndianMobile("")).toBe(false);
    expect(isValidIndianMobile("12345")).toBe(false);
    expect(isValidIndianMobile("72768349071")).toBe(false);
    expect(isValidIndianMobile("abcdefghij")).toBe(false);
  });

  it("validates emails", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@gmail.com")).toBe(true);
    expect(isValidEmail("test")).toBe(false);
    expect(isValidEmail("test@")).toBe(false);
    expect(isValidEmail("@gmail.com")).toBe(false);
  });

  it("validates vehicle numbers", () => {
    expect(isValidVehicleNumber("MH15AB1234")).toBe(true);
    expect(isValidVehicleNumber("MH 15 AB 1234")).toBe(true);
    expect(isValidVehicleNumber("MH12CD9090")).toBe(true);
    expect(isValidVehicleNumber("MH")).toBe(false);
    expect(isValidVehicleNumber("1234")).toBe(false);
    expect(isValidVehicleNumber("ABCD")).toBe(false);
    expect(isValidVehicleNumber("")).toBe(false);
  });

  it("validates min length and positive numbers", () => {
    expect(minLength("reason", 4)).toBe(true);
    expect(minLength("no", 4)).toBe(false);
    expect(isPositiveNumber("3")).toBe(true);
    expect(isPositiveNumber(0)).toBe(false);
  });
});
