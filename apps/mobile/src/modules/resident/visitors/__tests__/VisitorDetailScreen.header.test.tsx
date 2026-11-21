import React from "react";
import { screen } from "@testing-library/react-native";
import { renderWithProviders } from "../../../../test/testUtils";
import { VisitorDetailScreen } from "../screens/VisitorDetailScreen";

jest.mock("../../../../core/mockStore/useMockStore", () => ({
  useMockStore: () => ({
    state: {
      visitors: [
        {
          id: "PASS-MOCK-1",
          name: "John Doe",
          phone: "1234567890",
          type: "GUEST" as const,
          status: "APPROVED" as const,
          expectedDate: "2026-07-07",
          expectedTime: "10:00 AM",
          flatNumber: "A-404",
          societyName: "Antigravity Heights",
          purpose: "Visiting flat owner",
          vehicleNumber: "KA-01-1234",
          otp: "123456",
          createdAt: "2026-07-07T10:00:00Z",
        }
      ]
    },
    updateVisitor: jest.fn()
  })
}));


const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};
const mockRoute = {
  params: {
    visitor: {
      id: "PASS-MOCK-1",
      name: "John Doe",
      phone: "1234567890",
      type: "GUEST" as const,
      status: "APPROVED" as const,
      expectedDate: "2026-07-07",
      expectedTime: "10:00 AM",
      flatNumber: "A-404",
      societyName: "Antigravity Heights",
      purpose: "Visiting flat owner",
      vehicleNumber: "KA-01-1234",
      otp: "123456",
      createdAt: "2026-07-07T10:00:00Z",
    },
  },
};

describe("VisitorDetailScreen Header Integration", () => {
  it("renders the visitor state as the narrative hero", async () => {
    await renderWithProviders(
      <VisitorDetailScreen navigation={mockNavigation} route={mockRoute} />,
    );

    
    expect(screen.getByText('VISITORS')).toBeOnTheScreen();
    expect(screen.getByText('John Doe is expected at 10:00 AM.')).toBeOnTheScreen();
  });
});
