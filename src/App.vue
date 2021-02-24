<template>
  <input type="file" @change="handleFileChange" />

  <div v-if="hasItems">
    <div v-for="item in items">
      <div>State:     {{ item.state }}</div>
      <div>Video URL: {{ item.resultSource }}</div>

      <div v-if="item.isConverting" class="progress-bar">
        <div class="progress-bar-wrapper">
          <div class="progress-bar-inner" :style="{ width: `${item.progress * 100}%` }"></div>
        </div>
        <div class="progress-bar-value">{{ (item.progress * 100).toFixed(2) }}%</div>
      </div>

      <div v-if="item.isCompleted">
        <img :src="item.resultSource" />
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.progress-bar {
  display: grid;
  grid-gap: 0.3rem;
}

.progress-bar-wrapper {
  background-color: #9b88ff;
  position: relative;
  height: 6px;
  border-radius: 6px;
}

.progress-bar-inner {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #3d18ff;
  transition: all 300ms ease-in-out;
}
</style>