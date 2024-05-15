<template>
  <div class="container">
    <button class="addGame" @click="this.$store.commit('openGameDirectory')">Add Game</button>
    <div v-if="this.$store.state.data && this.$store.state.data.games.length > 0" :key="this.$store.state.data.games">
      <div class="gameList"  v-for="(game, index) in this.$store.state.data.games" :key="index">
        <div class="gameBox">
          <div class="gameInfo">
            <span class="gameIndex">{{index}}</span>
            <span class="gameTitle">{{ game.title }}</span>
          </div>
          <div class="gameActions">
            <button @click="invoke('execute_game', game.path)">Play</button>
            <button>Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "../styles/gamelist.css";
import { invoke } from '@tauri-apps/api/core';

</script>