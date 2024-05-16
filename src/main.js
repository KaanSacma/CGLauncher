import { createApp } from "vue";
import "./styles/styles.css";
import App from "./views/App.vue";
import { createStore } from 'vuex'
import {resolveResource} from "@tauri-apps/api/path";
import {readTextFile, writeFile} from "@tauri-apps/plugin-fs";
import {open} from "@tauri-apps/plugin-dialog";

const store = createStore({
    state () {
        return {
            data: {
                "games": []
            },
            settingsCanRender: []
        }
    },
    mutations: {
        async readData (state)
        {
            const resourcePath = await resolveResource('files/data.json');
            const text = await readTextFile(resourcePath);
            state.data = JSON.parse(text);

            if (state.data.games.length > 0) {
                for (let i = 0; i < state.data.games.length; i++) {
                    state.settingsCanRender.push(false);
                }
            }
        },
        async deleteGameData (state, index)
        {
          state.data.games.splice(index, 1);
          state.settingsCanRender.splice(index, 1);
          const resourcePath = await resolveResource('files/data.json');
          const text = JSON.stringify(state.data, null, 2);
          const encoder = new TextEncoder();

          await writeFile(resourcePath, encoder.encode(text), function writeJSON(err) {
              if (err) return console.log(err);
              console.log(JSON.stringify(state.data));
              console.log('writing to ' + "files/data.json");
          });
        },
        async openGameDirectory (state) {
            const gameLauncher = await open({
                filters: [{ name: 'Game Executable', extensions: ['exe'] }],
                multiple: false,
                directory: false,
            });

            if (gameLauncher) {
                state.data.games.push({"title": gameLauncher.name.replace(".exe", ""), "path": gameLauncher.path});
                state.settingsCanRender.push(false);
                const resourcePath = await resolveResource('files/data.json');
                const text = JSON.stringify(state.data, null, 2);
                const encoder = new TextEncoder();

                await writeFile(resourcePath, encoder.encode(text), function writeJSON(err) {
                    if (err) return console.log(err);
                    console.log(JSON.stringify(state.data));
                    console.log('writing to ' + "files/data.json");
                });
            }
        },
        async changeGameDirectory (state, index) {
            const gameLauncher = await open({
                filters: [{ name: 'Game Executable', extensions: ['exe'] }],
                multiple: false,
                directory: false,
                defaultPath: state.data.games[index].path
            });

            if (gameLauncher) {
                state.data.games[index].path = gameLauncher.path;
            }
        },
        async openSettings(state, index) {
            state.settingsCanRender[index] = !state.settingsCanRender[index];
            if (!state.settingsCanRender[index]) {
                const resourcePath = await resolveResource('files/data.json');
                const text = JSON.stringify(state.data, null, 2);
                const encoder = new TextEncoder();

                await writeFile(resourcePath, encoder.encode(text), function writeJSON(err) {
                    if (err) return console.log(err);
                    console.log(JSON.stringify(state.data));
                    console.log('writing to ' + "files/data.json");
                });
            }
        }
    }
})

const app = createApp(App);

async function init ()
{
    await store.commit("readData");
}

app.provide('store', store);
init();
app.mount("#app");
