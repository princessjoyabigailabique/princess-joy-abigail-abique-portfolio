export interface EducationPhoto {
  src: string;
  caption: string;
  alt?: string;
}

export interface EducationEntry {
  id: string;
  school: string;
  level: string;
  years: string;
  course?: string;
  highlights: string[];
  chapter: string;
  /** Add photos here as { src: "/images/education/<school>/01.jpg", caption: "..." }. */
  photoDirectory: string;
  photos: EducationPhoto[];
}

export const EDUCATION: EducationEntry[] = [
  {
    id: "phinma-saint-jude",
    school: "PHINMA Saint Jude College – Manila",
    level: "College · Fourth year",
    years: "2023–Present",
    course: "Bachelor of Science in Information Technology",
    highlights: ["Expected Graduation: 2027"],
    chapter: "Currently building on my IT foundation through studies in technology and hands-on academic work.",
    photoDirectory: "/images/education/phinma-saint-jude/",
    photos: [],
  },
  {
    id: "tanza-senior-high",
    school: "Tanza National Comprehensive High School",
    level: "Senior High School",
    years: "2021–2023",
    course: "Science, Technology, Engineering, and Mathematics (STEM)",
    highlights: ["With Honors", "94% General Average"],
    chapter: "My STEM strand provided a focused foundation in science, technology, engineering, and mathematics.",
    photoDirectory: "/images/education/tnchs-senior-high/",
    photos: [],
  },
  {
    id: "tanza-junior-high",
    school: "Tanza National Comprehensive High School",
    level: "Junior High School",
    years: "2017–2021",
    highlights: ["With Honors"],
    chapter: "A four-year chapter of secondary school and an important part of my academic foundation.",
    photoDirectory: "/images/education/tnchs-junior-high/",
    photos: [],
  },
  {
    id: "pasong-kawayan-elementary",
    school: "Pasong Kawayan II Elementary School",
    level: "Elementary School",
    years: "2011–2017",
    highlights: ["Class Achiever"],
    chapter: "The start of my school journey, where I built the foundations I carried into later studies.",
    photoDirectory: "/images/education/pasong-kawayan-ii-elementary/",
    photos: [],
  },
];
