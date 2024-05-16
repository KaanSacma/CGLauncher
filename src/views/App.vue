<template>
  <div class="container">
    <button class="addGame" @click="store.commit('openGameDirectory')">Add Game</button>
    <div v-if="store.state.data && store.state.data.games.length > 0" :key="store.state.data.games">
      <div class="gameList"  v-for="(game, index) in store.state.data.games" :key="index">
        <div class="gameBox">
          <div class="gameInfo">
            <span class="gameIndex">{{index}}</span>
            <span class="gameTitle">{{ game.title }}</span>
          </div>
          <div class="gameActions">
            <button @click="invoke('execute_game', {path: game.path})">▶</button>
            <button @click="store.commit('openSettings', index)">⚙️</button>
            <button @click="store.commit('deleteGameData', index)">╳</button>
          </div>
        </div>
        <Settings :pos="index" v-if="store.state.settingsCanRender[index] === true"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import "../styles/gamelist.css";
import {invoke} from '@tauri-apps/api/core';
import Settings from "./Settings.vue";
import { inject } from 'vue';

const store = inject('store');
</script>