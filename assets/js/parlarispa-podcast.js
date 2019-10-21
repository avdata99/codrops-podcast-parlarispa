
var base_url = 'https://parlarispa.com';
var podcast_api_url = '/api/v1/podcasts/podcast/aa2b715c-73aa-412a-9e04-100f60881ffa/';

/** Corresponde a la data completa recibida desde el API */
var _podcastData = null;

var _audioPlayer = null;

var _mainContainer = null;

const CACHE_KEY_EPISODES = "pc_data";

$(document).ready(function() {
    _mainContainer = $("#main_container");

    // Obtenemos el listado de podcasts
    getPodcastList().then((result) => {
        if (result == true) {
            loadMainPage();

            initAudioPlayer();

            let lastEpisode = getLastEpisode();

            setPlayerMedia(setMediaObject(lastEpisode));
        }
    });

    registerPageEvents();
});

function loadEpisodesList() {
    _mainContainer.html("");

    let tpl_episode = "";
    let episodeList = _podcastData.episodios;
    let htmlCode = "<div class='container'><div class='row'>";

    // Recorremos la lista de episodios
    for (let i = 0; i < episodeList.length; i++) {
        let curEpisode = episodeList[i];

        tpl_episode = `
            <div class='col-sm-6'>
                <article class='card mb-3'>
                    <img class='img-fluid' src='{{ episode_image_url }}' />
                    <div class='card-body'>
                        <h5 class='card-title'>{{ episode_title }}</h5>
                        <p class='card-text'>{{ episode_description }}</p>
                    </div>
                </article>
            </div>`;

        let values = {
            'episode_number': i + 1, 
            'episode_image_url': curEpisode.imagen, 
            'episode_title': curEpisode.nombre, 
            'episode_description': curEpisode.descripcion,
            'episode_uid': curEpisode.uid
        };

        for (var j in values) {
            // Utilizamos una Regular Expression de manera tal que los placeholders
            // puedan ser reemplazados a lo largo de todo el texto y no solamente la primera vez que se encuentre dicho valor
            let re = new RegExp("{{ " + j + " }}", "ig");
            tpl_episode = tpl_episode.replace(re, values[j]);
        }

        htmlCode += tpl_episode;
    }

    htmlCode += "</div></div>"

    _mainContainer.append(htmlCode);
}

function registerPageEvents() {
    $("a").click(function(event) {
        event.preventDefault();

        let curID = $(this).attr("id");

        if (curID == "link_epiList") {
            loadEpisodesList();
        }
        //else openLink($(this));
        else loadMainPage();
    })
}

function openLink(linkElement) {
    let linkDest = linkElement.attr("href");

    _mainContainer.load(linkDest);
}

function setMediaObject(episodeData) {
    return {
        mp3File: episodeData.audio_url,
        title: episodeData.nombre
    }
}

function setPlayerMedia(mediaData) {
    _audioPlayer.jPlayer("setMedia", {
        mp3: mediaData.mp3File,
        title: mediaData.title
    });
}

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

/**
 * Obtiene el listado de podcasts
 */
function getPodcastList() {
    return new Promise((resolve, reject) => {
        // Verificamos si el listado de episodios ya fue obtenido previamente.
        let dataFromStorage = getDataFromStorage();

        if (dataFromStorage) {
            _podcastData = dataFromStorage;
            
            resolve(true);
        }
        else {
            // Solo obtenemos datos desde el API si no hay datos en storage
            // o si los mismos han expirado.
            let url = base_url + podcast_api_url;

            $.get(url, function() {
                console.log("success");
            }).done(function(data) {
                // Almacenamos la data recibida en caché
                saveDataToStorage(data);

                // Establecemos la data en una variable global.
                _podcastData = data;

                resolve(true);
            }).fail(function(e, msg) {
                alert('Error leyendo podcast: ' + msg);

                resolve(false);
            }).always(function() {
                console.log('always');
            });
        }
    });
}

/**
 * Inicializa la carga de la página.
 */
