import test from "node:test";
import assert from "node:assert/strict";
import { contactSchema } from "../src/lib/contact-schema.ts";

const valid = { name: "Test User", email: "test@example.com", inquiryType: "General question", subject: "Hello", message: "This is a valid message." };

test("accepts a valid inquiry", () => assert.equal(contactSchema.safeParse(valid).success, true));
test("rejects invalid email", () => assert.equal(contactSchema.safeParse({ ...valid, email: "nope" }).success, false));
test("rejects short message", () => assert.equal(contactSchema.safeParse({ ...valid, message: "short" }).success, false));
test("rejects filled honeypot", () => assert.equal(contactSchema.safeParse({ ...valid, website: "spam" }).success, false));
test("rejects unknown inquiry type", () => assert.equal(contactSchema.safeParse({ ...valid, inquiryType: "x" }).success, false));
