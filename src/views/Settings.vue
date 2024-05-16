<template>
  <div class="settingsContainer">
    <div class="settingsBox">
      <div class="settingsTitle">
        <span>Title</span>
        <input type="text" v-model="store.state.data.games[props.pos].title">
      </div>
      <div class="settingsExe">
        <span>Executable Path</span>
        <input type="text" v-model="store.state.data.games[props.pos].path" disabled>
        <button id="changeExe" @click="store.commit('changeGameDirectory', props.pos)">Change Executable Path</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import "../styles/settings.css";
import { inject } from 'vue';

const props = defineProps(['pos'])
const store = inject('store');
</script>
