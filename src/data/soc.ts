export interface SocOption { label: string; verdict: "best" | "partial" | "weak"; feedback: string }
export interface SocScenario {
  id: string; title: string; severity: "Low" | "Medium" | "High"; source: string; time: string; mitre: string;
  summary: string; logs: string[]; options: SocOption[]; nextEvidence: string[];
}

// ALL DATA BELOW IS FICTIONAL. Domains use RFC-reserved example names; IPs are documentation ranges.
export const SOC_SCENARIOS: SocScenario[] = [
  {
    id: "unfamiliar-signin", title: "Sign-in from an unfamiliar country", severity: "Medium", source: "Identity provider", time: "17:32:11", mitre: "T1078 — Valid Accounts",
    summary: "A user account signed in successfully from a country not seen in its recent history.",
    logs: [
      "17:32:11 signin SUCCESS user=a.sample@example.com ip=203.0.113.45 geo=Country-B mfa=not_prompted",
      "09:01:40 signin SUCCESS user=a.sample@example.com ip=198.51.100.20 geo=Country-A mfa=passed",
      "17:35:02 mailbox_rule_created user=a.sample@example.com rule=forward_all",
    ],
    options: [
      { label: "Close as a false positive — the sign-in succeeded", verdict: "weak", feedback: "A successful sign-in is exactly what a compromised account looks like. The new mailbox rule shortly after is an extra warning sign, so closing now would skip it." },
      { label: "Investigate: compare to history, check MFA, and review the new mailbox rule", verdict: "best", feedback: "Right track. Compare against the user’s normal locations and devices, confirm why MFA was not prompted, and review the forwarding rule created minutes later." },
      { label: "Reset every account in the company", verdict: "weak", feedback: "That is far out of proportion to one alert and disrupts everyone. Scope the single account first." },
    ],
    nextEvidence: ["Is travel or a VPN plausible for this user?", "Why was MFA not prompted (legacy protocol, trusted device)?", "Who created the forwarding rule, from which session?", "Other sign-ins from 203.0.113.45 across accounts."],
  },
  {
    id: "failed-logins", title: "Repeated failed logins then a success", severity: "High", source: "Authentication logs", time: "02:14:09", mitre: "T1110 — Brute Force",
    summary: "Many failed logins for one account from one address, followed by a success.",
    logs: [
      "02:13:41 auth FAIL user=svc.sample ip=192.0.2.77 reason=bad_password",
      "02:13:44 auth FAIL user=svc.sample ip=192.0.2.77 reason=bad_password",
      "02:13:47 auth FAIL user=svc.sample ip=192.0.2.77 reason=bad_password   (… 46 more)",
      "02:14:09 auth SUCCESS user=svc.sample ip=192.0.2.77",
    ],
    options: [
      { label: "Escalate: possible successful brute force; check what the account did after 02:14:09", verdict: "best", feedback: "Good call. A success right after a burst of failures suggests the password may have been guessed. Check post-login activity and whether the source is expected." },
      { label: "Ignore: failed logins are normal noise", verdict: "weak", feedback: "A few failures are noise; dozens in seconds from one IP followed by a success is a pattern worth escalating." },
      { label: "Only block the IP and close the ticket", verdict: "partial", feedback: "Blocking helps, but if the login succeeded the account may already be compromised. Verify what happened after the success before closing." },
    ],
    nextEvidence: ["Is 192.0.2.77 internal, a known scanner, or external?", "What did svc.sample access after 02:14:09?", "Is the account interactive-login enabled (should a service account log in this way)?"],
  },
  {
    id: "endpoint-powershell", title: "Suspicious process execution", severity: "Medium", source: "Endpoint telemetry", time: "16:21:08", mitre: "T1059.001 — PowerShell",
    summary: "PowerShell was launched by an Office application with an encoded command.",
    logs: [
      "16:21:08 process_create host=WS-014 parent=WINWORD.EXE child=powershell.exe",
      "16:21:08 cmdline powershell.exe -nop -w hidden -enc <base64-redacted>",
      "16:21:10 network_conn host=WS-014 dst=example-lookalike.test:443",
    ],
    options: [
      { label: "Treat as normal admin activity", verdict: "weak", feedback: "Office launching a hidden, encoded PowerShell followed by an outbound connection is unusual and rarely routine admin work." },
      { label: "Isolate per runbook, then decode the command and review the document that was opened", verdict: "best", feedback: "Reasonable. Contain according to your procedure, then decode the command and trace the opened file and its origin." },
      { label: "Delete the document immediately", verdict: "partial", feedback: "Deleting destroys evidence. Preserve the file and its hash first, then remediate." },
    ],
    nextEvidence: ["What document was opened and where did it come from (email, download)?", "Decoded command content.", "Other hosts contacting the same destination."],
  },
  {
    id: "phishing-indicator", title: "Link text doesn’t match destination", severity: "Medium", source: "Email gateway", time: "18:47:57", mitre: "T1566 — Phishing",
    summary: "An email shows a trusted-looking link, but the real URL points somewhere else.",
    logs: [
      "18:47:57 mail_delivered to=b.sample@example.com from=billing@example-lookalike.test display_name=\"Payroll Team\"",
      "18:47:57 url_check display_text=https://payroll.example.com real_url=https://payroll.example-lookalike.test/login verdict=suspicious",
    ],
    options: [
      { label: "Check header/sender mismatch, then quarantine and look for other recipients", verdict: "best", feedback: "Good. The display name vs sender domain differ and the URL is mismatched. Quarantine, find other recipients, and check if anyone clicked." },
      { label: "Ask the user to click the link to see if it’s safe", verdict: "weak", feedback: "Never have a user ‘test’ a suspicious link. Analyze it safely instead." },
      { label: "Mark safe because the display name looks internal", verdict: "weak", feedback: "Display names are trivially spoofed. Compare the actual sender domain and URL." },
    ],
    nextEvidence: ["Who else received this message?", "Did anyone click or submit credentials?", "Domain age and reputation of the lookalike domain."],
  },
];
