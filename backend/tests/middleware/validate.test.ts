import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { validate } from "../../src/middleware/validate";

const schema = z.object({ body: z.object({ name: z.string() }) });

describe("validate", () => {
  it("valid bo'lsa next() ni chaqiradi", () => {
    const req: any = { body: { name: "Ali" }, query: {}, params: {} };
    const next = vi.fn();
    validate(schema)(req, {} as any, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("invalid bo'lsa next(error) ni chaqiradi", () => {
    const req: any = { body: {}, query: {}, params: {} };
    const next = vi.fn();
    validate(schema)(req, {} as any, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
