<script setup lang="ts">
import FaqItem from "../shared/FaqItem.vue";
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue"; // زيدي computed
const showAll = ref(false); // جديد

const visibleFaqs = computed(() => {
  return showAll.value ? faqs : faqs.slice(0, 3);
});

const { locale } = useI18n();

const faqs = [
  {
          id: 1,
          q: {
            ar: "ما هي مكونات منظومة الطاقة الشمسية؟",
            en: "What are the components of a solar power system?"
          },
          a: {
            ar: "تتكون منظومة الطاقة الشمسية عادةً من الألواح الشمسية، بطاريات التخزين، منظم الشحن، والإنفرتر، بالإضافة إلى نظام الحماية والكابلات.",
            en: "A typical solar system includes solar panels, storage batteries, a charge controller, an inverter, and protective wiring and equipment."
          }
        },
        {
          id: 2,
          q: {
            ar: "هل يمكن لمنظومة الطاقة الشمسية أن تعمل ليلاً؟",
            en: "Can a solar system work at night?"
          },
          a: {
            ar: "لا تولد الألواح الشمسية الكهرباء ليلاً، لكن عند استخدام بطاريات تخزين، يمكن استخدام الطاقة المخزنة لتشغيل الأحمال أثناء الليل.",
            en: "Solar panels do not generate electricity at night, but with storage batteries, you can use the stored power to run appliances during nighttime."
          }
        },
        {
          id: 3,
          q: {
            ar: "كم سنة تدوم منظومة الطاقة الشمسية؟",
            en: "How long does a solar system last?"
          },
          a: {
            ar: "عمر الألواح الشمسية يصل إلى 25 سنة أو أكثر، بينما البطاريات تعتمد على نوعها وتدوم عادة بين 5 إلى 15 سنة.",
            en: "Solar panels typically last 25 years or more. Battery lifespan varies by type, usually ranging from 5 to 15 years."
          }
        },
        {
          id: 4,
          q: {
            ar: "هل تحتاج منظومة الطاقة الشمسية إلى صيانة مستمرة؟",
            en: "Does a solar system require regular maintenance?"
          },
          a: {
            ar: "تتطلب المنظومة صيانة دورية خفيفة مثل تنظيف الألواح وفحص التوصيلات الكهربائية لضمان الأداء الأمثل.",
            en: "Solar systems require minimal maintenance, mainly cleaning panels and checking connections to ensure optimal performance."
          }
        },
        {
          id: 5,
          q: {
            ar: "كيف يتم حساب عدد الألواح والبطاريات المطلوبة؟",
            en: "How is the number of required panels and batteries calculated?"
          },
          a: {
            ar: "يتم ذلك بناءً على استهلاكك اليومي (بالواط أو الأمبير/ساعة)، وعدد ساعات القطع، ونوع الأجهزة. حاسبتنا الذكية تساعدك بهذه العملية بدقة.",
            en: "This depends on your daily consumption (in watts or amp-hours), outage duration, and device types. Our smart calculator can assist you with precise planning."
          }
        },
        {
          id: 6,
          q: {
            ar: "هل يمكن توسيع المنظومة لاحقًا إذا زاد الاستهلاك؟",
            en: "Can the system be expanded later if my energy needs grow?"
          },
          a: {
            ar: "نعم، معظم المنظومات مصممة لتكون قابلة للتوسعة، سواء بإضافة ألواح أو بطاريات أو حتى تغيير الإنفرتر لاحقًا.",
            en: "Yes, most systems are designed to be scalable — you can add panels, batteries, or even upgrade the inverter later."
          }
        },
        {
          id: 7,
          q: {
            ar: "هل تؤثر جودة الإنفرتر على أداء المنظومة؟",
            en: "Does inverter quality affect the performance of the system?"
          },
          a: {
            ar: "نعم، الإنفرتر مسؤول عن تحويل التيار وتوزيعه، وجودة تصنيعه تؤثر على الكفاءة، استهلاك الطاقة، وحتى عمر البطاريات.",
            en: "Yes, the inverter manages conversion and distribution. Its quality affects efficiency, energy use, and even battery lifespan."
          }
        },
        {
          id: 8,
          q: {
            ar: "ما هو الفرق بين الإنفرتر العادي والـ Hybrid؟",
            en: "What’s the difference between a regular inverter and a hybrid inverter?"
          },
          a: {
            ar: "الإنفرتر العادي يربط النظام بالمولد أو الشبكة فقط، أما الـ Hybrid فيجمع بين الشبكة، البطارية، والطاقة الشمسية، ويعمل تلقائياً عند الانقطاع.",
            en: "A regular inverter connects only to the grid or generator, while a hybrid one combines grid, battery, and solar and works automatically during outages."
          }
        },
        {
          id: 9,
          q: {
            ar: "هل يمكن استخدام الطاقة الشمسية لتشغيل أجهزة التكييف؟",
            en: "Can solar power run air conditioning units?"
          },
          a: {
            ar: "نعم، لكن يُفضّل استخدام أجهزة تكييف عالية الكفاءة (Inverter AC) واختيار بطاريات وإنفرتر مناسبين لتحمّل الحمل العالي.",
            en: "Yes, but it's recommended to use high-efficiency ACs (like inverter ACs) and ensure your battery and inverter can handle the load."
          }
        },
        {
          id: 10,
          q: {
            ar: "هل صحيح أن الألواح لا تولد كهرباء في الشتاء أو الغيوم؟",
            en: "Is it true that panels don’t produce electricity in winter or cloudy days?"
          },
          a: {
            ar: "تنتج الألواح الكهرباء حتى في الجو الغائم، ولكن بنسبة أقل. وقد تكون فعّالة أكثر بالشتاء لأن البرودة تقلل الفاقد الحراري.",
            en: "Panels still produce electricity on cloudy days, just less. They may be more efficient in winter due to lower heat losses."
          }
        },
        {
          id: 11,
          q: {
            ar: "ما هو الانفرتر، ولماذا هو مهم في النظام الشمسي؟",
            en: "What is an inverter, and why is it important in a solar system?"
          },
          a: {
            ar: "الانفرتر يحوّل التيار المستمر DC الناتج من الألواح إلى تيار متردد AC يمكن استخدامه في الأجهزة المنزلية. هو قلب النظام الشمسي، ويؤثر على كفاءة وأداء المنظومة بالكامل.",
            en: "The inverter converts DC electricity from panels into AC power usable by appliances. It's the heart of the solar system and affects its efficiency and performance."
          }
        },
        {
          id: 12,
          q: {
            ar: "هل تؤثر المسافة بين الألواح والبطاريات على الكفاءة؟",
            en: "Does distance between panels and batteries affect efficiency?"
          },
          a: {
            ar: "نعم، الكابلات الطويلة تسبب فقد في الجهد والطاقة. يجب حساب المقاطع بدقة لتقليل الفاقد وضمان كفاءة التوصيل.",
            en: "Yes, long cables lead to voltage drop and energy loss. Proper cable sizing ensures minimal loss and better efficiency."
          }
        },
        {
          id: 13,
          q: {
            ar: "متى يكون النظام الشمسي غير مناسب؟",
            en: "When is a solar system not suitable?"
          },
          a: {
            ar: "إذا كان المكان مظلل بشكل دائم أو لا توجد مساحة كافية لتركيب الألواح، أو في حال كان الاستهلاك غير منتظم جداً دون بطاريات مناسبة.",
            en: "If the site is heavily shaded, lacks panel space, or has irregular consumption without suitable batteries, solar may not be ideal."
          }
        },
        {
          id: 14,
          q: {
            ar: "هل تعمل المنظومة الشمسية أثناء انقطاع الكهرباء الوطنية؟",
            en: "Does the solar system work during national power outages?"
          },
          a: {
            ar: "نعم، إذا كانت المنظومة تحتوي على بطاريات وإنفرتر من نوع \"hybrid\" أو \"off-grid\"، فهي قادرة على العمل تلقائياً عند انقطاع الكهرباء الوطنية.",
            en: "Yes, if your system includes batteries and a hybrid or off-grid inverter, it can automatically operate during national power outages."
          }
        },
        {
          id: 15,
          q: {
            ar: "هل تؤثر درجات الحرارة العالية في العراق على أداء الألواح الشمسية؟",
            en: "Do Iraq’s high temperatures affect solar panel performance?"
          },
          a: {
            ar: "نعم بشكل طفيف. فكلما زادت الحرارة فوق 25°C، يقل الأداء قليلاً، لكن الألواح عالية الجودة مصممة لتحمل حتى 70°C وتبقى فعّالة.",
            en: "Yes, slightly. Performance decreases as temperatures rise above 25°C, but high-quality panels are designed to handle up to 70°C efficiently."
          }
        },
        {
          id: 16,
          q: {
            ar: "ما الفرق بين الألواح الأحادية (Mono) والمتعددة (Poly)؟",
            en: "What is the difference between Mono and Poly solar panels?"
          },
          a: {
            ar: "الألواح الأحادية أكثر كفاءة وتعمل بشكل أفضل في المناطق ذات الإضاءة الضعيفة، بينما الألواح المتعددة أرخص لكنها أقل كفاءة نسبياً.",
            en: "Mono panels are more efficient and perform better in low-light conditions, while Poly panels are cheaper but slightly less efficient."
          }
        },
        {
          id: 17,
          q: {
            ar: "هل يمكن تركيب الألواح على الأسطح غير المستوية أو المظللة؟",
            en: "Can panels be installed on uneven or shaded roofs?"
          },
          a: {
            ar: "يمكننا استخدام هياكل تركيب خاصة لتجاوز عدم تساوي السطح، أما الظلال فتؤثر سلباً ويجب تجنّبها باستخدام تصميم هندسي مناسب أو تقنيات مثل micro-inverters.",
            en: "We can use special mounting structures to adjust for uneven surfaces. Shading reduces performance, but it can be managed with good design or technologies like micro-inverters."
          }
        },
        {
          id: 18,
          q: {
            ar: "هل يمكن ربط الطاقة الشمسية مع المولد الكهربائي؟",
            en: "Can a solar system be integrated with a diesel generator?"
          },
          a: {
            ar: "نعم، بعض الأنظمة الحديثة تسمح بالربط الذكي بين الإنفرتر والمولد لتوفير طاقة متواصلة وتقليل استهلاك الوقود.",
            en: "Yes, modern systems allow smart integration between the inverter and diesel generators to ensure continuous power and reduce fuel usage."
          }
        },
        {
          id: 19,
          q: {
            ar: "هل تؤثر كمية الغبار على فعالية الألواح الشمسية؟",
            en: "Does dust affect the efficiency of solar panels?"
          },
          a: {
            ar: "نعم، تراكم الغبار يقلل من امتصاص الضوء ويؤدي لانخفاض في الإنتاج بنسبة قد تصل إلى 20%. لذلك يُنصح بتنظيف الألواح بانتظام خصوصاً في المناطق الجافة مثل العراق.",
            en: "Yes, dust buildup reduces light absorption and can lower output by up to 20%. Regular cleaning is recommended, especially in dry regions like Iraq."
          }
        },
        {
          id: 20,
          q: {
            ar: "هل توفر الطاقة الشمسية فعلاً توفير مالي على المدى الطويل؟",
            en: "Does solar energy actually save money in the long run?"
          },
          a: {
            ar: "نعم، رغم التكلفة الأولية، إلا أن الفواتير الشهرية تنخفض بشكل كبير، وتُسترد التكلفة خلال 3 إلى 5 سنوات حسب حجم الاستهلاك. بعدها تصبح الطاقة مجانية تقريبًا.",
            en: "Yes, despite the upfront cost, monthly bills drop significantly. The investment is usually recouped within 3–5 years, after which energy is nearly free."
          }
        },
    ];


