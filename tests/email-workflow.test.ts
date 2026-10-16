import test from "node:test";
import assert from "node:assert/strict";
import { estimateEmailConfidence, getEmailPriority, getEmailWorkflowSequence } from "../src/lib/email-workflow.ts";

test("low-confidence email takes the Human Review branch only", () => {
  const message = "Please help";
  const confidence = estimateEmailConfidence(message);
  const sequence = getEmailWorkflowSequence(confidence, "Medium");

  assert.ok(confidence < 0.8);
  assert.deepEqual(sequence, [0, 1, 2, 3, 4, 7], "index 7 is the Human Review step");
  assert.ok(!sequence.includes(5), "low-confidence route skips priority routing");
  assert.ok(!sequence.includes(6), "low-confidence route skips normal processing");
});

test("confidence at 0.80 continues through normal processing and then Human Review", () => {
  assert.deepEqual(getEmailWorkflowSequence(0.8, "Medium"), [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(getEmailWorkflowSequence(0.79, "Medium"), [0, 1, 2, 3, 4, 7]);
});

test("production website outage is Critical and routes to Telegram without Human Review", () => {
  const subject = "URGENT: Production Website Is Down";
  const message = "Our production website is completely down. Customers cannot log in or place orders, and all online sales have stopped. Please investigate immediately.";
  const priority = getEmailPriority(`${subject} ${message}`);

  assert.equal(priority, "Critical");
  assert.deepEqual(getEmailWorkflowSequence(0.91, priority), [0, 1, 2, 3, 4, 5, 6]);
});

test("demo maps sample content to Critical, High, Medium, and Low priorities", () => {
  assert.equal(getEmailPriority("Critical security breach reported"), "Critical");
  assert.equal(getEmailPriority("Urgent request, please help today"), "High");
  assert.equal(getEmailPriority("I need help with my damaged order"), "Medium");
  assert.equal(getEmailPriority("Sharing the weekly update"), "Low");
});
