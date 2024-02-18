// dynamic search bar 
let navigate = document.querySelector(".navigate");
let bodytag = document.querySelector("body");
let searchbtn = document.querySelector(".searchbtn");
let homebtn = document.querySelector(".homebtn");
let rightmain = document.querySelector(".main");
var homepageSongs = [];

// bodytag.addEventListener("click", () => {
//     // event.stopPropagation();
//     // searchclass = bodytag.lastElementChild.className.trim();
//     // searchclass = searchclass != "" ? searchclass : "nothing";
//     // if (screensize.matches){
//     //     if (searchclass == "searchphone") {
//     //         console.log("removing search bar")
//     //         bodytag.lastElementChild.remove();
//     //     }
//     // }
//     // else{
//     //     homebtn.firstElementChild.setAttribute("src", "svg/home_clicked.svg")
//     //     searchbtn.firstElementChild.setAttribute("src", "svg/search.svg")
//     //     navigate.getElementsByClassName("searchbar")[0]?.remove()
//     // }
//     // document.querySelector(".searchphone").style.zIndex = "0";

// })



//=================================================================================
//============================ home screen song while loading page =================
//===================================================================================
function homepage(playlist) {
    let time = new Date;
    time = time.getHours();
    let msg = "Hi There...";
    if (time >= 5 && time <= 11)
        msg = "Good Morning...";
    if (time >= 12 && time <= 17)
        msg = "Good Afternoon...";
    if (time >= 18 && time <= 21)
        msg = "Good Evening...";
    if ((time >= 22 && time <=24) || (time <= 4 && time >= 1))
        msg = "Good Night...";
    // console.log(typeof time)
    let songUL = document.getElementsByClassName("musiccontainer")[0];
    let temp_text1 = `<div class="playlistname">  <h2>${msg}</h2> </div>`;
    songUL.innerHTML = temp_text1;
    let songs = playlist;
    audiolist(songs);
    // return songs;
}
function randomno(max) {
    return Math.floor(Math.random() * max)
}
async function randomsong(allplaylist) {
    // let p1 = [];
    let finalsongs = [];
    let count = 0;
    let songs = []
    for (let i = 0; i <= allplaylist.length - 1; i++) {
        songs[i] = await getsongs(allplaylist[i])
    }

    for (let i = 0; i <= songs.length - 1; i++) {
        for (let j = 0; j < 5; j++) {
            finalsongs[count] = songs[i][randomno(songs[i].length - 1)];
            count++;
        }
    }
    return finalsongs;
}

// function for API request for playlist
async function getplaylist() {
    // let fetchplaylist = await fetch("http://192.168.0.193:3000/playlist/");
    let fetchplaylist = await fetch("playlist/");
    let response = await fetchplaylist.text();
    let tempdiv = document.createElement("div");
    tempdiv.innerHTML = response;
    let tempachor = tempdiv.getElementsByTagName("a");
    let playlist_array = [];
    let playlistname;
    let playlist_container = document.querySelector(".playlist-container");
    for (let index = 0; index < tempachor.length; index++) {
        const element = tempachor[index];
        if (element.href.includes("playlist/")) {
            playlist_array.push(element.href);
            playlistname = element.href.split("playlist/")[1].split("/")[0].replaceAll("%20", " ");
            playlist_container.innerHTML = playlist_container.innerHTML +
                `<div class="playlist ">
                <img src="icons/night-drive.jpeg" alt="">
                <span class="playlist-text">
                    <h3>${playlistname}</h3>
                    <p>Enjoy the ${playlistname} with Enthausiasm </p>
                    <p class="playlistURL">${element.href}</p>
                </span>
            </div>`
        }
    }
    return playlist_array
}

function listclickedplaylist() {
    let clicked_playlist = document.querySelectorAll(".playlist");
    let songUL = document.getElementsByClassName("musiccontainer")[0];

    clicked_playlist.forEach((e) => {
        e.addEventListener("click", async () => {
            // event.stopPropagation();
            document.querySelector(".current_clicked")?.classList.remove("current_clicked")
            e.classList.add("current_clicked")
            songUL.innerHTML = " ";
            let temp_text1 = `<div class="playlistname">  <h2>${e.lastElementChild.firstElementChild.innerHTML}</h2> </div>`;
            songUL.innerHTML = temp_text1;
            let songs;
            let playlist = e.getElementsByClassName("playlistURL")[0].innerHTML;
            songs = await getsongs(playlist)
            // console.log(songs);
            audiolist(songs);
        })
    })
}

