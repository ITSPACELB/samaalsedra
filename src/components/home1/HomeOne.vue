<script setup lang="ts">
import { useFadeUpAnimation } from "@/components/animations/Fadeup"
import { useRevealAnimation } from "@/components/animations/Reveal"
import About from "@/components/home1/About.vue"
import Banner from "@/components/home1/Banner.vue"
import Experts from "@/components/home1/Experts.vue"
import Faq from "@/components/home1/Faq.vue"
import Footer from "@/components/home1/Footer.vue"
import RecentProject from "@/components/home1/RecentProject.vue"
import Services from "@/components/home1/Services.vue"
import Testimonial from "@/components/home1/Testimonial.vue"
import WhyChoose from "@/components/home1/WhyChoose.vue"
import Navbar from "@/components/shared/Navbar.vue"

useRevealAnimation()
useFadeUpAnimation()
</script>

<template>
  <Navbar />
  <Banner />
  <About />
  <Services />
  <WhyChoose />
  <RecentProject />
  <Experts />
  <Testimonial />
  <Faq />
  <Footer />
</template>

