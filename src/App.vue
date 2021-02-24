<template>
  <h1>
    FFMPEG in the interwebs
  </h1>
  <div class="links">
    Thanks to <a href="https://github.com/jeromewu">@jeromewu</a> for <a href="https://github.com/ffmpegwasm/ffmpeg.wasm">ffmpeg.wasm</a>
  </div>

  <label for="fileSelector" class="button">Select .mov file</label>
  <input id="fileSelector" type="file" @change="handleFileChange" class="file-input" />

  <div v-if="hasItems">
    <div v-for="item in items" class="list-item">
      <div v-if="item.isConverting" class="progress-bar">
        <div class="progress-bar-wrapper">
          <div class="progress-bar-inner" :style="{ width: `${item.progress * 100}%` }"></div>
        </div>
        <div class="progress-bar-state">{{ item.state }}</div>
        <div class="progress-bar-value">{{ (item.progress * 100).toFixed(2) }}%</div>
      </div>

      <div v-if="item.isCompleted">
        <div class="converted-file-source">{{ item.resultSource }}</div>
        <img :src="item.resultSource" class="converted-file-item" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFileConverter } from './hooks/useFileConverter'

const items = ref([])
const hasItems = computed(() => items.value.length > 0)

const handleFileChange = async (event) => {
  const [file] = event.target.files;
  const { convert, ...rest } = useFileConverter()

  items.value.push({ ...rest })
  console.log(items)

  await convert(file)
}
</script>

<style>
#app {
  font-family: monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  width: min(400px, 100%);
  margin: 60px auto;
}

h1 {
  font-weight: normal;
  margin: 0 0 0.3rem;
}

.links {
  color: #666;
  font-style: italic;
  margin-bottom: 2rem;
}

.button {
  background-color: #ff1072;
  color: #fff;
  padding: 0.6rem 1.2rem;
  width: 100%;
  display: block;
  outline: 0;
  border: 0;
  transition: all 200ms ease-in-out;
  text-align: center;
  box-sizing: border-box;
  margin-bottom: 4rem;
}

.button:active {
  transform: rotate(3deg) scale(0.98);
}

.file-input {
  display: none;
}

.links a[href] {
  color: #ff1072;
}

.progress-bar {
  display: grid;
  grid-gap: 0.3rem;
  grid-template-areas: 'bar bar' 'state value';
}

.progress-bar-wrapper {
  grid-area: bar;
  background-color: #ffa3c7;
  position: relative;
  height: 6px;
  border-radius: 6px;
  overflow: hidden;
}

.progress-bar-inner {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #ff1072;
  transition: all 300ms ease-in-out;
}

.progress-bar-state {
  grid-area: state;
  align-self: start;
}

.progress-bar-value {
  grid-area: value;
  text-align: end;
  font-weight: bold;
}

.list-item {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #ff1072;
}


.converted-file-source {
  margin-bottom: 1rem;
}

.converted-file-item {
  display: block;
  width: 100%;
  height: auto;
}
</style>