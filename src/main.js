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
            }
        }
    },
    mutations: {
        async readData (state)
        {
            const resourcePath = await resolveResource('files/data.json');
            const text = await readTextFile(resourcePath);
            state.data = JSON.parse(text);
        },
        async openGameDirectory (state) {
            console.log("state.data:", state.data);
            console.log("state.data.games: ", state.data.games);
            const gameLauncher = await open({
                filters: [{ name: 'Game Executable', extensions: ['exe'] }],
                multiple: false,
                directory: false,
            });

            if (gameLauncher) {
                state.data.games.push({"title": gameLauncher.name.replace(".exe", ""), "path": gameLauncher.path});
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

const app = createApp(App)

app.use(store);
await store.commit("readData");
app.mount("#app");
