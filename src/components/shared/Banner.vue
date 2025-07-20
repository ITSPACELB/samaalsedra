<script setup lang="ts">
import { PhCaretRight } from "@phosphor-icons/vue"
import Lines from "./Lines.vue"

type Props = {
  bgImage: string
  title: string
}
defineProps<Props>()
</script>
<template>
  <section class="page-banner" :style="{ backgroundImage: `url(/images/${bgImage})` }">
    <Lines />
    <div class="container">
      <div class="row justify-content-center text-center">
        <div class="col-lg-8 col-xxl-7 col-3xl-6 z-2 banner-content px-3">
          <h2 class="display-4 text-white mb-3 fade_up_anim">{{ title }}</h2>
          <ul class="list-unstyled d-flex justify-content-center align-items-center gap-2 fade_up_anim mb-0" data-delay=".3">
            <li>
              <RouterLink to="/" class="text-white"> Home </RouterLink>
            </li>
            <li>
              <PhCaretRight class="text-white" />
            </li>
            <li>
              <span class="text-primary">{{ title }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
