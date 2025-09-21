"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import React from "react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  variant?: "light" | "dark";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName,
  titleClassName,
  variant = "light",
  onMouseEnter,
  onMouseLeave,
}: DisplayCardProps) {
  const variants = {
    light: {
      card: "bg-muted/70 border-border/50",
      iconWrapper: "bg-blue-800",
      icon: "text-blue-300",
      title: "text-blue-500",
      description: "text-foreground",
      date: "text-muted-foreground",
    },
    dark: {
      card: "!bg-black !border-zinc-800",
      iconWrapper: "bg-zinc-800",
      icon: "text-zinc-300",
      title: "!text-blue-400",
      description: "text-zinc-300",
      date: "text-zinc-500",
    },
  };
  const theme = variants[variant];
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 px-4 py-3 backdrop-blur-sm transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-white/20 [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        theme.card,
        className
      )}
    >
      <div>
        <span
          className={cn(
            "relative inline-block rounded-full p-1",
            theme.iconWrapper
          )}
        >
          <div className={cn("size-4", theme.icon, iconClassName)}>
            {icon}
          </div>
        </span>
        <p className={cn("text-lg font-medium", theme.title, titleClassName)}>
          {title}
        </p>
      </div>
      <p
        className={cn("whitespace-nowrap text-lg", theme.description)}
      >
        {description}
      </p>
      <p className={cn(theme.date)}>{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: Omit<DisplayCardProps, "onMouseEnter" | "onMouseLeave">[];
  onCardHover?: (index: number | null) => void;
  variant?: "light" | "dark";
}

export default function DisplayCards({
  cards,
  onCardHover,
  variant,
}: DisplayCardsProps) {
  const defaultCards = [
    {
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className:
        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className:
        "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard
          key={index}
          {...cardProps}
          variant={variant}
          onMouseEnter={() => onCardHover?.(index)}
          onMouseLeave={() => onCardHover?.(null)}
        />
      ))}
    </div>
  );
}
