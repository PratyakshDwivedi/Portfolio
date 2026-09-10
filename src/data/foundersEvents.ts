/**
 * ─────────────────────────────────────────────────────────────
 * FOUNDERS CLUB EVENTS
 *
 * Photos are REAL (optimized into public/assets/images/events/<id>/).
 * Each event has:
 *   thumbnail.jpg  → the card cover (authoritative "Thumbnail")
 *   1.jpg … 4.jpg  → the four photos shown in the expanded view
 *
 * CONTENT RULE: only verified, supplied facts appear here. Anything not
 * confirmed stays an obvious editable placeholder ("… coming soon."),
 * never invent dates, counts, venues, outcomes or contributions.
 * ─────────────────────────────────────────────────────────────
 */

export type EventCategory =
  | "Hackathons"
  | "Bootcamps"
  | "Ideation & Pitch"
  | "Community";

export interface FoundersEvent {
  id: string;
  title: string;
  /** Grouping label shown on the card + expanded view. */
  category: EventCategory;
  /** Omit when no confirmed date was supplied. */
  date?: string;
  /** Official theme/tagline, where one exists. */
  tagline?: string;
  coverImage: string;
  photos: string[];
  /** Concise summary. */
  description: string;
  /** Results / outcomes, where supplied. */
  outcomes?: string;
  /** Role/contribution: a paragraph or a list of bullet points. */
  contribution: string | string[];
}

/** Build the asset paths for an event id (files live in public/assets). */
const assets = (id: string) => ({
  coverImage: `/assets/images/events/${id}/thumbnail.jpg`,
  photos: [1, 2, 3, 4].map((n) => `/assets/images/events/${id}/${n}.jpg`),
});

