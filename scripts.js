const audioPlayer = document.getElementById("audio-player");
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const disc = document.querySelector('.disc');
const currentSongDiv = document.querySelector(".current-song");
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

        // Create the song picture element
        const songPictureDiv = document.createElement("div");
        songPictureDiv.classList.add("song-picture");
        songDiv.appendChild(songPictureDiv);

        // Create the song info element
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
    const currentSongInfoDiv = getSongInfo(songs[currentSongIndex]); // Sử dụng hàm getSongInfo để lấy thông tin bài hát và tên ca sĩ
    currentSongDiv.innerHTML = ''; // Xóa nội dung hiện tại của currentSongDiv
    currentSongDiv.appendChild(currentSongInfoDiv);
}

// Hàm này trích xuất tên bài hát từ đường dẫn bằng cách bỏ đi phần mở rộng .mp3
function getSongInfo(path) {
    const startIndex = path.lastIndexOf("/") + 1; // Tìm vị trí cuối cùng của dấu "/"
    const endIndex = path.lastIndexOf("."); // Tìm vị trí đầu tiên của dấu "."
    const songName = path.substring(startIndex, endIndex); // Trích xuất phần tên bài hát từ đường dẫn

    // Tách tên bài hát và tên ca sĩ bằng dấu "-"
    const dashIndex = songName.lastIndexOf("-");
    const song = songName.substring(0, dashIndex).trim();
    const singer = songName.substring(dashIndex + 1).trim();

    // Tạo các phần tử HTML và gán các tên bài hát và tên ca sĩ vào
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
// JavaScript code
const currentProgress = document.querySelector(".current-progress");

audioPlayer.addEventListener("timeupdate", () => {
  // Tính phần trăm thời lượng đã phát so với tổng thời lượng của file nhạc
  const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;

  // Cập nhật chiều rộng của dải spectrum hiển thị thời lượng đã phát
  currentProgress.style.width = `${progressPercent}%`;
});

const currentTimeDisplay = document.querySelector('.current-time');
const maxTimeDisplay = document.querySelector('.max-time');

// Sự kiện khi tập tin nhạc được tải lên và sẵn sàng để phát
audioPlayer.addEventListener('loadedmetadata', function () {
    const duration = audioPlayer.duration; // Thời lượng của file nhạc (tính theo giây)
    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);
    maxTimeDisplay.textContent = `${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

    // Cập nhật độ dài của spectrum dựa trên thời lượng đã phát
    audioPlayer.addEventListener('timeupdate', function () {
        const currentTime = audioPlayer.currentTime; // Thời lượng đã phát (tính theo giây)
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        currentTimeDisplay.textContent = `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')}`;

        const percentPlayed = (currentTime / duration) * 100;
        const currentProgress = document.querySelector('.current-progress');
        currentProgress.style.width = `${percentPlayed}%`;
    });
});

const repeatIcon = document.querySelector('.repeat');
const mixIcon = document.querySelector('.mix');
var isRepeating = false;
var isMixing = false;

// Hàm xử lý sự kiện khi nhấp vào nút lặp lại
function toggleRepeat() {
    isRepeating = !isRepeating;
    if (isRepeating) {
        repeatIcon.style.color = 'white'; // Đổi màu biểu tượng khi được kích hoạt
        audioPlayer.loop = true; // Kích hoạt chế độ lặp lại bài hát
    } else {
        repeatIcon.style.color = 'gray'; // Đổi màu biểu tượng khi không được kích hoạt
        audioPlayer.loop = false; // Tắt chế độ lặp lại bài hát
    }
}

// Hàm xử lý sự kiện khi nhấp vào nút trộn lẫn
function toggleMix() {
    isMixing = !isMixing;
    if (isMixing) {
        mixIcon.style.color = 'white'; // Đổi màu biểu tượng khi được kích hoạt
        // Thêm logic để kích hoạt tính năng trộn lẫn bài hát (nếu có)
    } else {
        mixIcon.style.color = 'gray'; // Đổi màu biểu tượng khi không được kích hoạt
        // Thêm logic để tắt tính năng trộn lẫn bài hát (nếu có)
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
    // Thiết lập animationPlayState ban đầu của đĩa là 'paused'
    disc.style.animationPlayState = 'paused';
  });
  
