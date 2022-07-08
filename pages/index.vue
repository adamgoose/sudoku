<script setup lang="ts">
import { usePuzzle } from '@/stores/puzzle'

useHead({
  bodyAttrs: {
    class: 'bg-black'
  }
})

const puzzle = usePuzzle()
const inputMode = useState('inputMode', () => 'setValue')

onMounted(() => {
  puzzle.build(0, 0)
  puzzle.init(25)
})

const digits = Array.from({length: 9}, (_, i) => i + 1)
const onKeyPress = e => {
  if (digits.includes(parseInt(e.key))) {
    let cell = puzzle.currentCell

    if (cell.given) return
    if (cell.value == e.key) {
      puzzle.setValue(null)
    } else {
      puzzle[inputMode.value](e.key)
    }
  }

  // toggle mode
  if (e.key == "!") {
    if (inputMode.value == 'setValue') {
      inputMode.value = 'setNote'
    } else {
      inputMode.value = 'setValue'
    }
  }
}

onMounted(() => window.addEventListener('keypress', onKeyPress))
onUnmounted(() => window.removeEventListener('keypress', onKeyPress))
</script>

<template lang="pug">
div
  div.container.h-screen.mx-auto.mt-3(class="w-1/2")
    .aspect-square.grid.grid-cols-3.gap-1
      div(v-for="(cells, i) in puzzle.boxes" :key="i").grid.grid-cols-3.gap-px
        PuzzleCell(v-for="(cell, j) in cells" :key="j" :cell="cell")
    div.text-white Mode: {{ inputMode }}
</template>
