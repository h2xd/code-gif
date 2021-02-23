<template>
  <div>
    <div>State:     {{ message }}</div>
    <div>Video URL: {{ videoSrc }}</div>

    <input type="file" @change="handleFileChange" />
  </div>


  <div v-if="inProgess" class="progress-bar">
    <div class="progress-bar-wrapper">
      <div class="progress-bar-inner" :style="{ width: `${progress * 100}%` }"></div>
    </div>
    <div class="progress-bar-value">{{ (progress * 100).toFixed(2) }}%</div>
  </div>

  <div v-if="hasVideo">
    <img
      :src="videoSrc"
    />
  </div>

</template>

<script setup>
import { ref } from 'vue';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const message = ref('Idle')

const inProgess = ref(false)
const progress = ref(0)

const videoSrc = ref('')
const hasVideo = ref(false)

const startAt = ref(0)
const estDuration = ref(0)

const handleFileChange = async (event) => {
  console.log(event.target)

  hasVideo.value = false

  const [file] = event.target.files;

  inProgess.value = true

  const ffmpeg = createFFmpeg({
    log: true,
  });

  ffmpeg.setProgress(({ ratio }) => {
    if (ratio < 0.01) {
      startAt.value = Date.now()
    }

    progress.value = ratio
    estDuration.value = (Date.now() - startAt.value) / ratio * (1 - ratio)
  });

  message.innerHTML = 'Loading ffmpeg-core.js';
  await ffmpeg.load();
  ffmpeg.FS('writeFile', file.name, await fetchFile(file));

  message.value = 'Start transcoding';

  // await ffmpeg.run('-i', file.name, 'output.mp4');

  // that one works
  // await ffmpeg.run(
  //     '-t',
  //     '3',
  //     '-ss',
  //     '0.5',
  //     '-i',
  //     file.name,
  //     '-r',
  //     '15',
  //     'output.gif'
  // )

  // https://superuser.com/questions/556029/how-do-i-convert-a-video-to-gif-using-ffmpeg-with-reasonable-quality
  await ffmpeg.run(
      '-i',
      file.name,
      '-filter_complex',
      'fps=15,scale=560:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
      '-loop',
      '0',
      'output.gif'
  )

  message.value = 'Complete transcoding';
  // const data = ffmpeg.FS('readFile', 'output.mp4');
  const data = ffmpeg.FS('readFile', 'output.gif');

  inProgess.value = false

  hasVideo.value = true
  // videoSrc.value = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
  videoSrc.value = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));

  message.value = 'idle'
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