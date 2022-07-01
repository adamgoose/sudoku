<script setup lang="ts">
import { usePuzzle } from '@/stores/puzzle'

useHead({
  bodyAttrs: {
    class: 'bg-black'
  }
})

const x = ref<number>(null)
const y = ref<number>(null)
const puzzle = usePuzzle()

onMounted(() => {
  puzzle.build(0, 0)
  puzzle.init(40)
})

const cellClass = (cell) => {
  return {
    'text-gray-400': cell.given,
    'text-red-400': puzzle.answerFor(cell) != cell.value,
    'bg-gray-600 hover:bg-gray-500': cell.x == puzzle.x && cell.y == puzzle.y
  }
}

const onKeyPress = e => {
  if (e.code.startsWith("Digit") || e.code.startsWith("Numpad")) {
    let cell = puzzle.currentCell

    if (cell.given) return
    if (cell.value == e.key) cell.value = null
    else puzzle.setValue(e.key)
  }
}

onMounted(() => window.addEventListener('keypress', onKeyPress))
onUnmounted(() => window.removeEventListener('keypress', onKeyPress))
</script>

<template>
  <div class="container w-1/2 h-screen mx-auto mt-3">
    <div class="aspect-square grid grid-cols-3 gap-1">
      <div class="grid grid-cols-3 gap-px" v-for="(cells, i) in puzzle.boxes" :key="i">
        <div class="aspect-square flex justify-center items-center text-7xl text-gray-300 bg-gray-900 hover:bg-gray-800 font-light" v-for="(cell, j) in cells" :key="j" @click="puzzle.select(cell)" :class="cellClass(cell)">
          <span>{{ cell.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
