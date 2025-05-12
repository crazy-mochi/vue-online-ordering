<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import DishList from './components/DishList.vue'
import ShopInfo from './components/ShopInfo.vue'
import ProductModal from './components/ProductModal.vue'
import CartBar from './components/Cart/CartBar.vue'
import CartDetail from './components/Cart/CartDetail.vue'

//^^^^購物車^^^^

//購物車彈窗

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
  }
}
// vvvv 彈窗 vvvv

//商品品項
const categories = [
  {
    tag: '主餐',
    items: [
      { name: '培根蛋吐司', price: 65 },
      { name: '火腿蛋吐司', price: 60 },
      { name: '總匯三明治', price: 75 },
      { name: '鐵板麵', price: 70 },
      { name: '炒泡麵', price: 70 },
    ],
  },
  {
    tag: '點心',
    items: [
      { name: '炸雞塊', price: 50 },
      { name: '薯條', price: 40 },
      { name: '花枝丸', price: 45 },
      { name: '地瓜球', price: 35 },
      { name: '甜不辣', price: 40 },
    ],
  },
  {
    tag: '飲料',
    items: [
      { name: '紅茶', price: 25 },
      { name: '奶茶', price: 30 },
      { name: '豆漿', price: 20 },
    ],
  },
]
</script>

<template>
  <main class="main-container">
    <div class="ordering-wrapper">
      <ShopInfo />
      <template v-for="(category, index) in categories" :key="index">
        <h3 class="list-title">{{ category.tag }}</h3>
        <DishList
          v-for="(item, i) in category.items"
          :key="`${category.tag}-${i}`"
          :name="item.name"
          :price="item.price"
          @open-modal="openModal"
        />
      </template>
    </div>
  </main>
  <ProductModal :show="showModal" :item="currentItem" @close="closeModal" />
  <CartBar />
  <CartDetail />
</template>
