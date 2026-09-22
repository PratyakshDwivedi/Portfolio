import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { InfiniteGallery } from "@/components/founders/InfiniteGallery";
import { SmartImage } from "@/components/shared/SmartImage";

/**
 * Testimonials. The Infinite Gallery is the PRIMARY visual: a draggable,
 * infinitely scrolling 3D wall of people with depth and parallax. Selecting a
 * face reveals that person's testimonial in a SECONDARY panel beneath the
 * gallery, alongside their full (uncropped) photo, so the copy never fights the
 * gallery interaction.
 *
 * Content is real, supplied by the people named. Only people with BOTH a photo
 * and a written testimonial appear here; nothing is invented.
 */
interface Testimonial {
  image: string;
  name: string;
  role: string;
  testimonial: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Kushagr",
    role: "Associate Lead · Current President, FC",
    image: "/assets/images/testimonials/kushagr.jpg",
    testimonial:
      "Bhaiya, working with you has honestly been one of the things I've really valued in Founders Club. I've always admired your presence of mind, especially when things got hectic and super messy. The way you could manage multiple things at once and handle all our large scale events without losing your cool was genuinely impressive. I've personally looked up to you a lot for that, and I've learned quite a bit just by seeing how you handled situations, and been inspired by your leadership and vision. Really grateful I got the chance to work with you!",
  },
  {
    name: "Raaghavendra",
    role: "Associate Lead, FC",
    image: "/assets/images/testimonials/raaghavendra.jpg",
    testimonial:
      "During my first year in the club, Pratyaksh bhaiya was one of the biggest reasons I found my footing on campus, and honestly, the reason I lived that year to the fullest. As Vice President, he could easily have kept a certain distance, but he never let the title become his persona. He was always around, mingling with us like just another member, cracking jokes one moment and genuinely mentoring the next. Whenever I hit a wall, be it academics, campus life, or just figuring things out in my first year, he was my go to person, no questions asked. What stood out most was the balance he struck: kind yet mischievous, someone who led with responsibility but never lost his warmth or sense of humor. He has a heart as big as his presence, genuinely one of the rare people who make a difference without even being asked to. He made SRM feel less overwhelming and a lot more like home. I've come to see him as the elder brother I never had, and looking back he's a huge part of why my first year at SRM felt like one worth remembering.",
  },
  {
    name: "Saransh Bangar",
    role: "Analyst, Morgan Stanley",
    image: "/assets/images/testimonials/saransh.jpg",
    testimonial:
      "Pratyaksh, from the bottom of my heart, you are one of the most influential leaders I have come across. Right from our very first meeting, the way you control a room has always fascinated me. Truly a prodigy director.",
  },
  {
    name: "Ishan Roy",
    role: "GET, Digital Enterprise, Maruti Suzuki India Limited",
    image: "/assets/images/testimonials/ishan.jpg",
    testimonial:
      "I've had the pleasure of knowing Pratyaksh as my junior at SRMIST, and I've been impressed by his technical aptitude and enthusiasm in the fields of software development and devops. He has a strong curiosity for technology, a practical approach to problem-solving, and a genuine willingness to learn and explore. Beyond his technical capabilities, Pratyaksh is proactive, collaborative, and takes ownership of his work. His involvement in student-led and entrepreneurial initiatives further reflects his initiative and ability to work effectively with others with a leader mindset. I'm confident that his adaptability, technical curiosity, and drive to grow will make him a valuable addition to any professional team. I'm happy to recommend him and wish him the very best in his career.",
  },
  {
    name: "Vansh Agarwal",
    role: "Associate Lead, FC",
    image: "/assets/images/testimonials/vansh.jpg",
    testimonial:
      "He is honestly one of the best people I have met during my college journey. Whenever I face a difficult or crucial situation, he is one of the first people I turn to because he always knows how to understand the problem and find the right solution. His leadership skills are something I truly admire and have learned a lot from. When I met him, he was the Vice President, but I never felt any sense of hierarchy or seniority between us. He always treated me like a younger brother and was someone I could openly talk to about both club-related and personal matters. He has always supported me, listened to me without judgment, and guided me whenever I needed it. His skills, leadership, and the way he handles people are qualities I genuinely respect. I am truly grateful to have met someone like him during my college journey.",
  },
  {
    name: "Rohan Bandari",
    role: "Advisor, FC",
    image: "/assets/images/testimonials/rohan.jpg",
    testimonial:
      "A great teammate to work with, he has a clear view of the broader picture which helps us plan things well in advance.",
  },
  {
    name: "Lehan Vats",
    role: "ONM Lead, FC",
    image: "/assets/images/testimonials/lehan.jpg",
    testimonial:
      "My experience working with Pratyaksh Dwivedi during my college tenure has been exceptionally positive. His remarkable capacity to command attention upon entering any environment is notable, and he demonstrates significant proficiency in managing critical situations. He is a diligent individual and an inspiration who leads by example.",
  },
  {
    name: "Joshua K Biju",
    role: "HR and QC, FC",
    image: "/assets/images/testimonials/joshua.jpg",
    testimonial:
      "Pratyaksh Dwivedi has been one of the most influential people in my journey with the Founders Club. As the former Vice President and now an Advisor, his genuine passion and deep knowledge of entrepreneurship, startups, marketing, and networking have always stood out. From coming up with brilliant initiatives like IdeaSpark to teaching us everything from marketing and pitching to building meaningful relationships, he has always pushed us to learn, think, and grow beyond what was expected. Personally, Pratyaksh saw potential in me that I hadn't seen in myself. He trained me, guided me, corrected me, scolded me when needed, and trusted me when it mattered. His expectations were often high, but they pushed me to become a better leader for the club. What I admire most is his ability to understand people. He sees not just who you are, but who you can become, and genuinely invests in helping you get there. Beyond entrepreneurship, he taught me the importance of building and maintaining genuine relationships. Behind all the challenges and tough conversations, there has always been immense care. I am truly grateful to have learned from him, been challenged by him, and most importantly, been believed in by him. Some leaders lead teams; the best leaders build people. Pratyaksh is one of those leaders.",
  },
  {
    name: "Karthikeyan",
    role: "Ex ONM Lead, FC",
    image: "/assets/images/testimonials/karthikeyan.jpg",
    testimonial:
      "Pratyaksh, you are genuinely one of the most charismatic people and exceptional leaders I've had the privilege of knowing. Watching you take the reins of the club after our batch and lead the team with such warmth, composure and effortless charm was truly remarkable. Your ability to bring out the best in people while making everyone feel valued is a quality that truly sets you apart. A rare blend of an inspiring leader and an absolutely wonderful person, truly a gem of a leader.",
  },
  {
    name: "Sasidhar",
    role: "Advisor, FC",
    image: "/assets/images/testimonials/sasidhar.jpg",
    testimonial:
      "I had the opportunity to work closely with Pratyaksh Dwivedi during his tenure as the Vice President of our student club, and I can confidently say that he is an exceptional leader and an inspiring individual. Pratyaksh possesses excellent communication skills and has a natural ability to connect with people, clearly articulate ideas, and bring everyone together toward a common goal. His leadership qualities are evident in the way he takes initiative, guides the team, and handles responsibilities with confidence and maturity. One of his strongest qualities is his high sense of ownership. He takes complete responsibility for the tasks entrusted to him and consistently ensures that they are carried through to completion. Beyond his skills and responsibilities, Pratyaksh has a strong professional presence and an ability to command attention and inspire confidence through his personality, confidence, and approach to leadership. Working with him has been a valuable experience, and I highly appreciate his dedication, leadership, and ability to positively influence the people around him. I am confident that he will continue to make a meaningful impact wherever he goes.",
  },
  {
    name: "Aarushi",
    role: "Ex Associate Lead, FC",
    image: "/assets/images/testimonials/aarushi.jpg",
    testimonial:
      "I've had the opportunity to work with Pratyaksh since our second year of college, when we were both part of the Founders Club. Over the years, I've had the chance to see him grow not just professionally, but also as a leader, through the different projects, events and initiatives we've worked on together. What I particularly appreciate about Pratyaksh is that even after his promotion to President, he never made the people he started with feel beneath him. Despite taking on a position of greater responsibility very early on, he remained the same person who valued everyone's contributions and treated the team with the same respect. The respect we have for him as a team is one that can only be commanded, never demanded. His consistency is something that has always stood out to me. Whether it was taking responsibility when things got difficult or making sure the team stayed on track, he has always been someone we could rely on. He leads without making leadership feel like a hierarchy, which makes working with him genuinely collaborative rather than purely task-oriented. He is approachable, willing to listen, and genuinely invested in the people he works with. I've seen him take initiative and push things forward while making sure the people around him feel heard and valued. I can confidently say that he is someone I would be happy to work with again and again. More than just a dependable teammate or a genuine leader, he is someone who earns the trust and respect of the people around him, and that, in my opinion, is what makes him truly extraordinary.",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto mb-10 max-w-6xl px-6 text-center">
        <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-founders-yellow">
          Kind words
        </p>
        <h2 className="text-display text-5xl text-[#fdf6e3] sm:text-7xl">
          Testimonials
        </h2>
        <p className="mx-auto mt-4 max-w-md font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#fdf6e3]/40">
          Drag to explore · tap a face to read
        </p>
      </div>

      {/* PRIMARY: the infinite 3D gallery */}
      <InfiniteGallery
        items={testimonials}
        activeIndex={active}
        onSelect={setActive}
      />

      {/* SECONDARY: the selected person's full photo + testimonial. The photo
          uses object-contain so the natural composition is preserved (no crop);
          image dimensions vary per person by design. */}
      <div className="mx-auto mt-10 grid max-w-4xl gap-8 px-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`photo-${active}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center sm:justify-start"
          >
            <SmartImage
              src={t.image}
              alt={t.name}
              label={t.name}
              tint="#ffcc1d"
              className="max-h-80 w-auto rounded-2xl border border-founders-yellow/20 object-contain shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.blockquote
            key={`quote-${active}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-founders-yellow/15 bg-founders-navy/50 px-6 py-8 backdrop-blur-sm sm:px-10"
          >
            <Quote className="mb-4 h-7 w-7 text-founders-yellow" />
            <p className="font-serif text-lg leading-relaxed text-[#fdf6e3]/85 sm:text-xl">
              {t.testimonial}
            </p>
            <footer className="mt-6">
              <p className="text-display text-lg text-[#fdf6e3]">{t.name}</p>
              <p className="font-mono text-[0.7rem] uppercase tracking-widest text-founders-yellow/70">
                {t.role}
              </p>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
    </section>
  );
}
