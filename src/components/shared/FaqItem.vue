<script setup lang="ts">
const props = defineProps<{
  id: number;
  question: string;
  answer: string;
  opened: boolean;
  dir?: 'ltr' | 'rtl';
}>();

const emit = defineEmits(['toggle']);

function handleClick() {
  emit('toggle', props.id);
}
</script>

<template>
  <div class="accordion-item" :dir="props.dir">
    <div class="accordion-header" @click="handleClick" style="cursor:pointer;">
      <button
        class="accordion-button"
        :class="{ collapsed: !props.opened }"
        type="button"
        :aria-expanded="props.opened ? 'true' : 'false'"
        style="font-weight:bold;"
      >
        {{ props.question }}
      </button>
    </div>
    <div
      class="accordion-collapse collapse"
      :class="{ show: props.opened }"
    >
      <div class="accordion-body">
        <p class="mb-0" style="line-height:1.8;font-size:1.06rem;">{{ props.answer }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion-button::after {
  display: none !important;
}
.accordion-button::before {
  display: none !important;
}
</style>