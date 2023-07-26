const audioPlayer = document.getElementById("audio-player");
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const disc = document.querySelector('.disc');
const currentProgress = document.querySelector(".current-progress");
const currentSongDiv = document.querySelector(".current-song");
const currentTimeDisplay = document.querySelector('.current-time');
const maxTimeDisplay = document.querySelector('.max-time');
const repeatIcon = document.querySelector('.repeat');
const mixIcon = document.querySelector('.mix');
let isRepeating = false;
let isMixing = false;
const songs = [
    "/Music/10 Ngàn Năm - PC, Duckie.mp3",
    "/Music/Attention - Charlie Puth.mp3",
    "/Music/Như Anh Mơ - PC.mp3",
    "/Music/Beside You - Keshi.mp3",
    "/Music/Có Em - Madihu.mp3",
    "/Music/Đô trưởng - Đạt G.mp3",
    "/Music/Don't Côi - Ronboogz.mp3",
    "/Music/Golden Hour - JVKE.mp3",
    "/Music/Lan Man - Ronboogz.mp3",

];

let currentSongIndex = 0;

const songList = document.getElementById("playlist");

function selectSong() {
    const index = this.getAttribute("data-index");
    currentSongIndex = parseInt(index);
    loadSong();
    playPauseSong();
    updateCurrentSong();
}
function createSongList() {
    const songListDiv = document.getElementById("playlist");
    songs.forEach((song, index) => {
        const songDiv = document.createElement("div");
        songDiv.classList.add("song");
        songDiv.setAttribute("data-index", index);

        const songPictureDiv = document.createElement("div");
        songPictureDiv.classList.add("song-picture");
        songDiv.appendChild(songPictureDiv);

        const songInfoDiv = getSongInfo(song);
        songDiv.appendChild(songInfoDiv);

        songListDiv.appendChild(songDiv);

        songDiv.addEventListener("click", selectSong);
    });
}
function loadSong() {
    audioPlayer.src = songs[currentSongIndex];
    audioPlayer.load();
}
function playPauseSong() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.querySelector("i").classList.remove("fa-play");
        playPauseBtn.querySelector("i").classList.add("fa-pause");
        disc.style.animationPlayState = 'running';
    } else {
        audioPlayer.pause();
        playPauseBtn.querySelector("i").classList.remove("fa-pause");
        playPauseBtn.querySelector("i").classList.add("fa-play");
        disc.style.animationPlayState = 'paused';
    }
}
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong();
    playPauseSong();
    updateCurrentSong();
}
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong();
    playPauseSong();
    updateCurrentSong();
}
function updateCurrentSong() {
    const currentSongInfoDiv = getSongInfo(songs[currentSongIndex]); 
    currentSongDiv.innerHTML = ''; 
    currentSongDiv.appendChild(currentSongInfoDiv);
}
function getSongInfo(path) {
    const startIndex = path.lastIndexOf("/") + 1;
    const endIndex = path.lastIndexOf("."); 
    const songName = path.substring(startIndex, endIndex); 

    const dashIndex = songName.lastIndexOf("-");
    const song = songName.substring(0, dashIndex).trim();
    const singer = songName.substring(dashIndex + 1).trim();

    const groupNameDiv = document.createElement("div");
    groupNameDiv.classList.add("group-name");

    const songNameDiv = document.createElement("div");
    songNameDiv.classList.add("song-name");
    songNameDiv.innerText = song;

    const singerNameDiv = document.createElement("div");
    singerNameDiv.classList.add("singer-name");
    singerNameDiv.innerText = singer;

    groupNameDiv.appendChild(songNameDiv);
    groupNameDiv.appendChild(singerNameDiv);

    return groupNameDiv;
}
function pauseSongOnStart() {
    audioPlayer.pause();
    playPauseBtn.querySelector("i").classList.remove("fa-pause");
    playPauseBtn.querySelector("i").classList.add("fa-play");
}
audioPlayer.addEventListener("timeupdate", () => {
  const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  currentProgress.style.width = `${progressPercent}%`;
});
audioPlayer.addEventListener('loadedmetadata', function () {
    const duration = audioPlayer.duration;
    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);
    maxTimeDisplay.textContent = `${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
    audioPlayer.addEventListener('timeupdate', function () {
        const currentTime = audioPlayer.currentTime; 
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        currentTimeDisplay.textContent = `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')}`;

        const percentPlayed = (currentTime / duration) * 100;
        const currentProgress = document.querySelector('.current-progress');
        currentProgress.style.width = `${percentPlayed}%`;
    });
});

function toggleRepeat() {
    isRepeating = !isRepeating;
    if (isRepeating) {
        repeatIcon.style.color = 'white';
        audioPlayer.loop = true;
    } else {
        repeatIcon.style.color = 'gray'; 
        audioPlayer.loop = false; 
    }
}

function toggleMix() {
    isMixing = !isMixing;
    if (isMixing) {
        mixIcon.style.color = 'white'; 
    } else {
        mixIcon.style.color = 'gray';
    }
}

playPauseBtn.addEventListener("click", playPauseSong);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
audioPlayer.addEventListener("ended", nextSong);
audioPlayer.addEventListener("canplay", () => {
    audioPlayer.analyser = new AnalyserNode(audioPlayer);
    audioPlayer.source = audioPlayer.analyser;
    audioPlayer.source.connect(audioPlayer.analyser);
    audioPlayer.analyser.connect(audioPlayer.context.destination);
    updateSpectrums();
});

createSongList();
updateCurrentSong();
loadSong();
playPauseSong();
window.addEventListener("load", pauseSongOnStart);
document.addEventListener('DOMContentLoaded', () => {
    disc.style.animationPlayState = 'paused';
  });
  
