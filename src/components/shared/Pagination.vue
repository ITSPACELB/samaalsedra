<script setup lang="ts">
import { PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue"
</script>
<template>
  <ul class="list-unstyled mt-4 pt-lg-3 d-flex justify-content-center gap-3 pagination">
    <li>
      <a href="#">
        <PhCaretLeft />
      </a>
    </li>
    <li>
      <a href="#" class="active"> 1 </a>
    </li>
    <li>
      <a href="#">2</a>
    </li>
    <li>
      <a href="#">3</a>
    </li>
    <li>
      <a href="#">...</a>
    </li>
    <li>
      <a href="#">
        <PhCaretRight />
      </a>
    </li>
  </ul>
</template>
