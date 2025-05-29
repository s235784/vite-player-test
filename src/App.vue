<template>
  <div class="container">
    <h1>Electron Audio Test</h1>
    <button @click="playAudio">Play</button>
    <button @click="pauseAudio">Pause</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import {playAudio, pauseAudio,initMediaSession} from "./audio.js";

onMounted(() => {
  initMediaSession()
});
</script>
