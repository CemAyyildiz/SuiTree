import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  primaryCta?: {
    label: string
    href: string
    onClick?: () => void
  }
  secondaryCta?: {
    label: string
    href: string
    onClick?: () => void
  }
  background?: React.ReactNode
  className?: string
}

export function Hero({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  background,
  className,
}: HeroProps) {
  return (
    <section className={cn("relative overflow-hidden section-padding", className)}>
      {/* Background */}
      {background && (
        <div className="absolute inset-0 -z-10">
          {background}
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/80 via-background/40 to-background" />
      
      <div className="container-padding">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtitle */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{subtitle}</span>
              </div>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              {description}
            </motion.p>
          )}

          {/* CTAs */}
          {(primaryCta || secondaryCta) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {primaryCta && (
                <Button
                  size="lg"
                  className="group"
                  onClick={primaryCta.onClick}
                >
                  {primaryCta.label}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
              
              {secondaryCta && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={secondaryCta.onClick}
                >
                  {secondaryCta.label}
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

interface HeroStatsProps {
  stats: {
    value: string
    label: string
  }[]
  className?: string
}

export function HeroStats({ stats, className }: HeroStatsProps) {
  return (
    <div className={cn("container-padding", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
