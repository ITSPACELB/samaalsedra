<script setup lang="ts">
import { PhArrowUpRight } from "@phosphor-icons/vue"
import { ref } from "vue"

type Props = {
  link: string
  cls?: string
  text?: string
}

const props = defineProps<Props>()
const x = ref("0px")
const y = ref("0px")

const handleMouseMove = (e: MouseEvent) => {
  const clientX = `${e.offsetX}px`
  const clientY = `${e.offsetY}px`

  x.value = clientX
  y.value = clientY
}
</script>

<template>
  <RouterLink :style="{ '--x': x, '--y': y }" @mousemove="handleMouseMove" :to="props.link" :class="`read-more-three ${props.cls}`">
    {{ props.text || "Read More" }}
    <span class="arrow-sm rounded-circle text-black bg-primary">
      <PhArrowUpRight />
    </span>
  </RouterLink>
</template>
