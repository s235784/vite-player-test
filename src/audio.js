const audio = new Audio()
const audioContext = new AudioContext()
const audioSource = audioContext.createMediaElementSource(audio)
const masterGain = audioContext.createGain()
audioSource.connect(audioContext.destination)

audio.src = './example.mp3'
audio.crossOrigin = 'anonymous'
audio.load()

let pauseTimeout = null

audio.addEventListener('play', () => {
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
});
audio.addEventListener('pause', () => {
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
});

export function initMediaSession() {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Test Song',
            artist: 'Test Artist',
            album: 'Test Album',
            artwork: [
                { src: 'https://placehold.co/96/png', sizes: '96x96', type: 'image/png' },
                { src: 'https://placehold.co/128/png', sizes: '128x128', type: 'image/png' },
                { src: 'https://placehold.co/192/png', sizes: '192x192', type: 'image/png' }
            ]
        });

        navigator.mediaSession.setActionHandler('play', playAudio)
        navigator.mediaSession.setActionHandler('pause', pauseAudio)

        navigator.mediaSession.playbackState = 'paused'
    }
}

export function playAudio() {
    console.log('playAudio')

    if (pauseTimeout) clearTimeout(pauseTimeout)
    pauseTimeout = null

    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            audio.play()
            masterGain.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.2)
        });
    } else {
        audio.play()
        masterGain.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.2)
    }
}

export function pauseAudio() {
    console.log('pauseAudio')

    if (pauseTimeout) clearTimeout(pauseTimeout)
    const now = audioContext.currentTime
    masterGain.gain.cancelScheduledValues(now)
    masterGain.gain.setValueAtTime(1, now)
    masterGain.gain.linearRampToValueAtTime(0, now + 0.2)

    pauseTimeout = setTimeout(() => {
        audio.pause()
    }, 150)
}