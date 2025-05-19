<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import DishList from './components/DishList.vue'
import ShopInfo from './components/ShopInfo.vue'
import ProductModal from './components/ProductModal.vue'
import CartBar from './components/Cart/CartBar.vue'
import CartDetail from './components/Cart/CartDetail.vue'

//^^^^購物車^^^^
const cart = ref([])

const sortedCart = computed(() => {
  return [...cart.value].sort((a, b) => a.id - b.id)
})

const totalQuantity = computed(() => {
  return sortedCart.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
})

const totalPrice = computed(() => {
  return sortedCart.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
})

//-----調整購物車內容物品-----
function isSameOrder(a, b) {
  return (
    a.id === b.id &&
    a.辣度 === b.辣度 &&
    a.容量 === b.容量 &&
    a.溫度 === b.溫度 &&
    JSON.stringify(a.加料) === JSON.stringify(b.加料)
  )
}
function addToCart(newItem) {
  const existingItem = cart.value.find((item) => isSameOrder(item, newItem))
  if (existingItem) {
    existingItem.quantity += newItem.quantity
  } else {
    cart.value.push({ ...newItem })
  }
}

function increaseItem(item) {
  const match = cart.value.find((i) => isSameOrder(i, item))
  if (match) {
    match.quantity += 1
  }
}

function decreaseItem(item) {
  const match = cart.value.find((i) => isSameOrder(i, item))
  if (match && match.quantity > 1) {
    match.quantity -= 1
  }
}
function deleteItem(itemToDelete) {
  const index = cart.value.findIndex((item) => isSameOrder(item, itemToDelete))
  if (index !== -1) {
    cart.value.splice(index, 1)
  }
}
//購物車彈窗
const showDetail = ref(false)
function openCart() {
  showDetail.value = true
}
function closeCart() {
  setTimeout(() => (showDetail.value = false), 150)
}

//vvvv購物車vvvv

// ^^^^ 彈窗 ^^^^
const showModal = ref(false)
const currentItem = ref(null)

function openModal(item) {
  currentItem.value = item
  showModal.value = true
}

function closeModal() {
  setTimeout(() => {
    showModal.value = false
    currentItem.value = null
  }, 150)
}

// Esc觸發彈窗關閉
onMounted(() => {
  window.addEventListener('keydown', handleKey)
  //當彈窗出現時，主頁面無法滑動
  // watch(showModal, (val) => {
  //   document.body.classList.toggle('no-scroll', val)
  //   document.documentElement.classList.toggle('no-scroll', val)
  // })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKey)
  document.body.style.overflow = ''
})

function handleKey(e) {
  if (e.key === 'Escape') {
    closeModal()
    closeCart()
  }
}
// vvvv 彈窗 vvvv

//商品品項
const categories = [
  {
    tag: '主餐',
    items: [
      { id: 101, name: '培根蛋吐司', price: 65 },
      { id: 102, name: '火腿蛋吐司', price: 60 },
      { id: 103, name: '總匯三明治', price: 75 },
      { id: 104, name: '鐵板麵', price: 70 },
      { id: 105, name: '炒泡麵', price: 70 },
    ],
  },
  {
    tag: '點心',
    items: [
      { id: 201, name: '炸雞塊', price: 50 },
      { id: 202, name: '薯條', price: 40 },
      { id: 203, name: '花枝丸', price: 45 },
      { id: 204, name: '地瓜球', price: 35 },
      { id: 205, name: '甜不辣', price: 40 },
    ],
  },
  {
    tag: '飲料',
    items: [
      { id: 701, name: '紅茶', price: 25 },
      { id: 702, name: '奶茶', price: 30 },
      { id: 703, name: '豆漿', price: 20 },
    ],
  },
]

const customOptions = [
  {
    category: '加料',
    type: 'checkbox',
    forIds: [101, 102, 103, 104, 105],
    options: [
      { name: '起司', price: 10 },
      { name: '半熟蛋', price: 15 },
      { name: '豬排', price: 35 },
    ],
  },
  {
    category: '辣度',
    type: 'radio',
    forIds: [104, 105, 201, 202, 203, 204, 205], // 炒泡麵、鐵板麵、跟點心才能調整辣度
    options: [{ name: '不辣' }, { name: '小辣' }, { name: '中辣' }],
  },
  {
    category: '容量',
    type: 'radio',
    forIds: [701, 702, 703], // 飲料類的 id
    options: [
      { name: '中杯', price: 0 },
      { name: '大杯', price: 10 },
      { name: '特大杯', price: 20 },
    ],
  },
  {
    category: '溫度',
    type: 'radio',
    forIds: [701, 702, 703],
    options: [{ name: '冰' }, { name: '熱' }],
  },
]
</script>

<template>
  <main class="main-container">
    <div class="ordering-wrapper">
      <ShopInfo />
      <template v-for="category in categories" :key="category.tag">
        <h3 class="list-title">{{ category.tag }}</h3>
        <DishList
          v-for="item in category.items"
          :key="item.id"
          :item="item"
          @open-modal="openModal"
        />
      </template>
    </div>
  </main>
  <ProductModal
    :modal="showModal"
    :item="currentItem"
    :customOptions="customOptions"
    @close="closeModal"
    @add-to-cart="addToCart"
  />
  <CartBar :totalPrice="totalPrice" :totalQuantity="totalQuantity" @toggle-detail="openCart" />
  <CartDetail
    :modal="showDetail"
    :sortedCart="sortedCart"
    :totalPrice="totalPrice"
    @delete-item="deleteItem"
    @increase="increaseItem"
    @decrease="decreaseItem"
  />
</template>