// function for getting song from playlist

async function getsongs(currentplaylist) {
    let fecthedaudio = await fetch(currentplaylist);
    let response = await fecthedaudio.text();
    // return songs;
    let parsehtml = document.createElement("div");
    parsehtml.innerHTML = response;
    let a = parsehtml.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < a.length; index++) {
        const element = a[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    // console.log(songs);
    return songs;
}

var currentmusicDIV;
var currentmusic = new Audio();
var current_musicname;
//play music function start
function musicplay(track) {
    currentmusic.src = track;
    currentmusic.play();
    // currentmusic.volume = 0.40;
    document.querySelector(".play").getElementsByTagName("img")[0].setAttribute("src", "svg/Controls/pause.svg")
}

//list playlist song in container
async function audiolist(currentplaylist) {

    let songs = currentplaylist;
    let temp;
    let songUL = document.getElementsByClassName("musiccontainer")[0];
    let simple_song_text;
    for (const song of songs) {
        simple_song_text = song.split("playlist/")[1];
        temp = simple_song_text.split("/")[0];
        songUL.innerHTML = songUL.innerHTML + `<li class = "music"> 
        <div >  
                                <span></span>  
                                <span></span>  
                                <span></span>  
                                <span></span>  
                              </div>
        <h3>${simple_song_text.split("/")[1].replaceAll("%20", " ").split(".mp3")[0]}</h3> <p>${song}</p></li>`
    }


    Array.from(document.querySelector(".musiccontainer").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            // e.firstElementChild.remove();
            // event.stopPropagation();
            document.querySelector(".current_music")?.classList.remove("current_music");
            e.classList.add("current_music");
            document.querySelector(".musicwave")?.classList.remove("musicwave");
            e.firstElementChild.classList.add("musicwave");
            temp = e.lastElementChild.innerHTML;
            musicplay(temp);
            currentmusicDIV = e;
            current_musicname = e.children[1].innerHTML;
            console.log(current_musicname);
            // outermusicname(e.firstElementChild.innerHTML);
            // innermusicname(e.firstElementChild.innerHTML);
            outermusicname(e.children[1].innerHTML);
            innermusicname(e.children[1].innerHTML);
            // console.log("this is currentmusicdIV",currentmusicDIV)
        })
    })


}
async function mainprogram() {
    let allplaylist = await getplaylist();
    homepageSongs = await randomsong(allplaylist)
    homepage(homepageSongs);
    // document.querySelector(".current_music")?.classList.remove("current_music")
    // document.querySelector(".music")?.classList.add("current_music")
    // currentmusic.src = homepageSongs[0];
    // currentmusicDIV.innerHTML = `<li class="music"> <h3>Najariya Na Lage</h3> <p>${homepage[0]}</p> </li>`;

    // console.log("its",currentmusic.src)
    listclickedplaylist();

}
mainprogram(); // main program invoked here
// listclickedplaylist()

//=======================================================================
//==============  Home and Search Event Listener==========================
//=========================================================================
searchbtn.addEventListener("click", () => {
    event.stopPropagation();
    let searchclass;
    let searchbar = `<span class="searchbar">
    <img src="svg/search.svg" alt="search_icon">
    <input type="text" placeholder="What do you want to listen to?">
    </span>
    `;
    if (screensize.matches) {
        if (searchbtn.firstElementChild.src.includes("svg/search.svg")) {
            searchbtn.firstElementChild.setAttribute("src", "svg/search_clicked.svg")
            document.querySelector(".searchphone").style.zIndex = "10";
        }
        else if (searchbtn.firstElementChild.src.includes("svg/search_clicked.svg")) {
            searchbtn.firstElementChild.setAttribute("src", "svg/search.svg")
            document.querySelector(".searchphone").style.zIndex = "0";
        }

    }
    else {

        searchclass = navigate.lastElementChild.className.trim();
        searchclass = searchclass != "" ? searchclass : "nothing";
        homebtn.firstElementChild.setAttribute("src", "svg/home.svg")
        searchbtn.firstElementChild.setAttribute("src", "svg/search_clicked.svg")
        if (searchclass == "nothing") {
            navigate.innerHTML = navigate.innerHTML + searchbar
        }
    }
})


