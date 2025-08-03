<script setup lang="ts">
import { PhFacebookLogo, PhGlobe } from "@phosphor-icons/vue"
import { useI18n } from "vue-i18n"
const { t, locale } = useI18n()

const partners = [
  {
    nameKey: "partners.chint.title",
    descKey: "partners.chint.desc",
    logo: "/images/partners/chint-logo.png",
    facebook: "https://www.facebook.com/people/Chisage-ESS/100043693098233/",
    website: "https://chisagess.com",
  },
  {
    nameKey: "partners.easun.title",
    descKey: "partners.easun.desc",
    logo: "/images/partners/easun-logo.png",
    facebook: "https://www.facebook.com/itelglobal/?brand_redir=809674532480003#",
    website: "https://www.itel-life.com/",
  },
  {
    nameKey: "partners.cospower.title",
    descKey: "partners.cospower.desc",
    logo: "/images/partners/cospower-logo.png",
    facebook: "https://www.facebook.com/watch/?v=836638461784351",
    website: "https://cospowers.in/",
  },
  {
    nameKey: "partners.sofar.title",
    descKey: "partners.sofar.desc",
    logo: "/images/partners/sofar-logo.png",
    facebook: "https://www.facebook.com/p/SOFAR-100085913521356/",
    website: "https://www.sofarsolar.com",
  },
  {
    nameKey: "partners.dyness.title",
    descKey: "partners.dyness.desc",
    logo: "/images/partners/dyness-logo.png",
    facebook: "https://www.facebook.com/Dynessess/",
    website: "https://www.dyness.com",
  },
  {
    nameKey: "partners.risen.title",
    descKey: "partners.risen.desc",
    logo: "/images/partners/risen-logo.png",
    facebook: "https://www.facebook.com/p/Risen-Energy-Co-Ltd-100064205252442/",
    website: "https://en.risen.com/",
  },
  {
    nameKey: "partners.powersolid.title",
    descKey: "partners.powersolid.desc",
    logo: "/images/partners/power solid-logo.png",
    facebook: "https://www.facebook.com/powersolidiq",
    website: "https://powersolid.vn/",
  }
]
</script>

<template>
  <section class="recent position-relative" id="recent">
    <div class="right-text d-none d-xl-block">
      <h2 class="vertical">{{ t('partners.vertical') }}</h2>
    </div>
    <div class="line"></div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="reveal reveal--left">
            <div class="recent-projects">
              <h2
                class="pb-1 fade_up_anim"
                :dir="locale === 'ar' ? 'rtl' : 'ltr'"
                :style="{ textAlign: locale === 'ar' ? 'right' : 'left' }"
              >
                {{ t('partners.title') }}
              </h2>

              <p
                class="pb-2 pb-lg-3 fade_up_anim small"
                data-delay=".3"
                :dir="locale === 'ar' ? 'rtl' : 'ltr'"
                :style="{ textAlign: locale === 'ar' ? 'right' : 'left' }"
              >
                {{ t('partners.desc') }}
              </p>

              <div class="d-flex flex-column gap-3 mt-3 mb-4 pb-lg-2">
                <div
                  v-for="(partner, i) in partners"
                  :key="i"
                  class="project-box py-3"
                  style="align-items: center;"
                >
                  <div class="d-flex justify-content-between align-items-center flex-wrap w-100 gap-3">
                    <div>
                      <h5>{{ t(partner.nameKey) }}</h5>
                      <p class="mb-0 small">{{ t(partner.descKey) }}</p>
                    </div>
                    <!-- ✅ اللوغو بجانب الأيقونات حتى على الموبايل -->
                    <div class="icons-group">
                      <img
                        width="40"
                        height="40"
                        :src="partner.logo"
                        class="img-fluid"
                        :alt="t(partner.nameKey)"
                      />
                      <a :href="partner.website" class="arrow-sm btn btn-light px-2 py-1" target="_blank" rel="noopener" title="الموقع الرسمي">
                        <PhGlobe size="21" />
                      </a>
                      <a :href="partner.facebook" class="arrow-sm btn btn-light px-2 py-1" target="_blank" rel="noopener" title="فيسبوك">
                        <PhFacebookLogo size="21" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-box img {
  flex-shrink: 0;
  object-fit: contain;
  background: white;
  border-radius: 8px;
}

.icons-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap; /* ✅ يمنع النزول للسطر الجديد */
}

@media (max-width: 768px) {
  .project-box .d-flex {
    flex-direction: column !important;
    text-align: center;
  }

  .icons-group {
    justify-content: center;
    flex-wrap: nowrap; /* ✅ يمنع التكديس فوق بعض */
  }
}
</style>
