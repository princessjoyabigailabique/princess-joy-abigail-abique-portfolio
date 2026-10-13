import test from "node:test";
import assert from "node:assert/strict";
import { validCalendlyUrl } from "../src/data/site.ts";

test("accepts https calendly.com event URLs", () => {
  assert.equal(validCalendlyUrl("https://calendly.com/someone/discovery-call"), true);
  assert.equal(validCalendlyUrl("https://www.calendly.com/someone"), true);
});
test("rejects non-calendly, non-https, lookalike and malformed URLs", () => {
  for (const u of ["http://calendly.com/x", "https://evil.example/calendly.com", "https://calendly.com.evil.example/x", "javascript:alert(1)", "", "not a url"])
    assert.equal(validCalendlyUrl(u), false, u);
});
