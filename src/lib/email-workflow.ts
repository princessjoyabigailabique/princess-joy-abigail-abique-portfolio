export function estimateEmailConfidence(message: string): number {
  const wordCount = message.trim().split(/\s+/).filter(Boolean).length;
  return wordCount < 8 ? 0.64 : 0.91;
}

export function getEmailPriority(text: string): "Critical" | "High" | "Medium" | "Low" {
  if (/\b(breach|critical|system down|outage|completely down|website (?:is )?down|production (?:website|site|system).{0,24}down|all online sales have stopped)\b/i.test(text)) return "Critical";
  if (/\b(urgent|asap|immediately|emergency|today)\b/i.test(text)) return "High";
  if (/\b(help|support|broken|damaged|issue|problem|refund|order|can't|unable)\b/i.test(text)) return "Medium";
  return "Low";
}

export function getEmailWorkflowSequence(confidence: number, priority: "Critical" | "High" | "Medium" | "Low"): number[] {
  if (confidence < 0.8) return [0, 1, 2, 3, 4, 7];
  if (priority === "Critical") return [0, 1, 2, 3, 4, 5, 6];
  return [0, 1, 2, 3, 4, 5, 6, 7];
}
