import { motion } from "motion/react";

/** Tupperware dessinés à la main qui flottent doucement en arrière-plan */
export function TupperwareBackdrop() {
  const colors = [
    "#27E4F5", "#FF8C42", "#27E4F5", "#FFB347", "#27E4F5", "#FF8C42",
    "#27E4F5", "#FFB347", "#FF8C42", "#27E4F5", "#FFB347", "#27E4F5",
    "#FF8C42", "#27E4F5", "#FFB347", "#FF8C42",
  ];
  
  const tupperware = [
    {
      id: 1,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="40" rx="40" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          <path d="M 10 40 C 10 80, 90 80, 90 40" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "8%",
      top: "15%",
      size: 80,
      duration: 18,
      delay: 0,
    },
    {
      id: 2,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="15,40 85,40 75,80 25,80" fill="none" stroke="currentColor" strokeWidth="3"/>
          <polygon points="10,40 90,40 80,25 20,25" fill="none" stroke="currentColor" strokeWidth="3"/>
          <rect x="40" y="25" width="20" height="5" fill="none" stroke="currentColor" strokeWidth="3"/>
          <line x1="25" y1="80" x2="15" y2="40" stroke="currentColor" strokeWidth="3"/>
          <line x1="75" y1="80" x2="85" y2="40" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "75%",
      top: "25%",
      size: 90,
      duration: 22,
      delay: 3,
    },
    {
      id: 3,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M 5 50 C 5 70, 95 70, 95 50" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "20%",
      top: "65%",
      size: 75,
      duration: 20,
      delay: 5,
    },
    {
      id: 4,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="40" rx="40" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          <path d="M 10 40 C 10 80, 90 80, 90 40" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "85%",
      top: "70%",
      size: 70,
      duration: 19,
      delay: 7,
    },
    {
      id: 5,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="15,40 85,40 75,80 25,80" fill="none" stroke="currentColor" strokeWidth="3"/>
          <polygon points="10,40 90,40 80,25 20,25" fill="none" stroke="currentColor" strokeWidth="3"/>
          <rect x="40" y="25" width="20" height="5" fill="none" stroke="currentColor" strokeWidth="3"/>
          <line x1="25" y1="80" x2="15" y2="40" stroke="currentColor" strokeWidth="3"/>
          <line x1="75" y1="80" x2="85" y2="40" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "50%",
      top: "10%",
      size: 65,
      duration: 21,
      delay: 2,
    },
    {
      id: 6,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M 5 50 C 5 70, 95 70, 95 50" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "40%",
      top: "85%",
      size: 85,
      duration: 23,
      delay: 4,
    },
    {
      id: 7,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="40" rx="40" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          <path d="M 10 40 C 10 80, 90 80, 90 40" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "65%",
      top: "50%",
      size: 95,
      duration: 20,
      delay: 1,
    },
    {
      id: 8,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="15,40 85,40 75,80 25,80" fill="none" stroke="currentColor" strokeWidth="3"/>
          <polygon points="10,40 90,40 80,25 20,25" fill="none" stroke="currentColor" strokeWidth="3"/>
          <rect x="40" y="25" width="20" height="5" fill="none" stroke="currentColor" strokeWidth="3"/>
          <line x1="25" y1="80" x2="15" y2="40" stroke="currentColor" strokeWidth="3"/>
          <line x1="75" y1="80" x2="85" y2="40" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "15%",
      top: "40%",
      size: 80,
      duration: 19,
      delay: 6,
    },
    {
      id: 9,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M 5 50 C 5 70, 95 70, 95 50" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "70%",
      top: "80%",
      size: 75,
      duration: 22,
      delay: 3,
    },
    {
      id: 10,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="40" rx="40" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          <path d="M 10 40 C 10 80, 90 80, 90 40" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "30%",
      top: "30%",
      size: 70,
      duration: 21,
      delay: 8,
    },
    {
      id: 11,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="15,40 85,40 75,80 25,80" fill="none" stroke="currentColor" strokeWidth="3"/>
          <polygon points="10,40 90,40 80,25 20,25" fill="none" stroke="currentColor" strokeWidth="3"/>
          <rect x="40" y="25" width="20" height="5" fill="none" stroke="currentColor" strokeWidth="3"/>
          <line x1="25" y1="80" x2="15" y2="40" stroke="currentColor" strokeWidth="3"/>
          <line x1="75" y1="80" x2="85" y2="40" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "55%",
      top: "60%",
      size: 78,
      duration: 18,
      delay: 5,
    },
    {
      id: 12,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M 5 50 C 5 70, 95 70, 95 50" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "10%",
      top: "75%",
      size: 72,
      duration: 20,
      delay: 9,
    },
    {
      id: 13,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="40" rx="40" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          <path d="M 10 40 C 10 80, 90 80, 90 40" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "82%",
      top: "45%",
      size: 88,
      duration: 22,
      delay: 2,
    },
    {
      id: 14,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="15,40 85,40 75,80 25,80" fill="none" stroke="currentColor" strokeWidth="3"/>
          <polygon points="10,40 90,40 80,25 20,25" fill="none" stroke="currentColor" strokeWidth="3"/>
          <rect x="40" y="25" width="20" height="5" fill="none" stroke="currentColor" strokeWidth="3"/>
          <line x1="25" y1="80" x2="15" y2="40" stroke="currentColor" strokeWidth="3"/>
          <line x1="75" y1="80" x2="85" y2="40" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "45%",
      top: "20%",
      size: 82,
      duration: 19,
      delay: 7,
    },
    {
      id: 15,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M 5 50 C 5 70, 95 70, 95 50" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "90%",
      top: "15%",
      size: 68,
      duration: 23,
      delay: 4,
    },
    {
      id: 16,
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="40" rx="40" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          <path d="M 10 40 C 10 80, 90 80, 90 40" fill="none" stroke="currentColor" strokeWidth="3"/>
        </svg>
      ),
      left: "25%",
      top: "55%",
      size: 76,
      duration: 21,
      delay: 10,
    },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-[0.5]" aria-hidden>
      {tupperware.map((item, idx) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{
            left: item.left,
            top: item.top,
            width: item.size,
            height: item.size,
            color: colors[idx % colors.length],
          }}
          animate={{
            y: [0, -25, 15, -20, 0],
            x: [0, 10, -8, 12, 0],
            rotate: [0, 3, -2, 4, 0],
            scale: [1, 1.05, 0.98, 1.03, 1],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.svg}
        </motion.div>
      ))}
    </div>
  );
}
