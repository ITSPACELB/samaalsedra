<script setup lang="ts">
import product5 from "/images/product-5.webp"
import product6 from "/images/product-6.webp"
import product7 from "/images/product-7.webp"
import product8 from "/images/product-8.webp"
import { PhShoppingCartSimple, PhX } from "@phosphor-icons/vue"
defineProps<{ white?: boolean }>()
</script>
<template>
  <div class="dropdown cart-dropdown">
    <button aria-label="show cart dropdown" :class="`cart-open text-xl ${white ? 'text-white' : ''}`" data-bs-toggle="dropdown">
      <PhShoppingCartSimple size="22" />
    </button>
    <div class="dropdown-menu dropdown-menu-end">
      <p class="cart-title">Cart(3)</p>
      <div class="cart-item-list">
        <div class="cart-item">
          <img :src="product5" width="60" alt="" />
          <div class="cart-item-content">
            <h6>Solar Inverter</h6>
            <p>1 x $250.00</p>
          </div>
          <button class="cart-item-remove">
            <PhX />
          </button>
        </div>
        <div class="cart-item">
          <img :src="product6" width="60" alt="" />
          <div class="cart-item-content">
            <h6>Battery Controller</h6>
            <p>1 x $250.00</p>
          </div>
          <button class="cart-item-remove">
            <PhX />
          </button>
        </div>
        <div class="cart-item">
          <img :src="product7" width="60" alt="" />
          <div class="cart-item-content">
            <h6>Solar Package</h6>
            <p>1 x $250.00</p>
          </div>
          <button class="cart-item-remove">
            <PhX />
          </button>
        </div>
        <div class="cart-item">
          <img :src="product8" width="60" alt="" />
          <div class="cart-item-content">
            <h6>Solar Inverter</h6>
            <p>1 x $250.00</p>
          </div>
          <button class="cart-item-remove">
            <PhX />
          </button>
        </div>
        <RouterLink to="/payment" class="checkout"> Checkout </RouterLink>
      </div>
    </div>
  </div>
</template>
