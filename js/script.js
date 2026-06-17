let currentKit = 0;
let unlocked = false;
let volume = 1;

const audioCache = {};

function getPath(kitIndex,padIndex){

return `sounds/${
    kits[kitIndex]
}/${
    padFiles[padIndex]
}`;

}

function loadKit(kitIndex){

audioCache[kitIndex] = [];

padFiles.forEach((_,padIndex)=>{

    const audio =
        new Audio(
            getPath(
                kitIndex,
                padIndex
            )
        );

    audio.preload = "auto";

    audioCache[kitIndex]
        .push(audio);

});

}

kits.forEach((_,i)=>{
loadKit(i);
});

function unlockAudio(){

if(unlocked) return;

unlocked = true;

Object.values(audioCache)
.forEach(kit=>{

    kit.forEach(audio=>{

        audio.volume = 0;

        audio.play()
        .then(()=>{

            audio.pause();

            audio.currentTime = 0;

        })
        .catch(()=>{});

    });

});

}

document.addEventListener(
"pointerdown",
unlockAudio,
{once:true}
);

const kitBtn =
document.getElementById(
"kitBtn"
);

kitBtn.addEventListener(
"click",
()=>{

    currentKit =
    (currentKit + 1)
    % kits.length;

    kitBtn.textContent =
    "🥁 " +
    kits[currentKit];

}

);

function playPad(index){

if(!unlocked) return;

const original =
    audioCache[currentKit][index];

if(!original) return;

const audio =
    original.cloneNode();

audio.volume = volume;

audio.play()
.catch(()=>{});

const pad =
document.querySelector(
    `.pad[data-index="${index}"]`
);

if(!pad) return;

pad.classList.add(
    "active"
);

setTimeout(()=>{

    pad.classList.remove(
        "active"
    );

},100);

}

document
.querySelectorAll(".pad")
.forEach(pad=>{

pad.addEventListener(
    "pointerdown",
    e=>{

        e.preventDefault();

        playPad(
            Number(
                pad.dataset.index
            )
        );

    }
);

});

const keys = [
"Q","W","E","R",
"T","Y","U","I"
];

document.addEventListener(
"keydown",
e=>{

    const key =
        e.key.toUpperCase();

    const index =
        keys.indexOf(key);

    if(index !== -1){

        e.preventDefault();

        playPad(index);

    }

}

);

const menuBtn =
document.getElementById(
"menuBtn"
);

const menu =
document.getElementById(
"menu"
);

menuBtn?.addEventListener(
"click",
()=>{

    menu.classList.toggle(
        "show"
    );

}

);

const volumeBtn =
document.getElementById(
"volumeBtn"
);

const volumePanel =
document.getElementById(
"volumePanel"
);

volumeBtn?.addEventListener(
"click",
()=>{

    volumePanel.classList.toggle(
        "show"
    );

    menu.classList.remove(
        "show"
    );

}

);

document
.getElementById(
"volumeSlider"
)
?.addEventListener(
"input",
e=>{

    volume =
        e.target.value / 100;

}

);

document
.getElementById(
"fullscreenBtn"
)
?.addEventListener(
"click",
()=>{

    if(
        !document
        .fullscreenElement
    ){

        document
        .documentElement
        .requestFullscreen();

    }else{

        document
        .exitFullscreen();

    }

}

);
