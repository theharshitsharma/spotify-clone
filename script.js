document.addEventListener('DOMContentLoaded', () => {
    // Player elements
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const progress = document.getElementById('progress');
    const volumeSlider = document.getElementById('volume-slider');
    
    // Song display elements
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const songArt = document.getElementById('song-art');
    const backgroundArt = document.getElementById('background-art');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const playlistGrid = document.getElementById('playlist-grid');

    const audio = new Audio();

    // App state
    let playlist = [];
    let currentSongIndex = -1;
    let isPlaying = false;
    let isShuffled = false;
    let repeatMode = 'none';

    // Full 20-song playlist
    const songs = [
        { title: 'Spirit Blossom', artist: 'RomanBelov', src: 'https://pixabay.com/music/download/spirit-blossom-15285.mp3', art: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg' },
        { title: 'Lofi Chill', artist: 'BoDleasons', src: 'https://pixabay.com/music/download/lofi-chill-140858.mp3', art: 'https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg' },
        { title: 'The Future Bass', artist: 'AntipodeanWriter', src: 'https://pixabay.com/music/download/the-future-bass-15017.mp3', art: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg' },
        { title: 'Powerful Trap', artist: 'Coma-Media', src: 'https://pixabay.com/music/download/powerful-trap-122484.mp3', art: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg' },
        { title: 'Just Relax', artist: 'Lesfm', src: 'https://pixabay.com/music/download/just-relax-11157.mp3', art: 'https://images.pexels.com/photos/316466/pexels-photo-316466.jpeg' },
        { title: 'Cinematic Inspiring', artist: 'A.B. Music', src: 'https://pixabay.com/music/download/cinematic-emotional-inspiring-112209.mp3', art: 'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg' },
        { title: 'Ambient Classical', artist: 'penguinmusic', src: 'https://pixabay.com/music/download/ambient-classical-guitar-144998.mp3', art: 'https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg' },
        { title: 'Sunrise', artist: 'ZakharValaha', src: 'https://pixabay.com/music/download/sunrise-107328.mp3', art: 'https://images.pexels.com/photos/917494/pexels-photo-917494.jpeg' },
        { title: 'Tropical Summer', artist: 'Lesfm', src: 'https://pixabay.com/music/download/tropical-summer-13010.mp3', art: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg' },
        { title: 'In the Forest', artist: 'Lesfm', src: 'https://pixabay.com/music/download/in-the-forest-11730.mp3', art: 'https://images.pexels.com/photos/15286/pexels-photo.jpg' },
        { title: 'Modern Vlog', artist: 'penguinmusic', src: 'https://pixabay.com/music/download/modern-vlog-140795.mp3', art: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg' },
        { title: 'Morning Garden', artist: 'Olexy', src: 'https://pixabay.com/music/download/morning-garden-acoustic-chill-15013.mp3', art: 'https://images.pexels.com/photos/1070534/pexels-photo-1070534.jpeg' },
        { title: 'Deep Future', artist: 'AlexiAction', src: 'https://pixabay.com/music/download/deep-future-garage-120286.mp3', art: 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg' },
        { title: 'Travel Vlog', artist: 'AlexiAction', src: 'https://pixabay.com/music/download/travel-vlog-119932.mp3', art: 'https://images.pexels.com/photos/2104152/pexels-photo-2104152.jpeg' },
        { title: 'Empty Mind', artist: 'Lofi hour', src: 'https://pixabay.com/music/download/empty-mind-118973.mp3', art: 'https://images.pexels.com/photos/211122/pexels-photo-211122.jpeg' },
        { title: 'Risk', artist: 'StudioKolomna', src: 'https://pixabay.com/music/download/risk-13579.mp3', art: 'https://images.pexels.com/photos/21014/pexels-photo.jpg' },
        { title: 'The Podcast', artist: 'Musictown', src: 'https://pixabay.com/music/download/the-podcast-intro-111863.mp3', art: 'https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg' },
        { title: 'Sport Rock', artist: 'AlexiAction', src: 'https://pixabay.com/music/download/sport-rock-trailer-115623.mp3', art: 'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg' },
        { title: 'Good Morning', artist: 'Lofi hour', src: 'https://pixabay.com/music/download/good-morning-112245.mp3', art: 'https://images.pexels.com/photos/5439433/pexels-photo-5439433.jpeg' },
        { title: 'Weeknds', artist: 'DayFox', src: 'https://pixabay.com/music/download/weeknds-122592.mp3', art: 'https://images.pexels.com/photos/3762924/pexels-photo-3762924.jpeg' }
    ];

    function loadSong(song) {
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        songArt.src = song.art;
        backgroundArt.style.backgroundImage = `url(${song.art})`;
        audio.src = song.src;
        updatePlayingUI();
    }

    function playSong() {
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause-circle"></i>';
        audio.play();
        updatePlayingUI();
    }

    function pauseSong() {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play-circle"></i>';
        audio.pause();
        updatePlayingUI();
    }

    function updatePlayingUI() {
        document.querySelectorAll('.card').forEach(card => {
            const cardPlayBtn = card.querySelector('.card-play-btn i');
            const cardIndex = parseInt(card.dataset.index, 10);
            
            const songInCard = songs[cardIndex];
            const currentSongInPlaylist = playlist[currentSongIndex];

            if (isPlaying && currentSongInPlaylist && songInCard.src === currentSongInPlaylist.src) {
                card.classList.add('card--playing');
                if (cardPlayBtn) cardPlayBtn.className = 'fas fa-pause';
            } else {
                card.classList.remove('card--playing');
                if (cardPlayBtn) cardPlayBtn.className = 'fas fa-play';
            }
        });
    }

    function nextSong() {
        if (currentSongIndex === -1) return;
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(playlist[currentSongIndex]);
        playSong();
    }
    
    function prevSong() {
        if (currentSongIndex === -1) return;
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(playlist[currentSongIndex]);
        playSong();
    }
    
    function updateProgress() {
        if (audio.duration) {
            const percentage = (audio.currentTime / audio.duration) * 100;
            progress.style.setProperty('--progress-percentage', `${percentage}%`);
            progress.value = percentage;
        }
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
    
    function setDuration() {
        durationEl.textContent = formatTime(audio.duration);
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function populatePlaylist() {
        playlistGrid.innerHTML = '';
        songs.forEach((song, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${song.art}" alt="${song.title}">
                    <button class="card-play-btn"><i class="fas fa-play"></i></button>
                </div>
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            `;
            playlistGrid.appendChild(card);
        });

        document.querySelectorAll('.card-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.card');
                const index = parseInt(card.dataset.index, 10);
                const targetSong = songs[index];
                const playlistIndex = playlist.findIndex(s => s.src === targetSong.src);

                if (playlistIndex === currentSongIndex && isPlaying) {
                    pauseSong();
                } else {
                    if(playlistIndex !== currentSongIndex) {
                        currentSongIndex = playlistIndex;
                        loadSong(playlist[currentSongIndex]);
                    }
                    playSong();
                }
            });
        });
    }

    function shuffleArray(array) {
        let newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function setInitialState() {
        playlist = [...songs];
        populatePlaylist();
        volumeSlider.style.setProperty('--volume-percentage', `${volumeSlider.value}%`);
        backgroundArt.style.backgroundImage = 'linear-gradient(to top, var(--background-color) 5%, rgba(40,40,40,0.8) 100%)';
    }

    // Event Listeners
    playPauseBtn.addEventListener('click', () => {
        if (currentSongIndex === -1) return;
        isPlaying ? pauseSong() : playSong();
    });

    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    
    audio.addEventListener('ended', () => {
        if (repeatMode === 'one') {
            audio.currentTime = 0;
            playSong();
        } else {
            nextSong();
        }
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setDuration);
    
    progress.addEventListener('input', (e) => {
        const value = e.target.value;
        progress.style.setProperty('--progress-percentage', `${value}%`);
        if (audio.duration) {
            audio.currentTime = (value / 100) * audio.duration;
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        audio.volume = value / 100;
        volumeSlider.style.setProperty('--volume-percentage', `${value}%`);
    });

    shuffleBtn.addEventListener('click', () => {
        isShuffled = !isShuffled;
        shuffleBtn.classList.toggle('active', isShuffled);
        
        const currentSong = currentSongIndex > -1 ? playlist[currentSongIndex] : null;

        if (isShuffled) {
            playlist = shuffleArray(songs);
        } else {
            playlist = [...songs];
        }

        if(currentSong) {
            currentSongIndex = playlist.findIndex(song => song.src === currentSong.src);
        }
        
        updatePlayingUI();
    });

    repeatBtn.addEventListener('click', () => {
        if (repeatMode === 'none') {
            repeatMode = 'all';
            repeatBtn.classList.add('active');
            repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        } else if (repeatMode === 'all') {
            repeatMode = 'one';
            repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
        } else {
            repeatMode = 'none';
            repeatBtn.classList.remove('active');
            repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        }
    });

    // Initial Load
    setInitialState();
});