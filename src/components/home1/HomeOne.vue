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
  <div class="main-layout">
    <!-- الأقسام العلوية -->
    <Navbar />
    <Banner />
    <About />
    <Services />
    <Experts />

    <!-- التقسيم من هون وطالع -->
<section class="two-column-section">
  <div class="container">
    <div class="row">
      <div class="col-lg-4">
        <Faq />
      </div>
      <div class="col-lg-8">
        <WhyChoose />
        <RecentProject />
        <Testimonial />
        <Footer />
      </div>
    </div>
  </div>
</section>
  </div>
</template>

<style scoped lang="scss">
.two-column-section {
  display: flex;
  align-items: flex-start;
  gap: 32px;

  // 🎯 نضبط المحاذاة لتكون مثل باقي الأقسام
  width: 100%;
  max-width: 1320px; // أو 1140px حسب تصميمك (جرب شوف شو أنسب)
  margin-left: auto;
  margin-right: auto;
  margin-top: 48px;

  @media (max-width: 992px) {
    flex-direction: column;
    padding-inline: 16px; // نرجّعها فقط للجوال
  }
}

.faq-side {
  flex: 0 0 35%;
  max-width: 400px;
  height: 100%;
  overflow-y: auto;
  padding-inline-end: 8px;

  @media (max-width: 992px) {
    max-width: 100%;
  }
}


.content-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 48px;

  @media (max-width: 992px) {
    gap: 32px;
  }
}
</style>

