let currentSong = new Audio();
const songTimeStart = (second) => {
  if (isNaN(second) || second < 0) {
    return "invalid Input";
  }
  const minute = Math.floor(second / 60);
  const remainingSecond = Math.floor(second % 60);
  const startTimeMinute = String(minute).padStart(2, "0");
  const startTimeSecond = String(remainingSecond).padStart(2, "0");
  return `${startTimeMinute}:${startTimeSecond}`;
};
const songTimeEnd = (second) => {
  if (isNaN(second) || second < 0) {
    return "invalid Input";
  }
  const minute = Math.floor(second / 60);
  const remainingSecond = parseInt(Math.floor(second % 60));
  const startTimeMinute = String(minute).padStart(2, "0");
  const startTimeSecond = String(remainingSecond).padStart(2, "0");
  return `${startTimeMinute}:${startTimeSecond}`;
};
const getSongData = async () => {
  let data = await fetch("http://127.0.0.1:3000/songs/");
  let response = await data.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
};
const playMusic = (track, pause = false) => {
  if (!pause) {
    currentSong.src = `/songs/${track}3`;
    currentSong.play();
    play.src = "./images/pause-button-icon.svg";
  } else {
    currentSong.src = `/songs/${track}`;
  }
  document.querySelector(".songInfo").innerHTML =
    decodeURI(track).slice(0, track.length - 50) + "...";
  document.querySelector(".songStartTime").innerHTML = "00:00";
  document.querySelector(".songEndTime").innerHTML = "00:00  ";
};

const getSongs = async () => {
  // getting the list of songs
  const songs = await getSongData();
  playMusic(songs[0], true);
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      ` <li>
          <img class="invert" src="./images/music-icon.svg" alt="">
          <div class="songContent">
            <span>${song
              .replaceAll("%", " ")
              .replaceAll(/[0-9]/g, "")
              .slice(0, 25)}...</span>
            <span>Prusotam</span>
          </div>
          <img class="playbtn "   src="./images/play-round-icon.svg"  class="invert">
      </li>`;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e, i) => {
    e.addEventListener("click", () => {
      console.log(e.querySelector(".songContent").firstElementChild.innerHTML);
      playMusic(
        // e.querySelector(".songContent").firstElementChild.innerHTML.trim()
        songs[i].replaceAll("%", " ").replaceAll(/[0-9]/g, "")
      );
    });
  });
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./images/pause-button-icon.svg";
    } else {
      currentSong.pause();
      play.src = "./images/play.svg";
    }
  });
  let a = 0;
  currentSong.addEventListener("timeupdate", (e) => {
    document.querySelector(".songStartTime").innerHTML = `${songTimeStart(
      currentSong.currentTime
    )}`;
    document.querySelector(".songEndTime").innerHTML = songTimeEnd(
      currentSong.duration
    );
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    document.querySelector(".circle").style.left =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
    currentSong.currentTime =
      (currentSong.duration *
        (e.offsetX / e.target.getBoundingClientRect().width) *
        100) /
      100;
  });
};

getSongs();

document.querySelector(".humburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0%"; 
});
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-100%"; 
});
 