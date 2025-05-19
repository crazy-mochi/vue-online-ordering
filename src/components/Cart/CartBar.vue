<script setup>
import { computed } from 'vue'
const props = defineProps({
  totalPrice: Number,
  totalQuantity: Number,
})
const emit = defineEmits(['toggle-detail'])

function showDetail() {
  emit('toggle-detail')
}
</script>

<template>
  <div class="bottom-fixed">
    <div class="cart-bar">
      <div class="total-price">
        <h4>合計</h4>
        <span>$ {{ totalPrice }}元</span>
      </div>
      <div class="cart" @click="showDetail">
        確認餐點 <span>{{ totalQuantity }}</span>
      </div>
    </div>
  </div>
</template>
