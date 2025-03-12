"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export interface BlurTextCharacterProps {
  text: string
  className?: string
  characterClassName?: string
  duration?: number
  staggerDelay?: number
  blur?: number
  threshold?: number
  once?: boolean
  as?: React.ElementType
}

export function BlurTextCharacter({
  text,
  className,
  characterClassName,
  duration = 1000,
  staggerDelay = 50,
  blur = 10,
  threshold = 0.1,
  once = true,
  as: Component = "div",
}: BlurTextCharacterProps) {
  const [isVisible, setIsVisible] = useState(false)
  const characters = text.split("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.disconnect()
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold },
    )

    const element = document.getElementById(`blur-text-${text.replace(/\s+/g, "-")}`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [text, once, threshold])

  return (
    <Component id={`blur-text-${text.replace(/\s+/g, "-")}`} className={cn("inline-flex flex-wrap", className)}>
      {characters.map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={cn("inline-block", characterClassName)}
          style={{
            filter: isVisible ? "blur(0px)" : `blur(${blur}px)`,
            opacity: isVisible ? 1 : 0,
            transition: `filter ${duration}ms ease-out ${index * staggerDelay}ms, opacity ${duration}ms ease-out ${index * staggerDelay}ms`,
            willChange: "filter, opacity",
          }}
          aria-hidden={!isVisible}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Component>
  )
}

