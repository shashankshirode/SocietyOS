import React from "react";
import { Text } from "react-native";
import { fireEvent, screen } from "@testing-library/react-native";
import { renderWithProviders } from "../../../test/testUtils";
import { enMessages } from "../../../messages/en";

import { AppButton } from "../AppButton";
import { AppCard } from "../../cards/AppCard";
import { QuickActionCard } from "../../cards/QuickActionCard";
import { ListItemCard } from "../../cards/ListItemCard";
import { MetricCard } from "../../cards/MetricCard";
import { StatusBadge } from "../StatusBadge";
import { FormField } from "../../forms/FormField";
import { SafeTextRow } from "../../layout/SafeTextRow";
import { ResponsiveGrid } from "../../layout/ResponsiveGrid";
import { EmptyState } from "../../feedback/EmptyState";
import { ErrorState } from "../../feedback/ErrorState";
import { SuccessState } from "../../feedback/SuccessState";
import { LogoutButton } from "../LogoutButton";

import { validateVisitorForm } from "../../../modules/resident/visitors/validators/visitors.validators";
import { validateComplaintForm } from "../../../modules/resident/complaints/validators/complaints.validators";
import { validateNotice } from "../../../modules/societyAdmin/validators/societyAdmin.validators";
import {
  validateManualPayment,
  validateBillingCycle,
} from "../../../modules/accounting/validators/accounting.validators";
import { validateNocRequest } from "../../../modules/resident/noc/validators/noc.validators";

