<script setup>
import { computed, ref, watch } from 'vue'
const props = defineProps({
  modal: Boolean,
  item: Object,
  customOptions: Array,
})
const emit = defineEmits(['close', 'add-to-cart'])
function close() {
  emit('close')
}
const selectedOptions = ref({})

//勾選選項的預設值
const quantity = ref(1)

//彈窗開啟時，初始化項目
watch(
  () => props.modal,
  (val) => {
    if (val) {
      quantity.value = 1
      selectedOptions.value = {
        辣度: '不辣',
        溫度: '冰',
        容量: '中杯',
        加料: [],
      }
    }
  },
)
//彈窗價格計算

const unitPrice = computed(() => {
  const basePrice = props.item.price
  const selected = selectedOptions.value

  const applicableOptions = props.customOptions.filter((g) => g.forIds.includes(props.item.id))

  const extraTotal = applicableOptions.reduce((sum, group) => {
    const selectedValue = selected[group.category]

    if (group.type === 'checkbox' && Array.isArray(selectedValue)) {
      // 多選，逐項找出加價
      return (
        sum +
        selectedValue.reduce((subSum, name) => {
          const opt = group.options.find((o) => o.name === name)
          return subSum + (opt?.price || 0)
        }, 0)
      )
    }

    if (group.type === 'radio') {
      const opt = group.options.find((o) => o.name === selectedValue)
      return sum + (opt?.price || 0)
    }

    return sum
  }, 0)

  return basePrice + extraTotal
})
const subtotal = computed(() => {
  return unitPrice.value * quantity.value
})

// const subtotal = computed(() => {
//   const basePrice = props.item.price
//   return basePrice * quantity.value
// })

//新增至購物車
function addToCart() {
  const order = {
    id: props.item.id,
    種類: props.item.category,
    name: props.item.name,
    basePrice: Number(props.item.price),
    unitPrice: unitPrice.value,
    subtotal: subtotal.value,
    quantity: quantity.value,
  }
  const selected = selectedOptions.value
  const applicableGroups = props.customOptions.filter((group) =>
    group.forIds.includes(props.item.id),
  )

  for (const group of applicableGroups) {
    const category = group.category
    const value = selected[category]

    if (group.type === 'checkbox') {
      if (category === '加料') {
        order['加料'] = Array.isArray(value) && value.length > 0 ? [...value] : ['無加點']
      } else {
        order[category] = Array.isArray(value) && value.length > 0 ? [...value] : ['無選項']
      }
    }

    if (group.type === 'radio' && value !== undefined && value !== null) {
      order[category] = value
    }
  }

  emit('add-to-cart', order)
  close()
}
</script>

<template>
  <div v-if="modal" class="product-modal">
    <div class="modal-background" @click.self="close">
      <div class="product-content">
        <button @click="close" class="back-btn">←</button>
        <div class="product-img"></div>
        <h3>{{ item.name }}</h3>
        <p>價格：{{ item.price }} 元</p>
        <!-- 餐點專用選項 -->
        <div
          v-for="group in customOptions.filter((g) => g.forIds.includes(item.id))"
          :key="group.category"
        >
          <h4>{{ group.category }}</h4>
          <label v-for="option in group.options" :key="option.name">
            <input
              :type="group.type"
              :value="option.name"
              v-model="selectedOptions[group.category]"
            />
            {{ option.name }}
            <span v-if="option.price">+{{ option.price }}元</span>
          </label>
        </div>

        <!-- 餐點專用選項 -->
        <div class="count-container">
          <div class="btn reduce" @click="quantity > 1 && quantity--">-</div>
          <div class="number">
            <span>{{ quantity }}</span>
          </div>
          <div class="btn add" @click="quantity++">+</div>
        </div>
      </div>
      <div class="add-to-cart-container">
        <div class="add-to-cart" @click="addToCart">
          <h3>加入購物車</h3>
          <p>{{ subtotal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
