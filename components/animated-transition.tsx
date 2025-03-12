"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export interface TransitionState {
  [key: string]: any
}

export interface AnimatedTransitionProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  as?: React.ElementType
  state: string
  transitions: {
    [key: string]: {
      from: TransitionState
      to: TransitionState
      config?: {
        duration?: number
        delay?: number
        easing?: string
      }
    }
  }
  onTransitionComplete?: (state: string) => void
}

export function AnimatedTransition({
  children,
  className,
  style,
  as: Component = "div",
  state,
  transitions,
  onTransitionComplete,
}: AnimatedTransitionProps) {
  const [currentStyles, setCurrentStyles] = useState<TransitionState>({})
  const [transitionStyles, setTransitionStyles] = useState<React.CSSProperties>({})
  const prevStateRef = useRef<string | null>(null)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prevState = prevStateRef.current

    // If this is the first render or state hasn't changed, just apply the "to" styles
    if (!prevState || prevState === state) {
      const toStyles = transitions[state]?.to || {}
      setCurrentStyles(toStyles)
      setTransitionStyles({})
      prevStateRef.current = state
      return
    }

    // Get transition config for the new state
    const transition = transitions[state]
    if (!transition) {
      console.warn(`No transition defined for state: ${state}`)
      return
    }

    const { from, to, config = {} } = transition
    const { duration = 300, delay = 0, easing = "ease" } = config

    // Apply "from" styles immediately (without transition)
    setCurrentStyles(from)
    setTransitionStyles({})

    // Force a reflow to ensure the "from" styles are applied before transitioning
    if (elementRef.current) {
      void elementRef.current.offsetHeight
    }

    // Then apply "to" styles with transition
    const transitionProps = Object.keys(to).join(", ")

    setCurrentStyles(to)
    setTransitionStyles({
      transition: `${transitionProps} ${duration}ms ${easing} ${delay}ms`,
    })

    // Update the previous state
    prevStateRef.current = state

    // Handle transition complete
    const timer = setTimeout(() => {
      if (onTransitionComplete) {
        onTransitionComplete(state)
      }
    }, duration + delay)

    return () => clearTimeout(timer)
  }, [state, transitions, onTransitionComplete])

  return (
    <Component
      ref={elementRef}
      className={cn(className)}
      style={{
        ...style,
        ...currentStyles,
        ...transitionStyles,
      }}
    >
      {children}
    </Component>
  )
}

