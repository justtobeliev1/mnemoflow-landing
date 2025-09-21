import { cn } from '@/lib/utils'
import { motion } from "framer-motion"

interface NoisePatternCardProps {
  children: React.ReactNode
  className?: string
  patternClassName?: string
  overlayClassName?: string
  width?: string
  height?: string
}

export function NoisePatternCard({ 
  children, 
  className,
  patternClassName,
  overlayClassName,
  width = "w-full",
  height = "h-auto"
}: NoisePatternCardProps) {
  return (
    <motion.div
      className={cn(
        "border rounded-md overflow-hidden",
        "bg-zinc-950",
        "border-zinc-900",
        width,
        height,
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={cn(
        "size-full bg-repeat bg-[length:500px_500px]",
        "bg-noise-pattern",
        patternClassName
      )}>
        <div className={cn(
          "size-full",
          "bg-zinc-950/30",
          overlayClassName
        )}>
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export function NoisePatternCardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("text-left p-4 md:p-6", className)} 
      {...props} 
    />
  )
}
