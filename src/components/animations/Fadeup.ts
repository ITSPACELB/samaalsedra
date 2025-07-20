import { onMounted, onBeforeUnmount, watch, nextTick } from "vue"
import { useRoute } from "vue-router"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type AnimationSettings = {
  opacity: number
  ease: string
  duration: number
  delay: number
  y?: number
  x?: number
  scrollTrigger?: {
    trigger: Element
    start: string
  }
}

export const useFadeUpAnimation = () => {
  const route = useRoute()

  const initAnimations = () => {
    const elements = document.querySelectorAll<HTMLElement>(".fade_up_anim")

    if (elements.length > 0) {
      elements.forEach((item) => {
        let fadeDirection = "bottom"
        let duration = 0.75
        let delay = 0.15
        const fadeOffset = 40
        const ease = "power2.out"

        if (item.dataset.duration) {
          duration = parseFloat(item.dataset.duration)
        }
        if (item.dataset.fadeFrom) {
          fadeDirection = item.dataset.fadeFrom
        }
        if (item.dataset.delay) {
          delay = parseFloat(item.dataset.delay)
        }

        const animationSettings: AnimationSettings = {
          opacity: 0,
          ease,
          duration,
          delay,
        }

        if (fadeDirection === "top") {
          animationSettings.y = -fadeOffset
        } else if (fadeDirection === "bottom") {
          animationSettings.y = fadeOffset
        } else if (fadeDirection === "left") {
          animationSettings.x = -fadeOffset
        } else if (fadeDirection === "right") {
          animationSettings.x = fadeOffset
        }

        animationSettings.scrollTrigger = {
          trigger: item,
          start: "top 90%",
        }

        gsap.from(item, animationSettings)
      })
    }
  }

  onMounted(async () => {
    await nextTick()
    initAnimations()
  })

  onBeforeUnmount(() => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  })

  watch(
    () => route.path,
    () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      initAnimations()
      ScrollTrigger.refresh()
    },
  )
}
