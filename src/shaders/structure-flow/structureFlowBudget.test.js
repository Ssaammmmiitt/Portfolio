import { describe, expect, it } from "vitest";
import { getStructureFlowCount } from "./structureFlowBudget.js";

describe("getStructureFlowCount", () => {
  it("returns lighter budgets for phones and compact viewports", () => {
    const phone = getStructureFlowCount({ phone: true, compact: true });
    const compact = getStructureFlowCount({ phone: false, compact: true });
    const desktop = getStructureFlowCount({ phone: false, compact: false });

    expect(phone).toBeLessThan(compact);
    expect(compact).toBeLessThanOrEqual(desktop);
    expect(desktop).toBeLessThanOrEqual(5500);
  });
});
