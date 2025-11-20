"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const TECH_LOGOS: Record<string, string> = {
  react: "/tech/react.svg",
  node: "/tech/node.svg",
  js: "/tech/js.svg",
  ts: "/tech/ts.svg",
  mongodb: "/tech/mongodb.svg",
  next: "/tech/next.svg",
  docker: "/tech/docker.svg",
};

// ⭐ Fallback images
const RANDOM_COVERS = [
  "/covers/adobe.png",
  "/covers/amazon.png",
  "/covers/facebook.png",
  "/covers/hostinger.png",
  "/covers/pinterest.png",
  "/covers/quora.png",
  "/covers/reddit.png",
  "/covers/skype.png",
  "/covers/spotify.png",
  "/covers/telegram.png",
  "/covers/tiktok.png",
  "/covers/yahoo.png",
];

interface TechIconProps {
  techStack?: string[];
}

export default function DisplayTechIcons({ techStack = [] }: TechIconProps) {
  const safeTechStack = Array.isArray(techStack) ? techStack : [];

  // Build icons list w/ fallback random images
  const icons = safeTechStack.map((t) => {
    const logo = TECH_LOGOS[t?.toLowerCase()];
    return {
      tech: t,
      url:
        logo ||
        RANDOM_COVERS[Math.floor(Math.random() * RANDOM_COVERS.length)],
    };
  });

  if (icons.length === 0) {
    return <div className="text-xs text-muted-foreground">No tech</div>;
  }

  // Only show first 3
  const visibleIcons = icons.slice(0, 2);

  // Count remaining
  const extraCount = icons.length - visibleIcons.length;

  return (
    <div className="flex flex-row items-center gap-1">
      {visibleIcons.map(({ tech, url }, index) => (
        <div
          key={tech + "-" + index}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex flex-center shadow-sm",
            index >= 1 && "-ml-2"
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5 rounded-full object-cover"
          />
        </div>
      ))}

      {/* ⭐ Add "+N" indicator if more techs exist */}
      {extraCount > 0 && (
        <span className="text-xs text-gray-400 ml-1">+{extraCount}</span>
      )}
    </div>
  );
}