export const foundersEvents: FoundersEvent[] = [
  {
    id: "bootcamp-8",
    title: "Bootcamp 8",
    category: "Bootcamps",
    date: "22 to 26 October 2024",
    ...assets("bootcamp-8"),
    description:
      "A five day DEI Entrepreneurship Bootcamp introducing aspiring founders to startup fundamentals through journey based and hands on learning. The program covered entrepreneurial mindset, networking, team building and the different stages involved in taking an idea toward a venture.",
    contribution: [
      "Coordinated the workforce provided by Founders Club for the bootcamp and acted as a point of contact between the Directorate of Entrepreneurship and Innovation and Founders Club.",
      "Led the club team during on ground execution and coordinated operational requirements with the DEI team.",
      "Supported smooth execution of sessions, participant activities and event operations.",
    ],
  },
  {
    id: "ideaspark",
    title: "IdeaSpark",
    category: "Ideation & Pitch",
    date: "April 2025",
    tagline: "Igniting Minds, Sparking Innovation",
    ...assets("ideaspark"),
    description:
      "The inaugural IdeaSpark ideation platform designed to help students generate, evaluate and communicate startup ideas through structured ideation and pitching activities.",
    contribution: [
      "Introduced IdeaSpark as an ideation focused event within the club's event ecosystem.",
      "Led operational planning and execution while coordinating the front end and back end requirements.",
      "Managed logistics and coordinated the team responsible for delivering the event.",
    ],
  },
  {
    id: "foundathon-2",
    title: "Foundathon 2.0",
    category: "Hackathons",
    date: "August 2025",
    ...assets("foundathon-2"),
    description:
      "A 36 hour technical hackathon and annual innovation platform where teams developed original and scalable solutions through an internal elimination stage followed by final evaluation by external judges.",
    outcomes: "The event included a prize pool.",
    contribution: [
      "Headed the Operations team and managed logistics throughout the hackathon.",
      "Handled both front end and back end technical responsibilities required for the event infrastructure.",
      "Coordinated execution from planning through the live 36 hour event.",
    ],
  },
  {
    id: "ideaspark-2",
    title: "IdeaSpark 2.0",
    category: "Ideation & Pitch",
    date: "22 to 23 September 2025",
    ...assets("ideaspark-2"),
    description:
      "A two day ideation and pitch platform at Tech Park 2 featuring timed screening rounds, pitch refinement and final presentations. The event also introduced Plan C as a follow through mentorship pathway for participants.",
    outcomes:
      "Winners: Team IdeaForge (₹7,000), Team Springo (₹5,000) and Team Frequency (₹3,000).",
    contribution: [
      "Built on the IdeaSpark format that I introduced and helped drive its operational execution.",
      "Headed logistics and coordinated the front end and back end requirements for the event.",
      "Coordinated teams and execution across screening, mentoring, judging and final pitching.",
    ],
  },
  {
    id: "bootcamp-9",
    title: "Bootcamp 9",
    category: "Bootcamps",
    date: "November 2025",
    ...assets("bootcamp-9"),
    description:
      "A four day entrepreneurship program designed to take participants from an early idea toward a more structured venture through workshops, mentorship, networking and practical exposure. Sessions focused on startup mindset, team building, validation and understanding how ventures develop.",
    contribution: [
      "Served as the primary coordination point between DEI and Founders Club while managing the workforce supplied by the club.",
      "Headed the Founders Club team during event operations and coordinated requirements across both teams.",
      "Worked closely with the execution team to keep sessions, participants and operational activities aligned throughout the bootcamp.",
    ],
  },
  {
    id: "club-wars",
    title: "Club Wars",
    category: "Community",
    date: "2026",
    ...assets("club-wars"),
    description:
      "A two day inter club competition involving approximately 160 participants from 20+ SRM clubs. The event combined technical, creative, entrepreneurial and communication challenges across multiple competitive rounds.",
    outcomes: "Coding Ninjas were the overall champions.",
    contribution: [
      "Served as the main organizer and handled the event from planning through execution.",
      "Managed both front end and back end technical requirements for the event platform.",
      "Coordinated operations, logistics and execution across the complete Club Wars workflow.",
    ],
  },
  {
    id: "foundathon-3",
    title: "Foundathon 3.0",
    category: "Hackathons",
    date: "9 to 11 March 2026",
    tagline: "Build Your Empire. Code Your Future.",
    ...assets("foundathon-3"),
    description:
      "A 36 hour flagship technical hackathon bringing together 500+ students across disciplines to solve problem statements spanning AI in education, sustainability and digital platforms for social impact. Teams moved through ideation, mentor guided refinement and final prototype pitching.",
    outcomes:
      "Team Caffeine won, followed by AstraX and Code4Life. Several participants received internship offers.",
    contribution: [
      "Led the Operations team and coordinated logistics throughout the 36 hour execution.",
      "Managed the event's front end and back end technical requirements.",
      "Coordinated planning, on ground execution and operational dependencies across the hackathon.",
    ],
  },
  {
    id: "plan-c",
    title: "Plan C",
    category: "Community",
    date: "11 October 2025",
    tagline: "Turning Vision Into Venture",
    ...assets("plan-c"),
    description:
      "An Open House style practical entrepreneurship session at the DEI Inspiration Studio (BEL 506) covering early startup challenges, basic legal documentation, real world constraints, problem solving, pitching and founder perspectives. Participants were also introduced to pre incubation and incubation pathways.",
    contribution: [
      "Worked on the event from scratch, starting with planning and structuring the event before moving into execution.",
      "Headed Operations and coordinated the complete on ground execution.",
      "Helped participants understand entrepreneurship, startup culture, startup challenges and how early stage ventures operate.",
    ],
  },
  {
    id: "bootcamp-10",
    title: "Bootcamp 10",
    category: "Bootcamps",
    ...assets("bootcamp-10"),
    description:
      "A continuation of the DEI Entrepreneurship Bootcamp series focused on giving students practical exposure to entrepreneurship, startup thinking and venture building through structured sessions, activities and interaction with the ecosystem.",
    contribution: [
      "Coordinated Founders Club's workforce and served as the operational bridge between DEI and the club.",
      "Led the club team on ground and ensured that assigned responsibilities were executed smoothly.",
      "Managed communication and operational coordination between both organizations throughout the event.",
    ],
  },
  {
    id: "triumph-talk",
    title: "Triumph Talk",
    category: "Community",
    ...assets("triumph-talk"),
    description: "Event details coming soon.",
    contribution: "Contribution details coming soon.",
  },
];
