"use client"

import { useState } from "react"
import { AnimatedTransition } from "@/components/animated-transition"
import { useAnimation } from "@/hooks/use-animation"
import { Button } from "@/components/ui/button"

export default function ExamplesPage() {
  const [cardState, setCardState] = useState("default")
  const [count, setCount] = useState(0)

  const { ref, animate, isAnimating } = useAnimation({
    onComplete: () => console.log("Animation completed"),
  })

  const handleAnimate = () => {
    animate(
      { transform: "scale(1)", backgroundColor: "rgb(30, 41, 59)" },
      { transform: "scale(1.05)", backgroundColor: "rgb(79, 70, 229)" },
      { duration: 300, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-4xl font-bold mb-12 text-center">Advanced Animation Examples</h1>

        <section className="mb-24">
          <h2 className="text-3xl font-semibold mb-8 text-center">State-Based Transitions</h2>

          <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-lg">
            <AnimatedTransition
              state={cardState}
              transitions={{
                default: {
                  from: { opacity: 1, transform: "scale(1)" },
                  to: { opacity: 1, transform: "scale(1)" },
                  config: { duration: 300, easing: "ease-out" },
                },
                expanded: {
                  from: { opacity: 1, transform: "scale(1)" },
                  to: { opacity: 1, transform: "scale(1.05)" },
                  config: { duration: 300, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
                },
                highlighted: {
                  from: { opacity: 1, backgroundColor: "rgb(30, 41, 59)" },
                  to: { opacity: 1, backgroundColor: "rgb(79, 70, 229)" },
                  config: { duration: 300, easing: "ease-out" },
                },
                hidden: {
                  from: { opacity: 1, transform: "translateY(0)" },
                  to: { opacity: 0, transform: "translateY(20px)" },
                  config: { duration: 300, easing: "ease-in" },
                },
              }}
              className="p-6 rounded-md bg-slate-800"
            >
              <h3 className="text-xl font-medium mb-4">Interactive Card</h3>
              <p className="mb-6">Current state: {cardState}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setCardState("default")}
                  variant={cardState === "default" ? "default" : "outline"}
                >
                  Default
                </Button>
                <Button
                  onClick={() => setCardState("expanded")}
                  variant={cardState === "expanded" ? "default" : "outline"}
                >
                  Expanded
                </Button>
                <Button
                  onClick={() => setCardState("highlighted")}
                  variant={cardState === "highlighted" ? "default" : "outline"}
                >
                  Highlighted
                </Button>
                <Button onClick={() => setCardState("hidden")} variant={cardState === "hidden" ? "default" : "outline"}>
                  Hidden
                </Button>
              </div>
            </AnimatedTransition>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-semibold mb-8 text-center">Imperative Animation Hook</h2>

          <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-lg">
            <div ref={ref} className="p-6 rounded-md bg-slate-800 mb-6">
              <h3 className="text-xl font-medium mb-4">Animated Counter</h3>
              <p className="text-4xl font-bold text-center">{count}</p>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  handleAnimate()
                  setCount((prev) => prev + 1)
                }}
                disabled={isAnimating}
              >
                Increment
              </Button>
              <Button
                onClick={() => {
                  handleAnimate()
                  setCount((prev) => prev - 1)
                }}
                disabled={isAnimating}
                variant="outline"
              >
                Decrement
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

