<script setup>
const emit = defineEmits(['open-modal'])

const props = defineProps({
  name: String,
  price: Number,
})

function handleClick() {
  emit('open-modal', { name: props.name, price: props.price })
}
</script>
<template>
  <div class="item-container" @click="handleClick">
    <div class="item-info">
      <h3>{{ name }}</h3>
      <p>${{ price }}</p>
    </div>
    <div class="item-img"></div>
  </div>
</template>
