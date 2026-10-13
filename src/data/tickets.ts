export interface Stage { name: string; prompt: string; options: { label: string; good: boolean; why: string }[] }
export interface Ticket { id: string; requester: string; dept: string; issue: string; priority: "Low" | "Medium" | "High"; device: string; stages: Stage[]; resolution: string }

// ALL TICKETS ARE FICTIONAL TRAINING SCENARIOS.
export const TICKETS: Ticket[] = [
  {
    id: "#SIM-1001", requester: "Fictional User A", dept: "Accounting", issue: "Cannot access shared folder on the network.", priority: "Medium", device: "Windows 10 laptop (fictional)",
    stages: [
      { name: "Understand the issue", prompt: "What do you do first?", options: [
        { label: "Ask what exactly happens, when it started, and what changed", good: true, why: "Clear details narrow the cause and confirm what “cannot access” means (error message, one folder or all)." },
        { label: "Reinstall the operating system", good: false, why: "Far too drastic before knowing the problem." } ] },
      { name: "Impact & context", prompt: "Which context matters most?", options: [
        { label: "Is anyone else affected, and can the user reach other network resources?", good: true, why: "Tells you whether it’s one user, one device or a server/share problem." },
        { label: "Which browser the user prefers", good: false, why: "Not relevant to a network share." } ] },
      { name: "Isolate", prompt: "Choose an isolating step.", options: [
        { label: "Check basic connectivity: IP configuration and ping the gateway", good: true, why: "Confirms the device is on the network before looking at permissions." },
        { label: "Change the user’s permissions right away", good: false, why: "Don’t change access before confirming the cause." } ] },
      { name: "Test likely causes", prompt: "Connectivity is fine. What next?", options: [
        { label: "Verify the user’s permissions on the share and try accessing by name and by IP", good: true, why: "Separates a name-resolution issue from a permissions issue." },
        { label: "Restart the file server during work hours", good: false, why: "Disruptive and unjustified." } ] },
      { name: "Resolve or escalate", prompt: "The user is missing a group membership.", options: [
        { label: "Follow the approval process, add the group, and confirm with the user", good: true, why: "Access changes follow policy; confirm the fix with the user." },
        { label: "Give the user full access to everything", good: false, why: "Violates least privilege." } ] },
      { name: "Document", prompt: "What goes in the ticket?", options: [
        { label: "Symptoms, steps tested, root cause, fix, and confirmation", good: true, why: "Good notes help the next person and prevent repeat work." },
        { label: "“Fixed.”", good: false, why: "Too vague to reuse." } ] },
    ],
    resolution: "Root cause (fictional): missing group membership. Fix: approved group added; user confirmed access. Documented in ticket.",
  },
  {
    id: "#SIM-1002", requester: "Fictional User B", dept: "HR", issue: "Application closes immediately after opening.", priority: "Low", device: "Windows 11 desktop (fictional)",
    stages: [
      { name: "Understand the issue", prompt: "What do you do first?", options: [
        { label: "Ask for the app name, any error text, and when it last worked", good: true, why: "Gets the symptoms and a timeline." },
        { label: "Tell the user to wait and see", good: false, why: "Doesn’t progress the ticket." } ] },
      { name: "Impact & context", prompt: "What do you check?", options: [
        { label: "Recent updates or changes, and whether others see it", good: true, why: "A recent change is a common trigger." },
        { label: "The user’s lunch schedule", good: false, why: "Irrelevant." } ] },
      { name: "Isolate", prompt: "Choose a step.", options: [
        { label: "Check Event Viewer for the application error and try a different user profile", good: true, why: "Logs point to the failing component; a second profile separates profile from system issues." },
        { label: "Delete the application folder", good: false, why: "Destructive guesswork." } ] },
      { name: "Test likely causes", prompt: "Log shows a missing component.", options: [
        { label: "Repair the app / install the missing component, then retest", good: true, why: "Targets the identified cause." },
        { label: "Disable the antivirus permanently", good: false, why: "Unsafe and unrelated." } ] },
      { name: "Resolve or escalate", prompt: "It still fails after repair.", options: [
        { label: "Escalate to the application owner with logs and steps tried", good: true, why: "Escalate with evidence so they don’t repeat your work." },
        { label: "Close the ticket", good: false, why: "The issue isn’t resolved." } ] },
      { name: "Document", prompt: "What do you record?", options: [
        { label: "Error text, logs checked, steps tried, escalation target", good: true, why: "Makes the handoff clear." },
        { label: "Nothing, it’s escalated", good: false, why: "Documentation is part of the job." } ] },
    ],
    resolution: "Outcome (fictional): repaired component, still failing, escalated with logs and steps tried.",
  },
];
