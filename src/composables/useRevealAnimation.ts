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

      if (container.classList.contains('reveal--left')) {
        clipPath = 'inset(0 0 0 100%)'
      } else if (container.classList.contains('reveal--right')) {
        clipPath = 'inset(0 100% 0 0)'
      } else if (container.classList.contains('reveal--top')) {
        clipPath = 'inset(0 0 100% 0)'
      } else if (container.classList.contains('reveal--bottom')) {
        clipPath = 'inset(100% 0 0 0)'
      }

      const target = container.querySelector('img') || container.querySelector('div') || container

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play none none none',
        },
      })

      tl.set(container, { autoAlpha: 1 })
      tl.from(container, {
        clipPath,
        duration: 1.2,
        delay: 0.2,
        ease: 'Power4.easeInOut',
      })

      tl.from(target, {
        scale: 1.4,
        duration: 1.3,
        delay: -1,
        ease: 'Power2.easeOut',
      })
    })

    ScrollTrigger.refresh()
  }

  onMounted(() => {
    initializeAnimations()
  })

  watch(() => route.fullPath, () => {
    initializeAnimations()
  })

  onUnmounted(() => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  })
}
