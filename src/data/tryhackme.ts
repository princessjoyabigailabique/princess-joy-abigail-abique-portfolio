export type Perspective = "Cybersecurity" | "AI & Automation" | "Networking" | "IT Support / System Administration" | "Unclassified";

export type TryHackMeRoom = {
  title: string;
  url: string;
  status: "completed";
  primaryPerspective: Perspective;
  secondaryPerspectives?: Perspective[];
  topics: string[];
  description: string;
};

const room = (title: string, slug: string, primaryPerspective: Perspective, topics: string[], description: string, secondaryPerspectives?: Perspective[]): TryHackMeRoom => ({
  title, url: `https://tryhackme.com/room/${slug}`, status: "completed", primaryPerspective, topics, description,
  ...(secondaryPerspectives?.length ? { secondaryPerspectives } : {}),
});

// Verified against the Completed rooms list on tryhackme.com/p/Pr1Nc3ssJ0y (77 rooms).
export const TRYHACKME_ROOMS: TryHackMeRoom[] = [
  room("Linux Fundamentals Part 1", "linuxfundamentalspart1", "IT Support / System Administration", ["Linux", "Operating systems"], "Practice essential Linux commands in an interactive terminal."),
  room("Linux Fundamentals Part 2", "linuxfundamentalspart2", "IT Support / System Administration", ["Linux", "SSH", "Command line"], "Continue Linux practice with SSH, commands and file system navigation."),
  room("Linux Fundamentals Part 3", "linuxfundamentalspart3", "IT Support / System Administration", ["Linux", "Command line"], "Use common Linux utilities for everyday system tasks."),
  room("Windows Fundamentals 1", "windowsfundamentals1xbx", "IT Support / System Administration", ["Windows", "Operating systems"], "Explore the Windows desktop, NTFS, UAC and Control Panel."),
  room("Windows Fundamentals 2", "windowsfundamentals2x0x", "IT Support / System Administration", ["Windows", "System configuration"], "Learn about System Configuration, UAC, Resource Monitor and the Registry."),
  room("What is Networking?", "whatisnetworking", "Networking", ["Networking fundamentals"], "An introduction to the fundamentals of computer networking."),
  room("Windows Fundamentals 3", "windowsfundamentals3xzx", "IT Support / System Administration", ["Windows", "Endpoint security"], "Explore built-in Windows security and maintenance tools."),
  room("Search Skills", "searchskills", "Unclassified", ["Research"], "Practice efficient web searching and using technical documentation."),
  room("Careers in Cyber", "careersincyber5zy1sk0al", "Cybersecurity", ["Security careers"], "Explore roles and career paths in cybersecurity."),

  room("Junior Security Analyst Intro", "jrsecanalystintrouxo", "Cybersecurity", ["SOC", "Security analyst"], "Get an introduction to the daily work of a junior security analyst."),
  room("SOC L1 Alert Triage", "socl1alerttriage", "Cybersecurity", ["SOC", "Alert triage"], "Build a systematic approach to investigating and triaging SOC alerts."),
  room("SOC L1 Alert Reporting", "socl1alertreporting", "Cybersecurity", ["SOC", "Incident reporting"], "Practice documenting, escalating and communicating security alerts."),
  room("SOC Workbooks and Lookups", "socworkbookslookups", "Cybersecurity", ["SOC", "Investigation resources"], "Explore resources that help structure and speed up Level 1 alert triage."),
  room("SOC Metrics and Objectives", "socmetricsobjectives", "Cybersecurity", ["SOC", "Security operations"], "Learn about metrics used to understand SOC effectiveness."),
  room("Humans as Attack Vectors", "humansattackvectors", "Cybersecurity", ["Threat analysis", "Social engineering"], "Understand how people can be targeted and how defenders respond."),
  room("Systems as Attack Vectors", "systemsattackvectors", "Cybersecurity", ["Threat analysis", "System security"], "Explore how vulnerable or misconfigured systems can be exploited."),
  room("SOC Role in Blue Team", "socroleinblueteam", "Cybersecurity", ["SOC", "Blue team"], "Learn how SOC roles contribute to defensive security operations."),
  room("Introduction to EDR", "introductiontoedrs", "Cybersecurity", ["EDR", "Endpoint security"], "Explore endpoint detection and response concepts and features."),

  room("Tutorial", "tutorial", "Unclassified", ["TryHackMe orientation"], "An introductory room for getting started with TryHackMe."),
  room("Principles of Security", "principlesofsecurity", "Cybersecurity", ["Security fundamentals"], "Learn core information security principles and how they protect systems and data."),
  room("Pyramid Of Pain", "pyramidofpainax", "Cybersecurity", ["Threat intelligence", "Threat analysis"], "Understand indicator types and how difficult they are for an adversary to change."),
  room("Cyber Kill Chain", "cyberkillchainzmt", "Cybersecurity", ["Attack frameworks", "Threat analysis"], "Use the Cyber Kill Chain model to reason about stages of an intrusion."),
  room("Elastic Stack: The Basics", "investigatingwithelk101", "Cybersecurity", ["SIEM", "Log analysis", "Elastic Stack"], "Learn how the Elastic Stack can support security log investigations."),
  room("Unified Kill Chain", "unifiedkillchain", "Cybersecurity", ["Attack frameworks", "Threat analysis"], "Explore a framework for describing attack phases and identifying risks."),
  room("Introduction to SIEM", "introtosiem", "Cybersecurity", ["SIEM", "Security monitoring"], "Learn SIEM fundamentals, features and how security events are monitored."),
  room("Introduction to SOAR", "soar", "Cybersecurity", ["SOAR", "Security automation"], "Explore security orchestration, automation and response concepts.", ["AI & Automation"]),
  room("Splunk: The Basics", "splunk101", "Cybersecurity", ["SIEM", "Log analysis", "Splunk"], "Learn how Splunk is used to search and investigate logs."),

  room("MITRE", "mitre", "Cybersecurity", ["MITRE ATT&CK", "Threat intelligence"], "Explore resources and frameworks from MITRE used by the cybersecurity community."),
  room("Phishing Analysis Fundamentals", "phishingemails1tryoe", "Cybersecurity", ["Phishing", "Email security"], "Identify the components and indicators found in suspicious emails."),
  room("Phishing Analysis Tools", "phishingemails3tryoe", "Cybersecurity", ["Phishing", "Investigation tools"], "Explore tools that help analysts investigate suspicious emails."),
  room("Pentesting Fundamentals", "pentestingfundamentals", "Cybersecurity", ["Penetration testing", "Security fundamentals"], "Learn about the ethics and methodologies behind penetration testing."),
  room("Phishing Emails in Action", "phishingemails2rytmuv", "Cybersecurity", ["Phishing", "Email security"], "Examine phishing examples and identify indicators of malicious messages."),
  room("Eviction", "eviction", "Cybersecurity", ["Incident response", "Threat hunting"], "Explore a threat-hunting challenge focused on finding an intruder."),
  room("Summit", "summit", "Cybersecurity", ["Threat hunting", "Pyramid of Pain"], "Follow a simulated adversary through the Pyramid of Pain."),
  room("Training Impact on Teams", "training", "Cybersecurity", ["Security awareness"], "Consider how security training affects teams and organizations."),
  room("Senior Security Analyst Intro", "seniorsecanalystintro", "Cybersecurity", ["SOC", "Security analyst"], "Get an introduction to the responsibilities of a senior security analyst."),

  room("Phishing Prevention", "phishingemails4gkxh", "Cybersecurity", ["Phishing", "Prevention"], "Learn practical ways to defend against phishing emails."),
  room("The Greenholt Phish", "phishingemails5fgjlzxc", "Cybersecurity", ["Phishing", "Email investigation"], "Analyze a suspicious email using phishing investigation skills."),
  room("Hack2Win: How you can grab extra tickets", "hack2win", "Unclassified", ["TryHackMe event"], "A TryHackMe event room about completing rooms and earning event tickets."),
  room("Virtualisation Basics", "virtualisationbasics", "IT Support / System Administration", ["Virtualisation", "Systems"], "Learn why virtualization is used to run isolated computing environments."),
  room("Cloud Computing Fundamentals", "cloudcomputingfundamentals", "IT Support / System Administration", ["Cloud", "Infrastructure"], "Explore how cloud computing provides flexible, scalable infrastructure."),
  room("Client-Server Basics", "clientserverbasics", "Networking", ["Client-server", "Network services"], "Learn the basics of communication between clients and servers.", ["IT Support / System Administration"]),
  room("Inside a Computer System", "insideacomputer", "IT Support / System Administration", ["Computing fundamentals", "Hardware"], "Explore the fundamental components inside a computer system."),
  room("Computer Types", "computertypes", "IT Support / System Administration", ["Computing fundamentals", "Hardware"], "Compare different types of computers, from laptops to embedded devices."),
  room("AI Security Path Ticketing Event", "aisecuritypathticketingevent", "AI & Automation", ["AI security", "Event"], "A TryHackMe event room associated with the AI Security Path.", ["Cybersecurity"]),

  room("Operating System Security", "operatingsystemsecurity", "IT Support / System Administration", ["Operating systems", "System security"], "Learn operating system security concepts, including Linux SSH authentication."),
  room("Operating Systems: Introduction", "operatingsystemsintroduction", "IT Support / System Administration", ["Operating systems"], "Explore operating system fundamentals and the features that power computers."),
  room("Linux CLI Basics", "linuxclibasics", "IT Support / System Administration", ["Linux", "Command line"], "Practice navigating and working in the Linux command line."),
  room("Data Representation", "datarepresentation", "IT Support / System Administration", ["Computing fundamentals", "Data"], "Learn how computers represent numbers and colors."),
  room("Data Encoding", "dataencoding", "IT Support / System Administration", ["Computing fundamentals", "Data"], "Explore how computers encode characters, from ASCII to Unicode."),
  room("JavaScript: Simple Demo", "javascriptsimpledemo", "IT Support / System Administration", ["Programming fundamentals", "JavaScript"], "See what a basic JavaScript program looks like."),
  room("Python: Simple Demo", "pythonsimpledemo", "IT Support / System Administration", ["Programming fundamentals", "Python"], "See what a basic Python program looks like."),
  room("Windows Basics", "windowsbasics", "IT Support / System Administration", ["Windows", "Operating systems"], "Practice navigating Windows and using essential system tools."),
  room("Windows CLI Basics", "windowsclibasics", "IT Support / System Administration", ["Windows", "Command line"], "Learn how to navigate and interact with Windows using its command line."),

  room("How Websites Work", "howwebsiteswork", "Networking", ["Web fundamentals", "HTTP"], "Learn the basic components involved when a browser requests a website.", ["Cybersecurity"]),
  room("Putting it all together", "puttingitalltogether", "Networking", ["Web fundamentals", "Network services"], "See how web components work together to deliver a website."),
  room("DNS in Detail", "dnsindetail", "Networking", ["DNS", "Network services"], "Learn how DNS resolves names to help users reach internet services."),
  room("HTTP in Detail", "httpindetail", "Networking", ["HTTP", "Network protocols"], "Explore how HTTP requests and responses transfer web content."),
  room("Intro to LAN", "introtolan", "Networking", ["LAN", "Network fundamentals"], "Learn about the technologies and designs used in private networks."),
  room("OSI Model", "osimodelzi", "Networking", ["OSI model", "Network fundamentals"], "Understand the layers used to describe network communication."),
  room("Packets & Frames", "packetsframes", "Networking", ["Packets", "Network fundamentals"], "Learn how data is divided and transmitted between network devices."),
  room("Extending Your Network", "extendingyournetwork", "Networking", ["Network infrastructure", "Network services"], "Explore technologies that extend networks onto the internet."),
  room("Database SQL Basics", "databasesqlbasics", "IT Support / System Administration", ["Databases", "SQL", "Data"], "Learn introductory SQL queries for retrieving and managing data."),

  room("Web Application Security", "introwebapplicationsecurity", "Cybersecurity", ["Web security", "Vulnerability assessment"], "Explore web applications and common security issues."),
  room("Windows Command Line", "windowscommandline", "IT Support / System Administration", ["Windows", "Command line"], "Practice essential commands in the Windows command line."),
  room("The CIA Triad", "theciatriad", "Cybersecurity", ["Security fundamentals", "CIA triad"], "Understand confidentiality, integrity and availability in security."),
  room("Cryptography Concepts", "cryptographyconcepts", "Cybersecurity", ["Cryptography", "Security fundamentals"], "Learn how cryptography supports everyday digital security."),
  room("Become a Hacker", "becomeahacker", "Cybersecurity", ["Offensive security", "Security fundamentals"], "Explore the ethical hacker mindset and improve a web application in a safe lab."),
  room("Become a Defender", "becomeadefender", "Cybersecurity", ["Defensive security", "Security fundamentals"], "Explore defensive security and protecting systems from attacks."),
  room("Offensive Security Intro", "offensivesecurityintrokKx12", "Cybersecurity", ["Offensive security"], "Try a first ethical hacking exercise in a safe environment."),
  room("Defensive Security Intro", "defensivesecurityintroezn39", "Cybersecurity", ["Defensive security"], "Explore how defenders protect systems and respond to attacks."),
  room("The Concierge Knows Too Much", "hh-theconciergeknows-2d7eb4d9", "Unclassified", ["TryHackMe challenge"], "A challenge room centered on a fictional concierge scenario."),

  room("Active Directory Basics", "winadbasics", "IT Support / System Administration", ["Active Directory", "Identity and access"], "Learn basic concepts and functionality provided by Active Directory."),
  room("Security Engineer Intro", "securityengineerintro", "Cybersecurity", ["Security engineering", "Security careers"], "Explore what a security engineer does in a typical day."),
  room("Logs Fundamentals", "logsfundamentals", "Cybersecurity", ["Log analysis", "Security monitoring"], "Learn what logs are and how analysts use them in investigations."),
  room("Windows PowerShell", "windowspowershell", "IT Support / System Administration", ["Windows", "PowerShell", "Command line"], "Learn the basics of PowerShell and its system administration capabilities."),
  room("Linux Shells", "linuxshells", "IT Support / System Administration", ["Linux", "Shells", "Command line"], "Explore Linux shell types and scripting fundamentals."),
];

export const TRYHACKME_PERSPECTIVES: Perspective[] = ["Cybersecurity", "AI & Automation", "Networking", "IT Support / System Administration"];

export const roomsForPerspective = (perspective: Perspective) => TRYHACKME_ROOMS.filter((item) => item.primaryPerspective === perspective || item.secondaryPerspectives?.includes(perspective));
