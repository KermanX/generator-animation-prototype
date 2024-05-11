<script setup lang="ts">
import { app } from './lib';

const { w, a, run, stop, pause, resume, render } = app(() => {
  w.rect({
    color: 'red',
    x: 10,
    y: 10,
    width: 100,
    height: 100,
  }).setup(function* f(w) {
    // Move the widget to from (10, 10) to (200, 100) in 2 seconds
    yield* a.linear(2000, {
      x: 600,
      y: 400,
    })

    // Wait for 1 second
    yield* a.sleep(1000)

    for (let i = 0; i < 5; i++) {
      // Draw a circle with radius 100 around (100, 100) in 3 seconds
      yield* a.effect(3000, time => {
        w.x = 400 + Math.cos(time / 3000 * Math.PI * 2) * 200
        w.y = 400 - Math.sin(time / 3000 * Math.PI * 2) * 200
      })
    }
  })
})
</script>

<template>
  <h1> Animation prototype </h1>
  <render />
  <button @click="run"> Start </button>
  <button @click="stop"> Stop </button>
  <button @click="pause"> Pause </button>
  <button @click="resume"> Resume </button>
</template>

<style scoped></style>
