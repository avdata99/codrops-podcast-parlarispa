var _audioPlayer = null;

/**
 * Crea un objeto que será utilizado por el reproductor a partir de los datos del episodio.
 * @param {*} episodeData Datos del episodio.
 */
function createMediaObject(episodeData) {
    return {
        mp3File: episodeData.audio_url,
        title: episodeData.nombre
    }
}

/**
 * Establece el audio que se desea reproducir.
 * @param {Object} mediaData Objeto con los datos del audio a reproducir.
 */
function setPlayerMedia(mediaData) {
    _audioPlayer.jPlayer("setMedia", {
        mp3: mediaData.mp3File,
        title: mediaData.title
    });
}

/**
 * Inicializa el reproductor de audio
 */
function initAudioPlayer() {
    _audioPlayer = $("#jquery_jplayer_1");
    
    _audioPlayer.jPlayer({
        cssSelectorAncestor: "#jp_container_1",
        swfPath: "/js", // TODO: cambiar directorio
        supplied: "mp3",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true
    });
}

function playerStart() {
    _audioPlayer.jPlayer("play");
}

function playerPause() {
    _audioPlayer.jPlayer("pause");
}