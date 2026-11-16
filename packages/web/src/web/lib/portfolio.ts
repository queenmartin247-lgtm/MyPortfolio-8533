export type Project = {
  title: string;
  shortTitle?: string;
  kind?: string;
  category: string;
  year: string;
  description: string;
  role: string;
  outcome: string;
};
export type Portfolio = {
  name: string;
  role: string;
  intro: string;
  bio: string;
  email: string;
  available: boolean;
  projects: Project[];
};
export const sample: Portfolio = {
  name: "Tamia Martin",
  role: "Computer science student & web developer",
  intro: "Building for the web. Growing through\nbusiness, research, and community.",
  bio: "I’m a computer science student at Grimsley High school while also attending courses at Guilford Technical Community College(GTCC), and I got hooked on building things for the web because I've always wanted to make my mark on this world, and the best way to do it is through the web . I like the space where code meets design, where something works well and feels good to use.\n\nOutside of class, I run my own small clothing brand, Serenity Studios, and built its online store from scratch, including the cart and checkout. That project taught me more than any class could about shipping something real: handling payments, deploying a site, and thinking about the people who’d actually use it.\n\nThis portfolio is a garden because I believe good work grows over time. Each flower is a project, a lesson, or a milestone. Click around, and feel free to reach out if you want to build something together.",
  email: "TamiaJmartin15@gmail.com",
  available: true,
  projects: [
    {
      title: "Serenity Studios",
      kind: "Real project",
      category: "E-commerce",
      year: "2026",
      description:
        "A full online store for my own loungewear brand, the Serenity Set. Soft pink and grey styling, a smooth cart, and secure checkout make shopping feel simple and personal.",
      role: "Brand · Web development · Payments",
      outcome:
        "A custom-built storefront with a shopping cart, Stripe checkout, and a live deployment, all built from scratch. I handled everything from the logo and design to inventory and shipping, so I learned what it takes to run a real business online.",
    },
    {
      title: "Soft Power on Screen",
      kind: "Research paper",
      category: "Cultural analysis",
      year: "2026",
      description:
        "An opinion-driven research paper on how China uses film, museums, TV shows, and social media like Douyin and TikTok as tools of global influence.",
      role: "Research · Critical analysis · Academic writing",
      outcome:
        "A paper built on scholarly and news sources, written in APA format, that argues culture can be as powerful as politics. It taught me how to vet sources, build an argument, and write with precision.",
    },
    {
      title: "Camilla’s and Theo’s Closet",
      shortTitle: "Community closet",
      kind: "Community",
      category: "Leadership",
      year: "Ongoing",
      description:
        "As Chair of Camilla’s and Theo’s Closet with the Greensboro Youth Council, I lead a pop-up shop that brings the community together through volunteers and local sponsors.",
      role: "Chair · Event planning · Volunteer and sponsor outreach",
      outcome:
        "I turned an idea into a real event by recruiting volunteers, securing sponsors, and keeping everyone working toward one goal. I also serve as a board member of the Greensboro Youth Council.",
    },
    {
      title: "DECA & National Honor Society",
      shortTitle: "DECA & NHS",
      kind: "Leadership",
      category: "Student organizations",
      year: "Ongoing",
      description:
        "I’m a leader in DECA, where I build business and professional skills through competition and teamwork. I’m also a member of the National Honor Society, which reflects my commitment to scholarship, service, and character.",
      role: "DECA leader · NHS member",
      outcome:
        "These organizations pushed me to speak confidently, work with a team, and give back.",
    },
  ],
};
export const storageKey = "tamia-sculpture-garden-v1";
export function validPortfolio(value: unknown): value is Portfolio {
  if (!value || typeof value !== "object") return false;
  const p = value as Portfolio;
  return (
    ["name", "role", "intro", "bio", "email"].every(
      (k) => typeof p[k as keyof Portfolio] === "string",
    ) &&
    typeof p.available === "boolean" &&
    Array.isArray(p.projects) &&
    (p.projects.length === 3 || p.projects.length === 4) &&
    p.projects.every(
      (project) =>
        project &&
        ["title", "category", "year", "description", "role", "outcome"].every(
          (k) => typeof project[k as keyof Project] === "string",
        ) &&
        (project.kind === undefined || typeof project.kind === "string") &&
        (project.shortTitle === undefined || typeof project.shortTitle === "string"),
    )
  );
}
export function loadPortfolio(): Portfolio {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "null");
    const previousSampleBio =
      "I’m Tamia, a multidisciplinary creative exploring the space between art, design, and digital experiences. I turn curious ideas into thoughtful identities and playful worlds.\n\nThis garden is a small collection of things I could make. Every sculpture holds a different story. Come wander.";
    if (validPortfolio(parsed)) {
      const oldTitles = ["Soft Form", "In Full Bloom", "Another Orbit"];
      const projects = parsed.projects.map((p, i) =>
        p.title === oldTitles[i] ? structuredClone(sample.projects[i]) : p,
      );
      if (projects.length === 3) projects.push(structuredClone(sample.projects[3]));
      return {
        ...parsed,
        bio: parsed.bio === previousSampleBio ? sample.bio : parsed.bio,
        email: parsed.email === "hello@example.com" ? sample.email : parsed.email,
        role: parsed.role === "Multidisciplinary creative" ? sample.role : parsed.role,
        intro:
          parsed.intro ===
          "Thoughtful design. Playful possibilities.\nA little unexpected, always intentional."
            ? sample.intro
            : parsed.intro,
        projects,
      };
    }
    return structuredClone(sample);
  } catch {
    return structuredClone(sample);
  }
}