homebtn.addEventListener("click", () => {
    // console.log(homepageSongs)
    homepage(homepageSongs)
    if (screensize.matches) {
        // console.log("mini screen")
        // homebtn.firstElementChild.setAttribute("src", "svg/home.svg")
        // searchbtn.firstElementChild.setAttribute("src", "svg/search_clicked.svg")


    }
    else {
        homebtn.firstElementChild.setAttribute("src", "svg/home_clicked.svg")
        searchbtn.firstElementChild.setAttribute("src", "svg/search.svg")
        navigate.getElementsByClassName("searchbar")[0]?.remove()
    }
})









//---------------------------------------------------------------------------------------
// controls play/pause functioning
let = playbtn = document.querySelector(".play");
playbtn.addEventListener("click", () => {
    if (currentmusic.paused) {
        currentmusic.play()
        playbtn.getElementsByTagName("img")[0].setAttribute("src", "svg/Controls/pause.svg")
        currentmusicDIV.firstElementChild.classList.add("musicwave")

    }
    else {
        currentmusic.pause()
        playbtn.getElementsByTagName("img")[0].setAttribute("src", "svg/Controls/play.svg")
        document.querySelector(".musicwave")?.classList.remove("musicwave")
    }
})

// control next song/button
function playnextsong() {
    let musicDIV = document.getElementsByClassName("music");
    let next;
    for (let index = 0; index < musicDIV.length; index++) {
        let e = musicDIV[index];
        if (e.lastElementChild.innerHTML == currentmusicDIV.lastElementChild.innerHTML) {
            next = index + 1;
            break;
        }
    }

    if (!(next > musicDIV.length - 1)) {
        document.querySelector(".current_music")?.classList.remove("current_music")
        musicDIV[next].classList.add("current_music")
        document.querySelector(".musicwave")?.classList.remove("musicwave")
        musicDIV[next].firstElementChild.classList.add("musicwave")
        currentmusicDIV = musicDIV[next];
        musicplay(musicDIV[next].lastElementChild.innerHTML);
        // console.log(musicDIV[next].children[1].innerHTML)
        outermusicname(currentmusicDIV.children[1].innerHTML);
        innermusicname(currentmusicDIV.children[1].innerHTML);
    }
    else {

        console.log("playlist end");
    }
}

let nextbtn = document.querySelector(".next-song");
nextbtn.addEventListener("click", () => {
    playnextsong();
})
// control previous song/button

function playprevioussong() {
    let musicDIV = document.getElementsByClassName("music");
    let previous;
    for (let index = 0; index < musicDIV.length; index++) {
        let e = musicDIV[index];
        if (e.lastElementChild.innerHTML == currentmusicDIV.lastElementChild.innerHTML) {
            previous = index - 1;
            break;
        }
    }

    if (!(previous < 0)) {
        document.querySelector(".current_music")?.classList.remove("current_music")
        musicDIV[previous].classList.add("current_music")
        document.querySelector(".musicwave")?.classList.remove("musicwave")
        musicDIV[previous].firstElementChild.classList.add("musicwave")
        currentmusicDIV = musicDIV[previous];
        musicplay(musicDIV[previous].lastElementChild.innerHTML);
        // console.log(musicDIV[previous].firstElementChild.innerHTML)
        outermusicname(currentmusicDIV.children[1].innerHTML);
        innermusicname(currentmusicDIV.children[1].innerHTML);
    }
    else {
        console.log("no more previous available");
    }

}

let previousbtn = document.querySelector(".previous-song");
previousbtn.addEventListener("click", () => {
    playprevioussong();
})

