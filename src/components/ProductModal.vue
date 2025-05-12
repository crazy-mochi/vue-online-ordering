<script setup>
const props = defineProps({
  show: Boolean,
  item: Object,
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<template>
  <div v-if="show" class="product-modal">
    <div class="modal-background" @click.self="close">
      <div class="product-content">
        <button @click="close" class="back">←</button>
        <div class="product-img"></div>
        <h3>{{ item.name }}</h3>
        <p>價格：{{ item.price }} 元</p>
      </div>
      <button class="add-to-cart">加入購物車</button>
    </div>
  </div>
</template>
