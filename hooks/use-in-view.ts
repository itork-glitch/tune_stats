"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"

interface UseInViewOptions {
  ref?: React.RefObject<Element>
  threshold?: number | number[]
  rootMargin?: string
  once?: boolean
  enabled?: boolean
}

export function useInView({
  ref: externalRef,
  threshold = 0,
  rootMargin = "0px",
  once = false,
  enabled = true,
}: UseInViewOptions = {}) {
  const internalRef = useRef<Element | null>(null)
  const ref = externalRef || internalRef
  const [inView, setInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const element = ref.current
    if (!element) return

    const shouldObserve = !once || !hasTriggered

    if (!shouldObserve) return

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const [entry] = entries
      const isIntersecting = entry.isIntersecting

      setInView(isIntersecting)

      if (isIntersecting && once) {
        setHasTriggered(true)
      }
    }

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, threshold, rootMargin, once, hasTriggered, enabled])

  return { ref, inView, hasTriggered }
}