function loadMainPage() {
    let lastEpisode = getLastEpisode();

    _mainContainer.html("");

    $("#psp_main_title").html(_podcastData.nombre);
    $("#psp_main_subtitle").html(_podcastData.descripcion);

    /*let tpl_episode = `<article class="episode">
                <h2 class="episode__number">{{ episode_number }}</h2>
                <div class="episode__media">
                    <a href="episodio.html" class="episode__image" style="background-image: url({{ episode_image_url }});"></a>
                </div>
                <div class="episode__detail">
                    <a href="episodio.html?uid={{ episode_uid }}" class="episode__title"><h4>{{ episode_title }}</h4></a>
                    <!-- <p class="episode__description">{{ episode_description }}</p> -->
                </div>
                </article>`;*/

    let tpl_episode = `
        <div class='container'>
            <article class='card mb-3'>
                <img class='img-fluid' src='{{ episode_image_url }}' />
                <div class='card-body'>
                    <h5 class='card-title'>{{ episode_title }}</h5>
                    <p class='card-text'>{{ episode_description }}</p>
                </div>
            </article>
        </div>`;

    /*$.each(lastEpisode, function(j, episodio){
        let values = {
            'episode_number': data.episodios.length - j, 
            'episode_image_url': episodio.imagen, 
            'episode_title': episodio.nombre, 
            'episode_description': episodio.descripcion,
            'episode_uid': episodio.uid
        };
        $article = tpl_episode;
        for (var i in values) {
            $article = $article.replace("{{ " + i + " }}", values[i])
        }
        
        $("#episodes_section").append($article);
    });*/

    let values = {
        'episode_number': _podcastData.episodios.length - 1, 
        'episode_image_url': lastEpisode.imagen, 
        'episode_title': lastEpisode.nombre, 
        'episode_description': lastEpisode.descripcion,
        'episode_uid': lastEpisode.uid
    };
    
    $article = tpl_episode;
    
    for (var i in values) {
        // Utilizamos una Regular Expression de manera tal que los placeholders
        // puedan ser reemplazados a lo largo de todo el texto y no solamente la primera vez que se encuentre dicho valor
        let re = new RegExp("{{ " + i + " }}", "ig");
        $article = $article.replace(re, values[i]);
    }
    
    _mainContainer.append($article);
}

/**
 * Obtiene el último episodio de la lista.
 */
function getLastEpisode() {
    return _podcastData.episodios[0];
}

/** Devuelve la cantidad de milisegundos equivalentes a 24 horas. */
function setCacheTTL() {
    let hour = 1000*60*60;
    let day = hour*24;

    return day;
}

/**
 * Establece el tiempo de expiración para la data en storage.
 */
function setExpirationTime() {
    let curTTL = this.setCacheTTL();
    return new Date().getTime() + curTTL;
}

/**
 * Verifica si el TTL de la data en storage ha expirado.
 * @param data Datos obtenidos desde storage
 */
function isDataOutdated(data) {
    let dataExpTime = parseInt(data.ExpDate, 10);
    let curTime = new Date().getTime();

    if (curTime >= dataExpTime) return true;
    else return false;
}

/**
 * Almacena la lista de episodios en storage con un tiempo de expiración.
 */
function saveDataToStorage(curData) {
    var data = {
        Data: curData,
        ExpDate: setExpirationTime()
    };

    if (!getDataFromStorage()) localStorage.setItem(CACHE_KEY_EPISODES, JSON.stringify(data));
}

/**
 * Obtiene la lista de episodios desde storage.
 */
function getDataFromStorage() {
    let data = localStorage.getItem(CACHE_KEY_EPISODES);
    
    // No existen datos en storage.
    if (!data) return null;

    let parsedData = JSON.parse(data);

    // En caso que existan datos en storage, debemos verificar el tiempo de expiración.
    if (isDataOutdated(parsedData)) return null;

    // Si todo esta Ok, devolvemos la data completa.
    return parsedData.Data;
}