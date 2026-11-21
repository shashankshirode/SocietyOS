import React from "react";
import { screen } from "@testing-library/react-native";
import { renderWithProviders } from "../../../test/testUtils";
import { DataRow } from "../DataRow";
import { DataValue } from "../DataValue";
import { EmptyValue } from "../EmptyValue";
import { DataLabel } from "../DataLabel";
import { DataSection } from "../DataSection";
import { ThemeProvider } from "../../../core/theme/ThemeProvider";
import { formatSafeAmount } from "../dataDisplay.utils";
import { Text } from "react-native";

describe("Data Display and Missing Data Mappings", () => {
  it("DataValue falls back to empty label when value is undefined", async () => {
    await renderWithProviders(
      <ThemeProvider>
        <DataValue value={undefined} emptyContext="notProvided" />
      </ThemeProvider>,
    );

    expect(screen.getByText("Not provided")).toBeOnTheScreen();
  });

  it("DataValue renders the string when value is present", async () => {
    await renderWithProviders(
      <ThemeProvider>
        <DataValue value="A-1204" />
      </ThemeProvider>,
    );

    expect(screen.getByText("A-1204")).toBeOnTheScreen();
  });

  it("EmptyValue renders customized text based on EmptyValueContext", async () => {
    await renderWithProviders(
      <ThemeProvider>
        <EmptyValue context="notAssigned" />
      </ThemeProvider>,
    );

    expect(screen.getByText("Not assigned")).toBeOnTheScreen();
  });

  it("DataRow supports masking phone numbers", async () => {
    await renderWithProviders(
      <ThemeProvider>
        <DataRow label="Phone" value="7276834907" mask="mobile" />
      </ThemeProvider>,
    );

    expect(screen.getByText("72••••••07")).toBeOnTheScreen();
  });

  it("formatSafeAmount format rules match Indian locale currencies", () => {
    expect(formatSafeAmount(12500.5)).toBe("₹12,500.50");
    expect(formatSafeAmount(0)).toBe("₹0.00");
    expect(formatSafeAmount(null)).toBe("Not available");
  });

  it("renders DataLabel with text and required marker", async () => {
    await renderWithProviders(
      <ThemeProvider>
        <DataLabel text="Mobile Number" required />
      </ThemeProvider>,
    );

    expect(screen.getByText("Mobile Number *")).toBeOnTheScreen();
  });

  it("renders DataSection with title and child block content", async () => {
    await renderWithProviders(
      <ThemeProvider>
        <DataSection title="Resident Contact">
          <Text>Sub content</Text>
        </DataSection>
      </ThemeProvider>,
    );

    expect(screen.getByText("Resident Contact")).toBeOnTheScreen();
    expect(screen.getByText("Sub content")).toBeOnTheScreen();
  });
});
