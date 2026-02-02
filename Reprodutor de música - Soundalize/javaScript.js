const DOMElements = {
    fileSelector: document.getElementById("file-selector-button"),
    songTitle: document.getElementById("song-title"),
    songTrack: document.getElementById("song-track"),
    previousButton: document.getElementById("previous"),
    playPauseButton: document.getElementById("play-pause"),
    nextButton: document.getElementById("next"),
    volumeInput: document.getElementById("volume-range")
}

const audio = new Audio()
const playlist = []
let currentSongIndex = 0
let isPlaying = false

function selectFolder(event) {
    const files = event.target.files
    if (!files.length) return
    playlist.length = 0
    currentSongIndex = 0
    isPlaying = false

    for (let file of files) {
        if (file.type.startsWith("audio/")) {
            playlist.push(file)
        }
    }

    loadPlaylist()
}


function loadPlaylist() {
    for (let song of playlist) {
        song.url = URL.createObjectURL(song)
    }
    changeSong()
}

function changeSong() {
    if (playlist.length === 0) return
    const song = playlist[currentSongIndex]
    audio.src = song.url
    DOMElements.songTitle.textContent = song.name
    isPlaying = false

    DOMElements.playPauseButton.innerHTML = '<i class="fa-solid fa-play"></i>'
    DOMElements.songTrack.value = 0
    DOMElements.songTrack.style.setProperty('--progress-percent', '0px')
}

function playPauseButtonHandler() {
    isPlaying ? pauseSong() : playSong()
}

function playSong() {
    if (playlist.length === 0) return
    isPlaying = true
    audio.play()
    DOMElements.playPauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>'
}

function pauseSong() {
    if (playlist.length === 0) return
    isPlaying = false
    audio.pause()
    DOMElements.playPauseButton.innerHTML = '<i class="fa-solid fa-play"></i>'
}

function songTrackInputHandler() {
    if (playlist.length === 0) return
    pauseSong()
    audio.currentTime = DOMElements.songTrack.value
}

function songEndedHandler() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length
    changeSong()
    playSong()
}

function nextButtonHandler() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length
    changeSong()
    playSong()
}

function previousButtonHandler() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length
    changeSong()
    playSong()
}

function updateProgress() {
    if (audio.duration) {
        DOMElements.songTrack.value = audio.currentTime
        const trackWidth = DOMElements.songTrack.clientWidth
        const progressWidth = (audio.currentTime / DOMElements.songTrack.max) * (trackWidth - 20) + 15
        DOMElements.songTrack.style.setProperty('--progress-percent', progressWidth + 'px')
    }
}

function changeVolume() {
    audio.volume = DOMElements.volumeInput.value / 100
}

DOMElements.fileSelector.addEventListener("change", selectFolder)
DOMElements.playPauseButton.addEventListener("click", playPauseButtonHandler)
DOMElements.nextButton.addEventListener("click", nextButtonHandler)
DOMElements.previousButton.addEventListener("click", previousButtonHandler)
DOMElements.songTrack.addEventListener("input", songTrackInputHandler)
DOMElements.volumeInput.addEventListener("input", changeVolume)

audio.addEventListener("ended", songEndedHandler)
audio.addEventListener("timeupdate", updateProgress)
audio.addEventListener("loadedmetadata", () => {
    DOMElements.songTrack.max = audio.duration
})

