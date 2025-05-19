<script setup>
const emit = defineEmits(['open-modal'])

const props = defineProps({
  item: Object,
})

function handleClick() {
  emit('open-modal', props.item)
}
</script>
<template>
  <div class="item-container" @click="handleClick">
    <div class="item-info">
      <h3>{{ item.name }}</h3>
      <p>${{ item.price }}</p>
    </div>
    <div class="item-img"></div>
  </div>
</template>
