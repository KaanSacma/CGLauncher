<template>
  <div class="settingsContainer">
    <div class="settingsBox">
      <div class="settingsTitle">
        <button class="backHomeBtn" @click="async () => {store.state.settingsCanRender = false; await invoke('write_data', {data: JSON.stringify(store.state.data, null, 2)});}">◀</button>
        <span>Title</span>
        <input type="text" v-model="store.state.data.games[props.pos].title">
      </div>
      <div class="settingsExe">
        <span>Executable Path</span>
        <input type="text" v-model="store.state.data.games[props.pos].path" disabled>
        <div class="settingsButtons">
          <button class="deleteGameBtn" @click="() => {store.commit('deleteGameData', props.pos); store.state.settingsCanRender = false;}">Delete Game</button>
          <button class="changeExeBtn" @click="store.commit('changeGameDirectory', props.pos)">Change Executable Path</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "../styles/settings.css";
import { inject } from 'vue';
import {invoke} from '@tauri-apps/api/core';

const props = defineProps(['pos']);
const store = inject('store');
</script>
