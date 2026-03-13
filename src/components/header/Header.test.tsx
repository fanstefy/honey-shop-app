// src/components/header/Header.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header";
import * as ReactResponsive from "react-responsive";

// Mock child components for simplicity
jest.mock("./LargeScreenHeader", () => () => <div>LargeScreenHeader</div>);
jest.mock("./SmallScreenHeader", () => () => <div>SmallScreenHeader</div>);

describe("Header component", () => {
  it("renders LargeScreenHeader when screen is large", () => {
    // Mock useMediaQuery to return true
    jest.spyOn(ReactResponsive, "useMediaQuery").mockReturnValue(true);

    render(<Header />);
    expect(screen.getByText("LargeScreenHeader")).toBeInTheDocument();
  });

  it("renders SmallScreenHeader when screen is small", () => {
    // Mock useMediaQuery to return false
    jest.spyOn(ReactResponsive, "useMediaQuery").mockReturnValue(false);

    render(<Header />);
    expect(screen.getByText("SmallScreenHeader")).toBeInTheDocument();
  });
});