const opened = ref<number | null>(faqs[0]?.id ?? null);
function toggleFaq(id: number) {
  opened.value = opened.value === id ? null : id;
}
</script>

<template>
  <section class="faq faq-home py-5">
    <div class="container overflow-x-hidden">
      <div class="row flex-column flex-lg-row g-5 align-items-stretch">
        <!-- Start Right Column: FAQ -->
        <div class="col-lg-10 mx-auto">
          <div class="about-line-2"></div>
          <h2 class="fade_up_anim mb-2 sama-title">
            {{ locale === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions' }}
          </h2>
          <p class="mb-3 mb-xl-4 pb-2 fade_up_anim" data-delay=".3">
            {{
              locale === 'ar'
                ? 'نقدم لك أجوبة واضحة وعلمية عن أبرز الاستفسارات حول الطاقة الشمسية وخدماتنا.'
                : 'Clear and scientific answers to common questions about solar energy and our services.'
            }}
          </p>

          <!-- عرض الأسئلة -->
          <div class="accordion d-flex flex-column gap-3 gap-lg-4" id="accordionExample">
<FaqItem
  v-for="faq in visibleFaqs"
  :key="faq.id"
  :id="faq.id"
  :question="faq.q[locale as 'ar' | 'en']"
  :answer="faq.a[locale as 'ar' | 'en']"
  :opened="opened === faq.id"
  @toggle="toggleFaq"
/>

            <!-- زر عرض المزيد -->
            <div class="text-center mt-4 fade_up_anim" data-delay=".5">
              <button class="btn btn-outline-primary px-4 py-2 rounded-3"
                      @click="showAll = !showAll">
                {{
                  showAll
                    ? (locale === 'ar' ? 'عرض أقل' : 'Show Less')
                    : (locale === 'ar' ? 'عرض المزيد' : 'Show More')
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sama-title {
  color:rgb(5, 52, 12) !important;
  font-weight: 800;
}
</style>