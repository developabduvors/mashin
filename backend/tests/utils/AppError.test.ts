import { describe, it, expect } from "vitest";
import { AppError } from "../../src/utils/AppError";

describe("AppError", () => {
  it("statusCode, code va message saqlaydi", () => {
    const err = new AppError("Topilmadi", 404, "NOT_FOUND");
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe("NOT_FOUND");
    expect(err.message).toBe("Topilmadi");
    expect(err).toBeInstanceOf(Error);
  });
});
