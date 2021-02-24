import { ref } from 'vue';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const CONVERTER_STATE = {
  idle: 'Idle',
  loading: 'Loading FFMPEG core ...',
  transcoding: 'Transcoding file ...',
  completed: 'Completed'
}

export function useFileConverter() {
  const state = ref(CONVERTER_STATE.idle)
  const isConverting = ref(false)
  const isCompleted = ref(false)

  const progress = ref(0)
  const resultSource = ref('')

  const convert = async (file) => {
    isConverting.value = true

    const ffmpeg = createFFmpeg({
      log: true,
    });

    ffmpeg.setProgress(({ ratio }) => {
      progress.value = ratio
    });

    state.value = CONVERTER_STATE.loading;
    await ffmpeg.load();

    state.value = CONVERTER_STATE.transcoding;
    ffmpeg.FS('writeFile', file.name, await fetchFile(file));

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

    state.value = CONVERTER_STATE.completed;
    const data = ffmpeg.FS('readFile', 'output.gif');
    // const data = ffmpeg.FS('readFile', 'output.mp4');

    resultSource.value = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));

    isConverting.value = false
    isCompleted.value = true
    // videoSrc.value = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
  }

  return {
    state,
    progress,
    resultSource,
    isConverting,
    isCompleted,
    convert,
  }
}