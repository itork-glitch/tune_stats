"use client"

export default function DocumentationPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto py-20 px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-12">Animation Components Documentation</h1>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Overview</h2>
          <p className="text-lg mb-4">
            This library provides a set of reusable animation components for React applications. Built with modern web
            standards, it offers smooth transitions and animations without relying on external libraries like React
            Spring.
          </p>
          <p className="text-lg mb-4">
            The components are designed to be flexible, customizable, and easy to use in various scenarios, from simple
            fade-in effects to complex state transitions.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Components</h2>

          <div className="space-y-12">
            <div className="bg-gray-900 p-8 rounded-lg">
              <h3 className="text-2xl font-medium mb-4">BlurText</h3>
              <p className="mb-4">
                Animates text with a blur effect, with options to animate by words, letters, or lines.
              </p>

              <h4 className="text-xl font-medium mb-2">Props</h4>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                  <code className="text-pink-400">text</code>: The text to animate
                </li>
                <li>
                  <code className="text-pink-400">animateBy</code>: 'words' | 'letters' | 'lines'
                </li>
                <li>
                  <code className="text-pink-400">direction</code>: 'top' | 'bottom' | 'left' | 'right' | 'none'
                </li>
                <li>
                  <code className="text-pink-400">blur</code>: Amount of initial blur (px)
                </li>
                <li>
                  <code className="text-pink-400">duration</code>: Animation duration (ms)
                </li>
                <li>
                  <code className="text-pink-400">delay</code>: Initial delay before animation starts (ms)
                </li>
                <li>
                  <code className="text-pink-400">staggerDelay</code>: Delay between each element's animation (ms)
                </li>
              </ul>

              <h4 className="text-xl font-medium mb-2">Example</h4>
              <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`<BlurText 
  text="Hello, World!" 
  animateBy="words"
  direction="bottom"
  blur={10}
  duration={800}
  staggerDelay={50}
/>`}
                </code>
              </pre>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg">
              <h3 className="text-2xl font-medium mb-4">AnimatedMount</h3>
              <p className="mb-4">
                Animates elements when they enter or exit the viewport, with customizable animations.
              </p>

              <h4 className="text-xl font-medium mb-2">Props</h4>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                  <code className="text-pink-400">mountAnimation</code>: Animation to play when element enters viewport
                </li>
                <li>
                  <code className="text-pink-400">unmountAnimation</code>: Animation to play when element exits viewport
                </li>
                <li>
                  <code className="text-pink-400">threshold</code>: Intersection observer threshold
                </li>
                <li>
                  <code className="text-pink-400">once</code>: Whether to trigger animation only once
                </li>
                <li>
                  <code className="text-pink-400">onAnimationComplete</code>: Callback when animation completes
                </li>
              </ul>

              <h4 className="text-xl font-medium mb-2">Example</h4>
              <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`<AnimatedMount
  mountAnimation={{
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 500, easing: 'ease-out' }
  }}
>
  <div>Content to animate</div>
</AnimatedMount>`}
                </code>
              </pre>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg">
              <h3 className="text-2xl font-medium mb-4">AnimatedTransition</h3>
              <p className="mb-4">
                Animates between different states based on a state prop, with customizable transitions.
              </p>

              <h4 className="text-xl font-medium mb-2">Props</h4>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                  <code className="text-pink-400">state</code>: Current state name
                </li>
                <li>
                  <code className="text-pink-400">transitions</code>: Object mapping state names to transition
                  configurations
                </li>
                <li>
                  <code className="text-pink-400">onTransitionComplete</code>: Callback when transition completes
                </li>
              </ul>

              <h4 className="text-xl font-medium mb-2">Example</h4>
              <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`<AnimatedTransition
  state={currentState}
  transitions={{
    default: {
      from: { opacity: 1 },
      to: { opacity: 1 },
      config: { duration: 300 }
    },
    hidden: {
      from: { opacity: 1 },
      to: { opacity: 0 },
      config: { duration: 300 }
    }
  }}
>
  <div>Content to transition</div>
</AnimatedTransition>`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Hooks</h2>

          <div className="space-y-12">
            <div className="bg-gray-900 p-8 rounded-lg">
              <h3 className="text-2xl font-medium mb-4">useInView</h3>
              <p className="mb-4">Detects when an element enters or exits the viewport using Intersection Observer.</p>

              <h4 className="text-xl font-medium mb-2">Parameters</h4>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                  <code className="text-pink-400">ref</code>: Optional ref to observe (creates one if not provided)
                </li>
                <li>
                  <code className="text-pink-400">threshold</code>: Intersection observer threshold
                </li>
                <li>
                  <code className="text-pink-400">rootMargin</code>: Intersection observer root margin
                </li>
                <li>
                  <code className="text-pink-400">once</code>: Whether to trigger only once
                </li>
              </ul>

              <h4 className="text-xl font-medium mb-2">Returns</h4>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                  <code className="text-pink-400">ref</code>: Ref to attach to the element
                </li>
                <li>
                  <code className="text-pink-400">inView</code>: Whether the element is in view
                </li>
                <li>
                  <code className="text-pink-400">hasTriggered</code>: Whether the element has been in view
                </li>
              </ul>

              <h4 className="text-xl font-medium mb-2">Example</h4>
              <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`const { ref, inView } = useInView({ threshold: 0.5 })

return (
  <div ref={ref}>
    {inView ? 'Element is visible' : 'Element is hidden'}
  </div>
)`}
                </code>
              </pre>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg">
              <h3 className="text-2xl font-medium mb-4">useAnimation</h3>
              <p className="mb-4">Provides imperative control over animations using the Web Animations API.</p>

              <h4 className="text-xl font-medium mb-2">Parameters</h4>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                  <code className="text-pink-400">onStart</code>: Callback when animation starts
                </li>
                <li>
                  <code className="text-pink-400">onComplete</code>: Callback when animation completes
                </li>
                <li>
                  <code className="text-pink-400">autoPlay</code>: Whether to play animation automatically
                </li>
              </ul>

              <h4 className="text-xl font-medium mb-2">Returns</h4>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                  <code className="text-pink-400">ref</code>: Ref to attach to the element
                </li>
                <li>
                  <code className="text-pink-400">animate</code>: Function to start animation
                </li>
                <li>
                  <code className="text-pink-400">stop</code>: Function to stop animation
                </li>
                <li>
                  <code className="text-pink-400">pause</code>: Function to pause animation
                </li>
                <li>
                  <code className="text-pink-400">resume</code>: Function to resume animation
                </li>
                <li>
                  <code className="text-pink-400">isAnimating</code>: Whether animation is in progress
                </li>
              </ul>

              <h4 className="text-xl font-medium mb-2">Example</h4>
              <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`const { ref, animate, isAnimating } = useAnimation()

const handleClick = () => {
  animate(
    { opacity: 0, transform: 'scale(0.8)' },
    { opacity: 1, transform: 'scale(1)' },
    { duration: 500, easing: 'ease-out' }
  )
}

return (
  <>
    <div ref={ref}>Animated content</div>
    <button onClick={handleClick} disabled={isAnimating}>
      Animate
    </button>
  </>
)`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6">Integration Examples</h2>

          <div className="space-y-12">
            <div className="bg-gray-900 p-8 rounded-lg">
              <h3 className="text-2xl font-medium mb-4">Form Validation Feedback</h3>
              <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`function ContactForm() {
  const [formState, setFormState] = useState('idle')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormState('submitting')
    
    try {
      // Submit form logic
      setFormState('success')
    } catch (error) {
      setFormState('error')
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      
      <AnimatedTransition
        state={formState}
        transitions={{
          idle: {
            from: { opacity: 0 },
            to: { opacity: 0 },
          },
          submitting: {
            from: { opacity: 0 },
            to: { opacity: 0 },
          },
          success: {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
            config: { duration: 300 }
          },
          error: {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
            config: { duration: 300 }
          }
        }}
      >
        {formState === 'success' && (
          <div className="text-green-500">Form submitted successfully!</div>
        )}
        {formState === 'error' && (
          <div className="text-red-500">Error submitting form. Please try again.</div>
        )}
      </AnimatedTransition>
    </form>
  )
}`}
                </code>
              </pre>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg">
              <h3 className="text-2xl font-medium mb-4">Animated Page Transitions</h3>
              <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`function PageLayout({ children }) {
  const [isChanging, setIsChanging] = useState(false)
  const [content, setContent] = useState(children)
  
  useEffect(() => {
    if (children !== content) {
      setIsChanging(true)
    }
  }, [children, content])
  
  const handleTransitionComplete = (state) => {
    if (state === 'exiting') {
      setContent(children)
      setIsChanging('entering')
    } else if (state === 'entering') {
      setIsChanging(false)
    }
  }
  
  return (
    <AnimatedTransition
      state={isChanging ? 'exiting' : 'visible'}
      transitions={{
        visible: {
          from: { opacity: 1 },
          to: { opacity: 1 }
        },
        exiting: {
          from: { opacity: 1 },
          to: { opacity: 0 },
          config: { duration: 300 }
        },
        entering: {
          from: { opacity: 0 },
          to: { opacity: 1 },
          config: { duration: 300 }
        }
      }}
      onTransitionComplete={handleTransitionComplete}
    >
      {content}
    </AnimatedTransition>
  )
}`}
                </code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

