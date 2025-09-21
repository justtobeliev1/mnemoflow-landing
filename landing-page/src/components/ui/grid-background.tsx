"use client";

import React, { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

export interface GridBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  hideMidLine?: boolean;
  startOnView?: boolean;
}

const GridBackground = React.forwardRef<HTMLDivElement, GridBackgroundProps>(
  ({ className, children, hideMidLine, startOnView, ...props }, ref) => {
    const patternId = useId().replace(/:/g, "");

    const styles = `
      @keyframes grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
      @keyframes pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
      .grid-line { stroke: #94a3b8; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw 2s ease-out forwards; }
      .detail-dot { fill: #cbd5e1; opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
      .observer-start .grid-line { animation-play-state: paused; }
      .observer-start .detail-dot { animation-play-state: paused; }
    `;

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!startOnView) return;
      const el = wrapperRef.current;
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.remove("observer-start");
            } else {
              el.classList.add("observer-start");
            }
          });
        },
        { root: null, threshold: 0.15 }
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, [startOnView]);

    const attachRef = (node: HTMLDivElement | null) => {
      wrapperRef.current = node;
      if (typeof ref === "function") ref(node);
      // @ts-expect-error forwardRef may be MutableRefObject
      if (ref && typeof ref !== "function") ref.current = node;
    };

    return (
      <div ref={attachRef} className={cn("relative overflow-hidden", startOnView ? "observer-start" : undefined, className)} {...props}>
        <style>{styles}</style>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id={patternId} width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.5s' }} />
          <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '1s' }} />
          <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: '1.5s' }} />
          <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: '2s' }} />
          <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: '2.5s', opacity: '0.05' }} />
          { !hideMidLine && (
            <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: '3s', opacity: '0.05' }} />
          )}
          <circle cx="20%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3s' }} />
          <circle cx="80%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3.2s' }} />
          <circle cx="20%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.4s' }} />
          <circle cx="80%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.6s' }} />
          <circle cx="50%" cy="50%" r="1.5" className="detail-dot" style={{ animationDelay: '4s' }} />
        </svg>
        {children}
      </div>
    );
  }
);

GridBackground.displayName = "GridBackground";

export default GridBackground;
