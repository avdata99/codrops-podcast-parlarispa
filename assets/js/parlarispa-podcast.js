
var base_url = 'https://parlarispa.com';
var podcast_api_url = '/api/v1/podcasts/podcast/aa2b715c-73aa-412a-9e04-100f60881ffa/';

/** Corresponde a la data completa recibida desde el API */
var _podcastData = null;

const CACHE_KEY_EPISODES = "pc_data";

$(document).ready(function() {
    // Obtenemos el listado de podcasts
    getPodcastList();
});

/**
 * Obtiene el listado de podcasts
 */
function getPodcastList() {
    // Verificamos si el listado de episodios ya fue obtenido previamente.
    let dataFromStorage = getDataFromStorage();

    if (dataFromStorage) {
        _podcastData = dataFromStorage;
        
        // Iniciamos la carga de la página
        load_page();
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
           
            // Iniciamos la carga de la página
            load_page();
        }).fail(function(e, msg) {
            alert('Error leyendo podcast: ' + msg);
        }).always(function() {
            console.log('always');
        });
    }
}

/**
 * Inicializa la carga de la página.
 */
function load_page() {
    let lastEpisode = getLastEpisode();

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
    
    $("#episodes_section").append($article);
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