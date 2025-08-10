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
    <div class="footer-contact-section container py-2 px-3">
      <p class="text-white mb-4 text-center" style="max-width: 900px; margin-inline: auto">
        {{ t('footer.description') }}
      </p>

      <!-- ✅ المكاتب والفروع بالنص + الخرائط المصغّرة -->
      <div class="branch-list text-center mb-4">
        <!-- المكتب الرئيسي -->
        <p class="branch-title">{{ t('footer.mainOffice') }}</p>
        <p class="branch-address">{{ t('footer.mainOfficeAddress') }}</p>
        <p class="branch-phone no-flip">00964&nbsp;774&nbsp;999&nbsp;2888</p>
        <div class="mini-map-wrap">
          <iframe
            class="mini-map"
            title="Main Office Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624!2d44.3661!3d33.3152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15577f4a5a3f6b3d%3A0x4a7a3d5e3e1b8e1e!2sBaghdad!5e0!3m2!1sar!2siq!4v1721841600"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
        </div>

        <!-- فرع العامرية -->
        <p class="branch-title mt-4">{{ t('footer.branchAmeriya') }}</p>
        <p class="branch-address">{{ t('footer.branchAmeriyaAddress') }}</p>
        <p class="branch-phone no-flip">00964&nbsp;788&nbsp;005&nbsp;4047</p>
        <div class="mini-map-wrap">
          <!-- ملاحظة: استخدمت Embed بحث للعامرية بناءً على موقع "مجمع الشرق الأوسط" -->
          <iframe
            class="mini-map"
            title="Al-Ameriya Branch Map"
            src="https://www.google.com/maps?q=Al-Ameriya%20Middle%20East%20Complex%20Baghdad&hl=ar&z=15&output=embed"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
          <!-- زر اختياري لفتح اللينك الذي أعطيتني إياه مباشرةً -->
          <a
            class="open-in-maps"
            href="https://maps.app.goo.gl/DfMQf2GVx1cp5Ptx7"
            target="_blank"
            rel="noopener"
          >{{ t('footer.openInMaps') }}</a>
        </div>

        <!-- مركز التسوق -->
        <p class="branch-title mt-4">{{ t('footer.shoppingCenter') }}</p>
        <p class="branch-address">{{ t('footer.shoppingCenterAddress') }}</p>
      </div>

      <!-- أيقونات التواصل مع الإيميل -->
      <div class="d-flex flex-column align-items-center gap-3">
        <div class="d-flex align-items-center gap-2">
          <PhEnvelopeOpen />
          <a href="mailto:info@samaalsedra.com" class="text-white small no-flip">info@samaalsedra.com</a>
        </div>
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

    <!-- (تم حذف الخريطة الكبيرة السفلية حتى نستخدم المصغّرات فقط) -->

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

.footer-logo {
  width: 900px;
  max-width: 100%;
}

.branch-title {
  font-weight: bold;
  color: #fff;
  margin-bottom: 2px;
}

.branch-address,
.branch-phone {
  margin-bottom: 2px;
  color: #fff;
}

.branch-list p {
  margin: 0;
}

/* ✅ خريطة مصغّرة: نفس العرض، ارتفاع قليل جداً */
.mini-map-wrap {
  width: 100%;
  max-width: 900px;
  margin: 8px auto 0 auto;
  position: relative;
}
.mini-map {
  width: 100%;
  height: 90px;            /* ارتفاع صغير (سطرين تقريباً) */
  border: 0;
  display: block;
  border-radius: 8px;
  overflow: hidden;
  background: #0c0c0c;
}
.open-in-maps {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: #fff;
  text-decoration: underline;
  opacity: 0.85;
}

/* أيقونات */
.social-link a {
  font-size: 1.5rem;
  color: #fff;
  transition: transform 0.3s ease;
}
.social-link a:hover {
  transform: scale(1.2);
  color: #ffc107;
}

/* ✅ منع قلب الأرقام على iPhone */
.no-flip {
  direction: ltr !important;
  unicode-bidi: bidi-override;
  display: inline-block;
}

/* العنوان اللامع */
.blink-text {
  font-weight: bold;
  font-size: 1.2rem;
  animation: blinkColor 1s infinite;
}
@keyframes blinkColor {
  0%, 100% { color: red; }
  50% { color: white; }
}

/* تحسين بسيط لأحجام الخريطة المصغّرة على الشاشات الأكبر */
@media (min-width: 768px) {
  .mini-map { height: 100px; }
}
@media (min-width: 1200px) {
  .mini-map { height: 110px; }
}
</style>