describe("UI Regression Tests - Shared Components", () => {
  it("handles AppButton with long labels gracefully", async () => {
    const longLabel =
      "This is a very long button label that should not cause layout overflow or line wrapping issues";
    await renderWithProviders(
      <AppButton title={longLabel} onPress={jest.fn()} />,
    );
    expect(screen.getByText(longLabel)).toBeOnTheScreen();
  });

  it("handles AppCard with long title gracefully", async () => {
    const longTitle =
      "Super Long Card Title for Testing Regression Safety and Visual Layout Overlap";
    await renderWithProviders(
      <AppCard>
        <Text>{longTitle}</Text>
      </AppCard>,
    );
    expect(screen.getByText(longTitle)).toBeOnTheScreen();
  });

  it("handles QuickActionCard with long title/subtitle gracefully", async () => {
    const longTitle = "Very Long Quick Action Card Title";
    const longSubtitle = "Very Long Subtitle Description";
    await renderWithProviders(
      <QuickActionCard
        title={longTitle}
        subtitle={longSubtitle}
        iconName="visitor"
        onPress={jest.fn()}
      />,
    );
    expect(screen.getByText(longTitle)).toBeOnTheScreen();
  });

  it("renders ListItemCard with title, badge and right content correctly", async () => {
    await renderWithProviders(
      <ListItemCard
        title="John Doe"
        subtitle="Delivery Partner"
        right={<Text>Right Element</Text>}
      />,
    );
    expect(screen.getByText("John Doe")).toBeOnTheScreen();
    expect(screen.getByText("Right Element")).toBeOnTheScreen();
  });

  it("renders MetricCard with large amount format", async () => {
    await renderWithProviders(
      <MetricCard
        label="Outstanding Balance"
        value="₹1,250,500"
        helperText="+12% from last month"
      />,
    );
    expect(screen.getByText("Outstanding Balance")).toBeOnTheScreen();
    expect(screen.getByText("₹1,250,500")).toBeOnTheScreen();
  });

  it("handles StatusBadge with long status labels", async () => {
    await renderWithProviders(
      <StatusBadge status="PENDING_ACKNOWLEDGEMENT" moduleType="notice" />,
    );
    expect(screen.getByText("Pending Acknowledgement")).toBeOnTheScreen();
  });

  it("renders FormField with long error text", async () => {
    const errorText =
      "The input field value you entered is extremely long and invalid for general formatting";
    await renderWithProviders(
      <FormField
        label="Phone Number"
        value=""
        onChangeText={jest.fn()}
        error={errorText}
      />,
    );
    expect(screen.getByText(errorText)).toBeOnTheScreen();
  });

  it("renders SafeTextRow with long title and metadata without truncation issues", async () => {
    const longTitle = "Main Gate Access Authorization Form";
    await renderWithProviders(<SafeTextRow title={longTitle} />);
    expect(screen.getByText(longTitle)).toBeOnTheScreen();
  });

  it("renders ResponsiveGrid with multiple children", async () => {
    await renderWithProviders(
      <ResponsiveGrid columnsPhone={2} gap={10}>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
      </ResponsiveGrid>,
    );
    expect(screen.getByText("Child 1")).toBeOnTheScreen();
    expect(screen.getByText("Child 2")).toBeOnTheScreen();
  });

  it("renders EmptyState with a CTA action button", async () => {
    const onAction = jest.fn();
    await renderWithProviders(
      <EmptyState
        title="No Vehicles Found"
        description="Add a vehicle to get started"
        actionLabel="Add Vehicle"
        onAction={onAction}
      />,
    );
    const btn = screen.getByText("Add Vehicle");
    expect(btn).toBeOnTheScreen();
    fireEvent.press(btn);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("renders ErrorState with a retry button", async () => {
    const onRetry = jest.fn();
    await renderWithProviders(
      <ErrorState
        title="Network Error"
        message="Unable to load data"
        onRetry={onRetry}
      />,
    );
    const retryBtn = screen.getByText(enMessages.common.retry);
    expect(retryBtn).toBeOnTheScreen();
    fireEvent.press(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders SuccessState with action buttons", async () => {
    const onDone = jest.fn();
    await renderWithProviders(
      <SuccessState
        title="Task Completed"
        message="Pass created successfully"
        actionLabel="Go to Home"
        onAction={onDone}
      />,
    );
    const btn = screen.getByText("Go to Home");
    expect(btn).toBeOnTheScreen();
    fireEvent.press(btn);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("renders LogoutButton and triggers callback", async () => {
    await renderWithProviders(<LogoutButton onConfirmLogout={jest.fn()} />);
    expect(screen.getByText("Logout")).toBeOnTheScreen();
  });
});

describe("UI Regression Tests - Module Validators", () => {
  it("validates visitor creation forms correctly", () => {
    const invalidResult = validateVisitorForm({
      name: "",
      phone: "invalid-phone",
      type: "",
      expectedDate: "",
      expectedTime: "",
      purpose: "",
    });
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.fieldErrors.name).toBeDefined();
    expect(invalidResult.fieldErrors.phone).toBeDefined();

    const validResult = validateVisitorForm({
      name: "John Doe",
      phone: "7276834907",
      type: "GUEST",
      expectedDate: "2026-07-15",
      expectedTime: "18:00",
      purpose: "Meeting",
    });
    expect(validResult.isValid).toBe(true);
  });

  it("validates complaints correctly", () => {
    const invalidResult = validateComplaintForm({
      category: "",
      title: "",
      description: "short",
      priority: "",
      location: "",
    });
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.fieldErrors.description).toContain("15");

    const validResult = validateComplaintForm({
      category: "PLUMBING",
      title: "Water Leakage",
      description:
        "The kitchen sink has a severe water leakage since yesterday morning.",
      priority: "HIGH",
      location: "Block A, 1204",
    });
    expect(validResult.isValid).toBe(true);
  });

  it("validates notice publishing correctly", () => {
    const invalidResult = validateNotice("", "");
    expect(invalidResult.isValid).toBe(false);

    const validResult = validateNotice(
      "Annual Meeting Notice",
      "The AGM is scheduled for August 15th.",
    );
    expect(validResult.isValid).toBe(true);
  });

  it("validates billing cycle and payments correctly", () => {
    const invalidBilling = validateBillingCycle("", "", "", "");
    expect(invalidBilling.isValid).toBe(false);

    const validBilling = validateBillingCycle(
      "August 2026",
      "2026-08-01",
      "2026-08-31",
      "2026-08-15",
    );
    expect(validBilling.isValid).toBe(true);

    const invalidPayment = validateManualPayment("", "abc", "ONLINE", "");
    expect(invalidPayment.isValid).toBe(false);

    const validPayment = validateManualPayment("A-1204", "5000", "CASH", "");
    expect(validPayment.isValid).toBe(true);
  });

  it("validates NOC requests correctly", () => {
    const invalidNoc = validateNocRequest({
      nocType: "",
      reason: "too short",
      flat: "",
      requiredDate: "",
    });
    expect(invalidNoc.isValid).toBe(false);

    const validNoc = validateNocRequest({
      nocType: "NO_DUES",
      reason: "Required for bank loan clearance and certificate updates.",
      flat: "A-1204",
      requiredDate: "2026-07-15",
    });
    expect(validNoc.isValid).toBe(true);
  });
});
