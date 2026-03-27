import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";

describe("Hero", () => {
  it("renders headline and CTA", () => {
    render(<Hero onStart={() => {}} />);
    expect(screen.getByText(/Plan je daktent roadtrip/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start met plannen/i })).toBeInTheDocument();
  });

  it("renders trust indicators", () => {
    render(<Hero onStart={() => {}} />);
    expect(screen.getByText(/Klaar in 3 minuten/)).toBeInTheDocument();
    expect(screen.getByText(/20\+ kampeerplekken/)).toBeInTheDocument();
  });
});