// control functioning by keyboard keys
document.addEventListener("keydown", (e) => {
    // console.log(e);
    // if (e.code == 'Space') {
    //     if (currentmusic.paused) {
    //         currentmusic.play()
    //         playbtn.getElementsByTagName("img")[0].setAttribute("src", "svg/Controls/pause.svg")
    //     }
    //     else {
    //         currentmusic.pause()
    //         playbtn.getElementsByTagName("img")[0].setAttribute("src", "svg/Controls/play.svg")
    //     }
    //     // console.log("space button clicked")
    // }
    // if (e.code == 'ArrowLeft') {
    //     playprevioussong();
    // }
    // if (e.code == 'ArrowRight') {
    //     playnextsong();
    // }
    if (e.code == 'Enter') {
        let value;
        if (screensize.matches) {
            let searchphone = document.querySelector(".searchphone");
            let searchbarphone = searchphone.getElementsByTagName("input")[0];
            value = searchbarphone.value;
            searchbarphone.value = "";
            console.log(value)
            searchbtn.firstElementChild.setAttribute("src", "svg/search.svg");
            searchphone.style.zIndex = "0";
            (
                async () => {
                    let songs = await searchSong(value)
                    searchsongdisplay(songs);
                }
            )()

        }
        else {

            let searchbar = document.querySelector(".searchbar");
            value = searchbar.getElementsByTagName("input")[0].value;
            searchbar.getElementsByTagName("input")[0].value = "";
            console.log(value);
            (
                async () => {
                    let songs = await searchSong(value)
                    searchsongdisplay(songs);
                }
            )()
        }

    }
})


// function to convert seconds to minutes:second format
function timeformat(second) {
    let min = Math.floor(second / 60);
    let sec = Math.floor(second % 60);
    let stringmin = min < 10 ? '0' + min : min;
    let stringsec = sec < 10 ? '0' + sec : sec;
    return stringmin + ":" + stringsec;
}


// music time update
currentmusic.addEventListener("timeupdate", () => {
    // event.stopPropagation();
    // console.log(timeformat(133), timeformat(120))
    let currenttime = timeformat(currentmusic.currentTime);
    let duration = timeformat(currentmusic.duration);
    document.querySelector("#music-current-time").innerHTML = currenttime;
    document.querySelector("#music-duration").innerHTML = duration;
    let seekpoint = document.querySelector(".seekpoint");
    seekpoint.style.left = (currentmusic.currentTime / currentmusic.duration * 100) + '%';
    if (currentmusic.duration == currentmusic.currentTime) {
        playnextsong();
        // currentmusicDIV.firstElementChild.innerHTML;
        // console.log(current_musicname);
        outermusicname(currentmusicDIV.firstElementChild.innerHTML);
        innermusicname(currentmusicDIV.firstElementChild.innerHTML);
        // if(screensize.matches)
        // {
        //     console.log("updating next music for phone screen")
        // }
        // else{
        //     console.log("updating next music for max screen")

        // }
    }

})


// music seek
document.querySelector(".seekline").addEventListener("click", (e) => {
    // event.stopPropagation();
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    // console.log(e.offsetX, e.target.getBoundingClientRect().width)
    console.log(percent)
    document.querySelector(".seekpoint").style.left = percent + '%';
    currentmusic.currentTime = ((currentmusic.duration) * percent) / 100;
})


// dynamic playbar for different screen resolution ----------------------------------------------
// this function only invoke when screen size change
let screensize = window.matchMedia("(max-width : 750px)");
// event.stopPropagation();
screensize.addEventListener("change", () => {
    playbar();
    sidebar();
})
// invoked this function here to get music info while loading the page 
playbar();
sidebar();

