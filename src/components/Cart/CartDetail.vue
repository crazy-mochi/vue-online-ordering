<script setup>
import { computed } from 'vue'
const props = defineProps({
  modal: Boolean,
  sortedCart: Array,
  totalPrice: Number,
})

const emit = defineEmits(['delete-item', 'increase', 'decrease'])
function deleteItem(item) {
  emit('delete-item', item)
}
function increase(item) {
  emit('increase', item)
}
function decrease(item) {
  emit('decrease', item)
}
</script>

<template>
  <div v-if="modal" class="detail-modal">
    <div v-for="item in sortedCart" :key="item.name" class="test">
      <div>
        <h4>{{ item.name }}</h4>
        <p>{{ item.unitPrice }}</p>
        <p>{{ item.加料 }}</p>
        <p v-if="item.辣度">{{ item.辣度 }}</p>
        <p v-if="item.容量">{{ item.容量 }}</p>
        <p v-if="item.溫度">{{ item.溫度 }}</p>
        <p>
          <span @click="decrease(item)">-</span>
          {{ item.quantity }}
          <span @click="increase(item)">+</span>
        </p>
      </div>
      <button @click="deleteItem(item)">X</button>
    </div>
    <div class="total">{{ totalPrice }}</div>
  </div>
</template>
