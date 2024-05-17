<template>
  <Settings v-if="store.state.settingsCanRender" :pos="settingsIndex"/>
    <div v-if="!store.state.settingsCanRender" class="top-bar">
      <input type="text" placeholder="Search..." class="search-bar" v-model="searchInput"/>
      <button class="add-game-btn" @click="store.commit('addGameExecutable')">Add Game</button>
    </div>
    <div v-if="!store.state.settingsCanRender" class="card-container">
      <div class="card" v-for="(game, index) in searchItems()" :style="cssProps(game.cardImg)" :key="index">
        <div class="card-content">
          <button class="play-btn" @click="invoke('execute_game', {path: game.path})">▶</button>
          <div class="title">{{ game.title }}</div>
          <button class="dots-btn" @click="() => {settingsIndex = index; store.state.settingsCanRender = true;}">⋮</button>
        </div>
      </div>
    </div>
</template>

<script setup>
import "../styles/gamelist.css";
import {invoke} from '@tauri-apps/api/core';
import Settings from "./Settings.vue";
import {inject, ref} from 'vue';

const store = inject('store');
const settingsIndex = ref(0);
const searchInput = ref("");

function searchItems() {
  if (searchInput.value === '') return store.state.data.games;
  const lowerCaseQuery = searchInput.value.toLowerCase();
  return store.state.data.games.filter(item => item.title.toLowerCase().includes(lowerCaseQuery));
}

const cssProps = (value) => {
  return {
    backgroundImage: `url(${value})`,
  }
}

</script>
