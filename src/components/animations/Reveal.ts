import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useRevealAnimation() {
  const route = useRoute()

  const initializeAnimations = () => {
    const revealContainers = document.querySelectorAll<HTMLElement>('.reveal')

    revealContainers.forEach((container) => {
      let clipPath: string | undefined

      // Determine clip path based on reveal direction
      if (container.classList.contains('reveal--left')) {
        clipPath = 'inset(0 0 0 100%)'
      } else if (container.classList.contains('reveal--right')) {
        clipPath = 'inset(0 100% 0 0)'
      } else if (container.classList.contains('reveal--top')) {
        clipPath = 'inset(0 0 100% 0)'
      } else if (container.classList.contains('reveal--bottom')) {
        clipPath = 'inset(100% 0 0 0)'
      }

      const image = container.querySelector('img') || container.querySelector('div')

      // Animation trigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play none none none',
        },
      })

      // Animation timeline
      tl.set(container, { autoAlpha: 1 })
      tl.from(container, {
        clipPath,
        duration: 1.2,
        delay: 0.2,
        ease: 'Power4.easeInOut',
      })

      if (container.classList.contains('reveal--overlay')) {
        tl.from(image, {
          clipPath,
          duration: 0.4,
          ease: 'Power4.easeOut'
        })
      }

      tl.from(image, {
        scale: 1.4,
        duration: 1.3,
        delay: -1,
        ease: 'Power2.easeOut',
      })
    })

    ScrollTrigger.refresh()
  }

  // Initialize on component mount
  onMounted(() => {
    initializeAnimations()
  })

  // Watch for route changes and reinitialize
  watch(
    () => route.fullPath,
    () => {
      initializeAnimations()
    }
  )

  // Cleanup on unmount
  onUnmounted(() => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  })
}