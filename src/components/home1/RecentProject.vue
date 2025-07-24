<script setup lang="ts">
import { PhFacebookLogo, PhGlobe } from "@phosphor-icons/vue"
import { useI18n } from "vue-i18n"
const { t, locale } = useI18n()

const partners = [
  {
    nameKey: "partners.chint.title",
    descKey: "partners.chint.desc",
    logo: "/images/partners/chint-logo.png",
    facebook: "https://www.facebook.com/CHINTGlobal",
    website: "https://www.chintsolar.com",
  },
  {
    nameKey: "partners.easun.title",
    descKey: "partners.easun.desc",
    logo: "/images/partners/easun-logo.png",
    facebook: "https://www.facebook.com/EASUNPOWER",
    website: "https://www.easunpower.com",
  },
  {
    nameKey: "partners.cospower.title",
    descKey: "partners.cospower.desc",
    logo: "/images/partners/cospower-logo.png",
    facebook: "https://www.facebook.com/CosPowerTech",
    website: "https://www.cospower.com",
  },
  {
    nameKey: "partners.sofar.title",
    descKey: "partners.sofar.desc",
    logo: "/images/partners/sofar-logo.png",
    facebook: "https://www.facebook.com/sofar.solar",
    website: "https://www.sofarsolar.com",
  },
  {
    nameKey: "partners.dyness.title",
    descKey: "partners.dyness.desc",
    logo: "/images/partners/dyness-logo.png",
    facebook: "https://www.facebook.com/dyness.power",
    website: "https://www.dyness.com",
  },
  {
    nameKey: "partners.risen.title",
    descKey: "partners.risen.desc",
    logo: "/images/partners/risen-logo.png",
    facebook: "https://www.facebook.com/risenenergy",
    website: "https://www.risenenergy.com",
  },
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
              <!-- ✅ العنوان مع اتجاه حسب اللغة -->
              <h2
                class="pb-1 fade_up_anim"
                :dir="locale === 'ar' ? 'rtl' : 'ltr'"
                :style="{ textAlign: locale === 'ar' ? 'right' : 'left' }"
              >
                {{ t('partners.title') }}
              </h2>

              <!-- ✅ الوصف مع اتجاه حسب اللغة -->
              <p
                class="pb-2 pb-lg-3 fade_up_anim small"
                data-delay=".3"
                :dir="locale === 'ar' ? 'rtl' : 'ltr'"
                :style="{ textAlign: locale === 'ar' ? 'right' : 'left' }"
              >
                {{ t('partners.desc') }}
              </p>

              <!-- باقي الكود كما هو تماماً -->
              <div class="d-flex flex-column gap-3 mt-3 mb-4 pb-lg-2">
                <div
                  v-for="(partner, i) in partners"
                  :key="i"
                  class="project-box flex-wrap flex-sm-nowrap py-3"
                  style="align-items: center;"
                >
                  <img
                    width="88"
                    height="88"
                    :src="partner.logo"
                    class="img-fluid"
                    :alt="t(partner.nameKey)"
                    style="object-fit:contain;background:white;border-radius:16px;"
                  />
                  <div class="d-flex gap-2 gap-lg-3 gap-xl-4 align-items-center pe-3 flex-wrap flex-md-nowrap" style="flex:1;">
                    <div>
                      <h5>{{ t(partner.nameKey) }}</h5>
                      <p class="mb-0 small">{{ t(partner.descKey) }}</p>
                    </div>
                    <a :href="partner.website" class="arrow-sm btn btn-light px-2 py-1" target="_blank" rel="noopener" title="الموقع الرسمي">
                      <PhGlobe size="21" />
                    </a>
                    <a :href="partner.facebook" class="arrow-sm btn btn-light px-2 py-1" target="_blank" rel="noopener" title="فيسبوك">
                      <PhFacebookLogo size="21" />
                    </a>
                  </div>
                </div>
              </div>
              <!-- لا يوجد زر "شاهد الكل" لأن المحتوى كامل -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
