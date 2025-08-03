<script setup lang="ts">
import { useI18n } from "vue-i18n"
import {
  PhArrowUpRight,
  PhEnvelopeOpen,
  PhFacebookLogo,
  PhInstagramLogo,
  PhPhoneCall,
} from "@phosphor-icons/vue"
import logo from "/images/partners/mansour.png"

const { t, locale } = useI18n()
</script>

<template>
  <footer class="footer position-relative">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-12 left-col pe-0">
          <div class="cta reveal reveal--left reveal--overlay text-center">
            <div class="cta-content">
              <h2 class="mb-2 fade_up_anim">{{ t('footer.ctaTitle') }}</h2>
              <p class="mb-3 mb-xl-4 fade_up_anim" data-delay=".3">{{ t('footer.ctaDesc') }}</p>
              <a
                href="https://wa.me/+9647749992888"
                target="_blank"
                class="black-btn d-inline-flex align-items-center gap-2 px-4 py-2"
              >
                {{ t('footer.ctaBtn') }} <PhArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- جملة العنوان فوق اللوغو -->
    <p class="description text-center mb-3 blink-text">
      {{ t('footer.addressText') }}
    </p>

    <!-- الشعار -->
    <div class="footer-logo-wrapper container text-center my-4">
      <img :src="logo" alt="Logo" class="footer-logo" />
    </div>

    <!-- جملة الشرح -->
    <div
      class="footer-contact-section container py-2 px-3"
      :class="locale === 'ar' ? 'text-end' : 'text-start'"
    >
      <p class="text-white mb-4" style="max-width: 900px; margin-inline: auto">
        {{ t('footer.description') }}
      </p>

      <div class="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <!-- تواصل معنا -->
        <ul class="contact list-unstyled d-flex flex-column flex-md-row gap-3 m-0">
          <li class="contact-item d-flex align-items-center gap-2">
            <div class="contact-icon"><PhPhoneCall /></div>
            <a href="tel:+9647749992888" class="text-white small no-flip">00964 774 999 2888</a>
          </li>
          <li class="contact-item d-flex align-items-center gap-2">
            <div class="contact-icon"><PhPhoneCall /></div>
            <a href="tel:009647820000000" class="text-white small no-flip">00964 782 000 0000</a>
          </li>
          <li class="contact-item d-flex align-items-center gap-2">
            <div class="contact-icon"><PhEnvelopeOpen /></div>
            <a href="mailto:info@samaalsedra.com" class="text-white small no-flip">info@samaalsedra.com</a>
          </li>
        </ul>

        <!-- أيقونات التواصل -->
        <ul class="social-link d-flex gap-3 mb-0">
          <li>
            <a href="https://www.facebook.com/profile.php?id=61567916993019" target="_blank" rel="noopener" aria-label="Facebook">
              <PhFacebookLogo />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/sm_lsdr/" target="_blank" rel="noopener" aria-label="Instagram">
              <PhInstagramLogo />
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- خارطة جوجل -->
    <div class="map-container w-100">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624!2d44.3661!3d33.3152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15577f4a5a3f6b3d%3A0x4a7a3d5e3e1b8e1e!2sBaghdad!5e0!3m2!1sar!2siq!4v1721841600"
        width="100%"
        height="240"
        frameborder="0"
        style="border:0; display:block"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>

    <!-- حقوق النشر -->
    <div class="text-center py-4">
      <a
        href="https://qrbrand.net"
        class="text-white small text-decoration-none"
        target="_blank"
        rel="noopener"
      >
        All rights reserved © QRBRAND LTD
      </a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #0c0c0c;
  color: #fff;
  font-size: 15px;
}

.footer-contact-section {
  padding-top: 1rem;
  padding-bottom: 1rem;
  text-align: start;
}

.footer-logo {
  width: 900px;
  max-width: 100%;
}

.contact-icon {
  font-size: 1.2rem;
  color: #fff;
  margin-top: 2px;
}

.social-link a {
  font-size: 1.5rem;
  color: #fff;
  transition: transform 0.3s ease;
}

.social-link a:hover {
  transform: scale(1.2);
  color: #ffc107;
}

.map-container iframe {
  height: 240px;
  width: 100%;
  background-color: #0c0c0c;
}

/* ✅ حل قلب الأرقام */
.no-flip {
  direction: ltr !important;
  unicode-bidi: bidi-override;
  display: inline-block;
}

/* ✅ نص العنوان يومض بين الأحمر والأبيض */
.blink-text {
  font-weight: bold;
  font-size: 1.2rem;
  animation: blinkColor 1s infinite;
}

@keyframes blinkColor {
  0%, 100% {
    color: red;
  }
  50% {
    color: white;
  }
}

@media (min-width: 768px) {
  .map-container iframe {
    height: 280px;
  }
}

@media (min-width: 1200px) {
  .map-container iframe {
    height: 320px;
  }
}
</style>
