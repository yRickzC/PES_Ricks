import { describe, expect, it } from "vitest";
import {
  getNextProjectStatus,
  isProjectStatus,
  projectStatuses,
} from "./project-status";

describe("project lifecycle", () => {
  it("keeps the documented status progression", () => {
    expect(projectStatuses).toEqual([
      "IDEA",
      "RESEARCH",
      "PROTOTYPE",
      "BUILDING",
      "ACTIVE",
      "SHIPPED",
      "ARCHIVED",
    ]);
  });

  it("recognizes only canonical project statuses", () => {
    expect(isProjectStatus("PROTOTYPE")).toBe(true);
    expect(isProjectStatus("prototype")).toBe(false);
    expect(isProjectStatus("PAUSED")).toBe(false);
  });

  it("returns the next status and ends at ARCHIVED", () => {
    expect(getNextProjectStatus("IDEA")).toBe("RESEARCH");
    expect(getNextProjectStatus("SHIPPED")).toBe("ARCHIVED");
    expect(getNextProjectStatus("ARCHIVED")).toBeUndefined();
  });
});