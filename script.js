console.log("Let's write JavaScript");
console.log("JavaScript is running!");

// Stores the index of the currently playing song
let currentSongIndex = -1; 

// Reuse the same audio element
let audio = new Audio(); 

// DOM elements
let playButton = document.getElementById("playbutton");
let seekbar = document.querySelector(".seekbar");
let circle = document.querySelector(".circle");
let songInfo = document.querySelector(".songinfo");
let songTime = document.querySelector(".songtime");
let nextButton = document.getElementById("next");
let prevButton = document.getElementById("previous");
let volumeSlider = document.querySelector("input[name='volume']");

// Songs list (static for now)
let songs = [
    "songs/G.O.A.T - Diljit Dosanjh - Copy (2).mp3",
    "songs/Dollar-Slowed-Reverb - Copy (2).mp3",
    "songs/Bapu - Amar Sandhu - Copy (3).mp3",
    "songs/Khaab Akhil 128 Kbps - Copy.mp3"
];

// Play a song by index
const playMusic = (index) => {
    if (index < 0 || index >= songs.length) {
        console.error("Invalid song index:", index);
        return;
    }

    currentSongIndex = index;
    audio.src = songs[index];
    audio.play().then(() => {
        console.log("Playing:", songs[index]);
        playButton.src = "pause.svg";
        songInfo.innerHTML = songs[index].split("/").pop().replace(/%20/g, " ");

        // Highlight current playing song
        document.querySelectorAll(".songlist ul li").forEach(li => li.classList.remove("active"));
        document.querySelectorAll(".songlist ul li")[index]?.classList.add("active");
    }).catch(err => {
        console.error("Playback error:", err);
    });
};

// Format seconds into MM:SS
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Update seekbar and time as song plays
audio.addEventListener("timeupdate", () => {
    let current = formatTime(audio.currentTime);
    let total = audio.duration ? formatTime(audio.duration) : "00:00";
    songTime.innerHTML = `${current} / ${total}`;

    let progress = (audio.currentTime / audio.duration) * 100;
    circle.style.left = `${progress}%`;
});

// Seek on click
seekbar.addEventListener("click", (e) => {
    let ratio = e.offsetX / seekbar.clientWidth;
    audio.currentTime = ratio * audio.duration;
});

// Reset button and play next when song ends
audio.addEventListener("ended", () => {
    playButton.src = "playbutton.svg";
    playNext();
});

// Populate song list and bind events
function main() {
    let songListContainer = document.querySelector(".songlist ul");
    if (!songListContainer) {
        console.warn("No <ul> in .songlist");
        return;
    }

    songListContainer.innerHTML = "";

    songs.forEach((song, index) => {
        let li = document.createElement("li");

        li.innerHTML = `
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song.split("/").pop().replace(/%20/g, " ")}</div>
                <div>Harshit</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert play-button" src="playbutton.svg" alt="">
            </div>
        `;

        li.querySelector(".playnow").addEventListener("click", () => {
            console.log("Clicked Play for:", song);
            playMusic(index);
        });

        songListContainer.appendChild(li);
    });

    // Toggle play/pause
    playButton.addEventListener("click", () => {
        if (audio.paused) {
            if (currentSongIndex === -1) {
                playMusic(0);
            } else {
                audio.play().then(() => {
                    playButton.src = "pause.svg";
                }).catch(err => {
                    console.error("Playback error:", err);
                });
            }
        } else {
            audio.pause();
            playButton.src = "playbutton.svg";
        }
    });

    // Next and previous
    nextButton.addEventListener("click", playNext);
    prevButton.addEventListener("click", playPrevious);

    // Volume control
    volumeSlider.addEventListener("input", (e) => {
        audio.volume = e.target.value / 100;
    });

    // Set default volume
    audio.volume = 1;
}

// Play next song
const playNext = () => {
    let nextIndex = (currentSongIndex + 1) % songs.length;
    playMusic(nextIndex);
};

// Play previous song
const playPrevious = () => {
    let prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playMusic(prevIndex);
};

// Initialize the app
main();
