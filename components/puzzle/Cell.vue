<script setup lang="ts">
import { usePuzzle } from '@/stores/puzzle'

const props = defineProps<{
  cell: {
    x: number,
    y: number,
    value: number,
    given: boolean,
    notes: number[]
  }
}>()

const puzzle = usePuzzle()

const cellClass = (cell) => ({
  '!text-gray-400': cell.given,
  '!text-red-400': puzzle.answerFor(cell) != cell.value,
  '!bg-gray-800 hover_!bg-gray-700': cell.x == puzzle.x || cell.y == puzzle.y,
  '!bg-gray-600 hover_!bg-gray-500': cell.x == puzzle.x && cell.y == puzzle.y,
  // '!bg-blue-300': cell.value == puzzle.currentCell.value
})
</script>

<template lang="pug">
div(:class="cellClass(cell)" @click="puzzle.select(cell)").aspect-square.flex.justify-center.items-center.text-6xl.text-gray-300.bg-gray-900.hover_bg-gray-800.font-light
  span(v-if="cell.value") {{ cell.value }}
  div(v-else).grid.grid-cols-3.w-full
    div(v-for="x in 9" :key="x").aspect-square.flex.justify-center.items-center.text-sm
      span(v-if="cell.notes.includes(x)") {{ x }}
</template>