function playbar() {
    let footer = document.querySelector(".footer");
    let music_controls = document.querySelector(".music-controls");
    if (screensize.matches) {
        footer.querySelector(".outermusicinfo")?.remove();
        footer.querySelector(".volume")?.remove()
        // ^ this removes outer info while shifting to inner
        music_controls.insertAdjacentHTML("afterbegin", `<div class="innermusicinfo"></div>`)
        // music_controls.insertAdjacentHTML("beforeend", `<input class="volume" type="range" min="1" max="100" value="70"></input>`)
        // console.log("Inner Playbar")
        innermusicname(current_musicname)
    }
    else {
        music_controls.querySelector(".innermusicinfo")?.remove();
        // music_controls.querySelector(".volume")?.remove()
        // ^ this removes outer info while shifting to outer
        footer.insertAdjacentHTML("afterbegin", `<div class="outermusicinfo"></div>`)
        footer.insertAdjacentHTML("beforeend", `<div class="volume"> <input type="range" min="1" max="100" value="50"></div>`)
        console.log("Outer Playbar")
        outermusicname(current_musicname);
        //volume adjust

        let volume = document.querySelector(".volume").getElementsByTagName("input")[0];
        currentmusic.volume = volume.value / 100;
        volume.oninput = function () {
            currentmusic.volume = volume.value / 100;
        }
    }
}

function innermusicname(info = "Not Playing...") {
    let music_controls = document.querySelector(".music-controls");
    music_controls.querySelectorAll(".innermusicinfo").forEach((e) => {
        e.innerHTML = info;
    })

}
function outermusicname(info = "Not Playing...") {
    let footer = document.querySelector(".footer");
    footer.querySelectorAll(".outermusicinfo").forEach((e) => {
        e.innerHTML = info;
    })

}


// dynamically side bar for smarthphone screen
function sidebar() {
    let sidehead = document.getElementsByClassName("sidehead")[0];
    let sidebody = document.getElementsByClassName("sidebody")[0];
    let searchbar = document.querySelector("searchbar");
    if (screensize.matches) {
        sidehead.style.alignItems = "center"
        // sidehead

        sidehead.children[0].children[1].remove();
        sidehead.children[1].children[1].remove();

        sidebody.firstElementChild.remove();
        sidebody.lastElementChild.firstElementChild.remove();
        sidebody.lastElementChild.style.height = "calc(100%)"


    }

}


//==============================================================
// =============        Searchbar       =========================
// ===============================================================

let searchcancel = document.querySelector(".cancelsearch");
searchcancel.addEventListener("click", () => {
    let searchphone = document.querySelector(".searchphone");
    searchphone.style.zIndex = "0";
    searchbtn.firstElementChild.setAttribute("src", "svg/search.svg")
    searchphone.getElementsByTagName("input")[0].value = "";
})


// search using search button in smart phones
let phonesearchbtn = document.querySelector(".searchbarphone").getElementsByTagName("p")[0];
phonesearchbtn.addEventListener("click", async () => {
    let searchphone = document.querySelector(".searchphone");
    let searchbarphone = searchphone.getElementsByTagName("input")[0];
    value = searchbarphone.value;
    searchbarphone.value = "";
    console.log(value)
    searchbtn.firstElementChild.setAttribute("src", "svg/search.svg");
    searchphone.style.zIndex = "0";
    (
        async () => {
            let songs = await searchSong(value)
            searchsongdisplay(songs);
        }
    )()

})
// search song in libarary

let findsong = "Dil Deewana";
async function searchSong(findsong) {
    let tobefoundsong = findsong.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
    tobefoundsong = tobefoundsong.replaceAll(" ", "%20");
    let allplaylist = await getplaylist();
    let finalsongs = [];
    let count = 0;
    let songs = []
    for (let i = 0; i <= allplaylist.length - 1; i++) {
        songs[i] = await getsongs(allplaylist[i])
    }

    for (let i = 0; i <= songs.length - 1; i++) {
        for (let j = 0; j <= songs[i].length - 1; j++) {
            if (songs[i][j].includes(tobefoundsong) && tobefoundsong != "") {
                console.log("found")
                finalsongs[count] = songs[i][j];
                count++;
            }
        }
    }
    return finalsongs;
}

// searchSong(findsong)

async function searchsongdisplay(songsearched) {
    let foundsongs = songsearched;
    let songUL = document.getElementsByClassName("musiccontainer")[0];
    if (foundsongs == "") {
        // console.log("not found")
        songUL.innerHTML = `<div class="playlistname">  <h2>Sorry not found!</h2> </div>`
    }
    else {
        let temp_text1 = `<div class="playlistname">  <h2>Founded Some...</h2> </div>`;
        songUL.innerHTML = temp_text1;
        audiolist(foundsongs);
    }
    listclickedplaylist();
}

