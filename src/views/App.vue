<template>
  <div class="container">
    <div class="gameList">
      <div class="gameBox" v-for="(game, index) in data.games" @key="game + index">
        <div class="gameContent">
          <span class="gameTitle">{{game.name}}</span>
        </div>
      </div>
    </div>
    <button class="addGame">+</button>
  </div>
</template>

<script setup>
import "../styles/gamelist.css";
import {onBeforeMount, ref} from "vue";
import {resolveResource} from '@tauri-apps/api/path';
import {exists, readTextFile, writeFile, readDir, } from '@tauri-apps/api/fs';

let data = ref(null);

const getDirectories = async () =>
    (await readDir(data.path, { withFileTypes: true }))
        .map(dirent => dirent.name)

const saveData = () =>
{
  writeFile("files/data.json", JSON.stringify(data), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(data));
    console.log('writing to ' + "files/data.json");
  });
}

onBeforeMount(async () => {
  const resourcePath = await resolveResource('files/data.json');
  data = JSON.parse(await readTextFile(resourcePath));
})

</script>