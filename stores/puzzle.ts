import { defineStore } from 'pinia'
import { compare, PriorityQueue } from "@anorcle/dsa";

export interface Cell {
  x: number,
  y: number,
  value: number,
  given: boolean,
  notes: number[]
}

export const usePuzzle = defineStore('puzzle', {
  state: () => ({
    x: -1,
    y: -1,
    final: useTimes(9, x => useTimes(9, y => ({x, y, value: 0} as Cell))),
    initial: useTimes(9, x => useTimes(9, y => ({x, y, notes: []} as Cell))),
  }),
  actions: {
    select(cell: Cell) {
      this.x = cell.x
      this.y = cell.y
    },
    setValue(value: string) {
      this.initial[this.x][this.y].value = value
    },
    setNote(value: string) {
      if (this.currentCell.notes.includes(parseInt(value))) {
        let i = this.initial[this.x][this.y].notes.indexOf(parseInt(value))
        this.initial[this.x][this.y].notes.splice(i, 1)
      } else {
        this.initial[this.x][this.y].notes.push(parseInt(value))
      }
    },
    answerFor(cell: Cell) {
      return this.final[cell.x][cell.y].value
    },
    build(x: number, y: number): boolean {
      const next = 9 * x + y + 1;

      if (next > 81) {
        return true
      }

      if (this.final[x][y].value> 0) {
        return this.build(Math.floor(next / 9), next % 9)
      }

      const pq = new PriorityQueue<SudokuGridEntry>(compareSudokuGridEntry)
      for(let i = 1; i <= 9; ++i) {
        pq.push({
          value: i,
          order: getRandomIntInclusive(0, 100000000)
        })
      }

      while (pq.size) {
        const num = pq.pop().value;
        if (isInvalidInput(this.final, x, y, num)) continue;
        this.final[x][y].value = num;
        if (this.build(Math.floor(next / 9), next % 9)) {
          return true;
        }
      }

      this.final[x][y].value = 0;
      return false;
    },
    init(size: number) {
      const pq = new PriorityQueue<SudokuGridEntry>(compareSudokuGridEntry)

      for(let i = 0; i < 81; ++i) {
        pq.push({
          value: i,
          order: getRandomIntInclusive(0, 100000000)
        })
      }

      while (size--) {
        const position = pq.pop().value
        const row = Math.floor(position / 9)
        const col = Math.floor(position % 9)
        this.initial[row][col].value = this.final[row][col].value
        this.initial[row][col].given = true
      }
    }
  },
  getters: {
    currentCell(): Cell {
      if (this.x < 0 || this.y < 0) return {} as Cell
      return this.initial[this.x][this.y]
    },
    boxes(): Cell[][] {
      let boxes = []

      for (let i = 0; i < 9; ++i) {
        let box = []
        let mx = i * 3 % 9
        let my = Math.floor(i / 3) * 3

        for (let y = my; y < my + 3; y++) {
          for (let x = mx; x < mx + 3; x++) {
            box.push(useGet(this.initial, `${x}.${y}`))
          }
        }

        boxes.push(box)
      }

      return boxes
    }
  }
})

type SudokuGridEntry = {
  order: number;
  value: number;
}

const compareSudokuGridEntry: compare<SudokuGridEntry> = (a, b) => {
  if(a.order > b.order) return +1; 
  if(a.order < b.order) return -1;
  return 0;
}

const getRandomIntInclusive = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export const isInvalidInput = (sudoku: Cell[][], row: number, col: number, target: number): boolean => {
  if (target === 0) return false;

  for (let j = 0; j < 9; ++j) {
    if (j !== col && sudoku[row][j].value === target) {
      return true;
    }
  }

  // col wise unique
  for (let j = 0; j < 9; ++j) {
    if (j !== row && sudoku[j][col].value === target) {
      return true;
    }
  }

  // block wise
  const r = Math.floor(row / 3) * 3;
  const c = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      if (!(r + i === row || c + j === col) && sudoku[r + i][c + j].value === target) {
        return true;
      }
    }
  }

  return false;
}
