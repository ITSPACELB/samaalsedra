<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { RouterLink } from "vue-router"
import {
  PhArrowUpRight,
  PhEnvelopeOpen,
  PhFacebookLogo,
  PhInstagramLogo,
  PhLinkedinLogo,
  PhMapPin,
  PhPaperPlaneTilt,
  PhPhoneCall,
  PhTwitterLogo,
} from "@phosphor-icons/vue"
import logo from "/images/logo.png"

const { t, locale } = useI18n()
</script>

<template>
  <footer class="footer position-relative">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 left-col pe-0">
          <div>
            <div class="cta reveal reveal--left reveal--overlay">
              <div class="cta-content">
                <h2 class="mb-2 fade_up_anim">{{ t('footer.ctaTitle') }}</h2>
                <p class="mb-3 mb-xl-4 fade_up_anim" data-delay=".3">{{ t('footer.ctaDesc') }}</p>
                <a
                  href="https://wa.me/009647800530333"
                  target="_blank"
                  class="black-btn"
                  style="display: inline-flex; align-items: center;"
                >
                  {{ t('footer.ctaBtn') }} <PhArrowUpRight />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="position-relative overflow-x-hidden">
      <div class="container footer-up">
        <div class="row g-3 g-lg-4">
          <div class="col-md-6 col-xl-3">
            <div class="footer-card fade_up_anim">
              <a href="/"><img :src="logo" class="img-fluid mb-4" alt="Sama Al-Sedra Logo" /></a>
              <p class="mb-4 pb-lg-3 text-white">{{ t('footer.desc') }}</p>
              <ul class="social-link">
                <li>
                  <a href="https://www.facebook.com/profile.php?id=61567916993019" target="_blank" rel="noopener noreferrer">
                    <PhFacebookLogo />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/sm_lsdr/" target="_blank" rel="noopener noreferrer">
                    <PhInstagramLogo />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div class="col-md-6 col-xl-3">
            <div class="footer-card fade_up_anim" data-delay=".2">
              <!-- روابط القائمة السريعة مخفية -->
            </div>
          </div>

          <div class="col-md-6 col-xl-3">
            <div class="footer-card fade_up_anim" data-delay=".4">
              <h3 class="text-white pb-3">{{ t('footer.contact') }}</h3>
              <ul class="contact">
                <li class="contact-item">
                  <div class="contact-icon"><PhPhoneCall /></div>
                  <div class="d-flex flex-column gap-1">
                    <a href="tel:009647749992888" class="text-white">00964 774 999 2888</a>
                    <a href="tel:009647820000000" class="text-white">00964 782 000 0000</a>
                  </div>
                </li>
                <li class="contact-item">
                  <div class="contact-icon"><PhEnvelopeOpen /></div>
                  <div class="d-flex flex-column gap-1">
                    <a href="mailto:info@samaalsedra.com" class="text-white">info@samaalsedra.com</a>
                  </div>
                </li>
                <li class="contact-item">
                  <div class="contact-icon"><PhMapPin /></div>
                  <div class="d-flex flex-column gap-1">
                    <a
                      href="https://maps.app.goo.gl/kACRTDJPCiwboe4p6"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-white d-inline-block"
                      style="text-decoration: none; position: relative;"
                    >
                      <span class="text-white" style="display: inline-block;">{{ t('footer.addressText') }}</span>
                      <span style="display: inline-block; position: relative; margin-top: 5px; width: 100%; height: 20px;">
                        <span
                          style="
                            display: block;
                            width: 100%;
                            height: 2px;
                            background: repeating-linear-gradient(to right, #fff 0 5px, transparent 5px 10px);
                            position: absolute;
                            bottom: 0;
                          "
                        ></span>
                        <span
                          class="animated-car"
                          style="position: absolute; bottom: 3px; left: 0; font-size: 1.2em;"
                        >
                          🚕
                        </span>
                      </span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="col-md-6 col-xl-3">
            <div class="footer-card fade_up_anim" data-delay=".6">
              <!-- النشرة الإخبارية مخفية -->
            </div>
          </div>
        </div>
      </div>

      <div class="container copyright">
        <div class="row">
          <div class="col-12">
            <div class="footer-card d-flex flex-wrap gap-3 align-items-center justify-content-between px-3">
              <p class="text-white">{{ t('footer.copyright') }}</p>
              <ul class="list-unstyled d-flex flex-wrap align-items-center mb-0 ps-0 gap-2">
                <li><a href="#" class="text-white">{{ t('footer.privacy') }}</a></li>
                <li class="text-primary text-sm d-none d-sm-block">•</li>
                <li><a href="#" class="text-white">{{ t('footer.terms') }}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/_mixins.scss";

.footer {
  @include preserve-layout($key: 'md');
}

@keyframes drive-alternate {
  0% {
    left: 0%;
    transform: scaleX(1);
  }
  49.999% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(-1);
  }
  100% {
    left: 100%;
    transform: scaleX(-1);
  }
}

.animated-car {
  animation: drive-alternate 6s ease-in-out infinite alternate;
}

@keyframes drive {
  0% {
    left: 0;
  }
  100% {
    left: 100%;
  }
}

[dir-auto] {
  unicode-bidi: plaintext;
  direction: inherit;
}
</style>
