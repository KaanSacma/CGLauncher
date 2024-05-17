import { createApp } from "vue";
import "./styles/styles.css";
import App from "./views/App.vue";
import { createStore } from 'vuex'
import {open} from "@tauri-apps/plugin-dialog";
import {invoke} from '@tauri-apps/api/core';

const store = createStore({
    state () {
        return {
            data: {
                "games": []
            },
            settingsCanRender: false
        }
    },
    mutations: {
        readData (state)
        {
            invoke('read_data').then(text => {
                state.data = JSON.parse(text);
            }).catch(e => console.error(e));
        },
        async deleteGameData (state, index)
        {
          state.data.games.splice(index, 1);
          await invoke('write_data', {data: JSON.stringify(state.data, null, 2)});
        },
        async addGameExecutable (state) {
            const gameLauncher = await open({
                filters: [{ name: 'Game Executable', extensions: ['exe'] }],
                multiple: false,
                directory: false,
            });

            console.log("gameLauncher", gameLauncher);

            if (gameLauncher && gameLauncher.name !== undefined && gameLauncher.name.length > 0 && gameLauncher.path !== undefined && gameLauncher.path.length > 0) {
                state.data.games.push({
                    "title": gameLauncher.name.replace(".exe", ""),
                    "path": gameLauncher.path,
                    "cardImg": 'CG-Game-Card.png'
                });
                await invoke('write_data', {data: JSON.stringify(state.data, null, 2)});
            }
        },
        async changeGameDirectory (state, index) {
            const gameLauncher = await open({
                filters: [{ name: 'Game Executable', extensions: ['exe'] }],
                multiple: false,
                directory: false,
                defaultPath: state.data.games[index].path
            });

            if (gameLauncher && gameLauncher.path !== undefined && gameLauncher.path.length > 0) {
                state.data.games[index].path = gameLauncher.path;
                await invoke('write_data', {data: JSON.stringify(state.data, null, 2)});
            }
        },
        async openSettings(state, index) {
            state.settingsCanRender[index] = !state.settingsCanRender[index];
            if (!state.settingsCanRender[index]) {
                await invoke('write_data', {data: JSON.stringify(state.data, null, 2)});
            }
        }
    }
})

const app = createApp(App);

app.provide('store', store);
store.commit("readData");
app.mount("#app");
