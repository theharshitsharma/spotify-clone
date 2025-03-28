console.log("Let's write JavaScript");

let songs = [];
let currentSongIndex = -1; // Stores the index of the currently playing song
let audio = new Audio(); // Reuse the same audio element
let playButton = document.getElementById("playbutton"); 
let seekbar = document.querySelector(".seekbar");
let circle = document.querySelector(".circle");
let songInfo = document.querySelector(".songinfo");
let songTime = document.querySelector(".songtime");
let nextButton = document.getElementById("next");
let prevButton = document.getElementById("previous");
let volumeSlider = document.querySelector("input[name='volume']");

async function getSongs() {
    try {
        let response = await fetch("http://127.0.0.1:5500/songs/");
        let text = await response.text();
        console.log("Fetched HTML:", text);

        let div = document.createElement("div");
        div.innerHTML = text;

        let as = div.getElementsByTagName("a");

        songs = Array.from(as)
            .map(a => a.getAttribute("href"))
            .filter(songHref => songHref.endsWith(".mp3"))
            .map(songHref => `songs/${songHref.split('/').pop()}`);

        console.log("Parsed Songs:", songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

// Function to Play Music
const playMusic = (index) => {
    if (index < 0 || index >= songs.length) {
        console.error("Invalid song index:", index);
        return;
    }

    currentSongIndex = index; // Update the current index
    audio.src = songs[index]; // Set new song
    audio.play()
        .then(() => {
            console.log("Playing:", songs[index]);
            playButton.src = "pause.svg"; // Change to pause icon
            songInfo.innerHTML = songs[index].split("/").pop().replace(/%20/g, " "); // Display song name
        })
        .catch(err => console.error("Playback error:", err));
};

// Update Seekbar as Song Progresses
audio.addEventListener("timeupdate", () => {
    let currentTime = formatTime(audio.currentTime);
    let duration = audio.duration ? formatTime(audio.duration) : "00:00";
    songTime.innerHTML = `${currentTime} / ${duration}`;

    // Update Seekbar Movement
    let progress = (audio.currentTime / audio.duration) * 100;
    circle.style.left = `${progress}%`;
});

// Click on Seekbar to Change Position
seekbar.addEventListener("click", (e) => {
    let seekbarWidth = seekbar.clientWidth;
    let clickPosition = e.offsetX;
    let seekTime = (clickPosition / seekbarWidth) * audio.duration;
    audio.currentTime = seekTime;
});

// Reset Play Button When Song Ends
audio.addEventListener("ended", () => {
    playButton.src = "playbutton.svg"; // Reset to play icon
    playNext(); // Automatically play next song
});

// Format Time in MM:SS
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Main Function to Populate Song List
async function main() {
    await getSongs();

    let songListContainer = document.querySelector(".songlist");
    if (!songListContainer) {
        console.warn("Element with class 'songlist' not found.");
        return;
    }

    let songUL = songListContainer.querySelector("ul");
    if (!songUL) {
        console.warn("No <ul> found inside '.songlist'.");
        return;
    }

    songUL.innerHTML = ""; // Clear existing list
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

        songUL.appendChild(li);
    });

    // Play/Pause Button Click Event
    playButton.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playButton.src = "pause.svg";
        } else {
            audio.pause();
            playButton.src = "playbutton.svg";
        }
    });

    // Next & Previous Button Click Event
    nextButton.addEventListener("click", playNext);
    prevButton.addEventListener("click", playPrevious);

    // Volume Slider Event
    volumeSlider.addEventListener("input", (e) => {
        audio.volume = e.target.value / 100;
    });
}

// Function to Play Next Song
const playNext = () => {
    let nextIndex = (currentSongIndex + 1) % songs.length; // Loop back if last song
    playMusic(nextIndex);
};

// Function to Play Previous Song
const playPrevious = () => {
    let prevIndex = (currentSongIndex - 1 + songs.length) % songs.length; // Loop back if first song
    playMusic(prevIndex);
};

main();