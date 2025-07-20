<script setup lang="ts">
import { PhCaretDown } from "@phosphor-icons/vue"
import { onClickOutside } from "@vueuse/core"
import { ref, watch, computed } from "vue"
import type { VNodeRef } from "vue"
interface SelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number
  options: SelectOption[]
  placeholder?: string
  label?: string
  disabled?: boolean
  transparent?: boolean
  cls?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Choose...",
  disabled: false,
})

const emit = defineEmits(["update:modelValue"])

const isOpen = ref(false)
const selectedOption = ref<SelectOption | null>(null)

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectOption = (option: SelectOption) => {
  selectedOption.value = option
  isOpen.value = false
  emit("update:modelValue", option.value)
}

const displayValue = computed(() => {
  return selectedOption.value ? selectedOption.value.label : props.placeholder
})

watch(
  () => props.modelValue,
  (newValue) => {
    const option = props.options.find((opt) => opt.value === newValue)
    if (option) {
      selectedOption.value = option
    } else {
      selectedOption.value = null
    }
  },
)

// Initialize the selected option
watch(
  () => props.options,
  () => {
    const option = props.options.find((opt) => opt.value === props.modelValue)
    if (option) {
      selectedOption.value = option
    }
  },
  { immediate: true },
)

const selectRef = ref<VNodeRef | null>(null)
onClickOutside(selectRef, () => (isOpen.value = false))
</script>

<template>
  <div ref="selectRef" class="custom-select" :style="{ zIndex: isOpen ? '3' : '2' }">
    <div class="select-wrapper" :class="[{ 'is-open': isOpen, 'is-disabled': disabled, 'bg-transparent border-0': transparent }, cls]" @click="toggleDropdown">
      <div class="select-value" :class="{ 'text-white': transparent }">{{ displayValue }}</div>
      <div class="select-arrow" :class="{ 'text-white': transparent }">
        <PhCaretDown />
      </div>
    </div>
    <Transition name="fade">
      <div v-if="isOpen" class="select-dropdown shadow mini-scrollbar">
        <div v-for="option in options" :key="option.value" class="select-option" :class="{ 'is-selected': option.value === selectedOption?.value }" @click="selectOption(option)">
          {{ option.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
