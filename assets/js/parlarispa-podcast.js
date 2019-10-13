
var base_url = 'https://parlarispa.com';
var podcast_api_url = '/api/v1/podcasts/podcast/aa2b715c-73aa-412a-9e04-100f60881ffa/';

var _listaEpisodios = [];

const CACHE_KEY_EPISODES = "ep_list";

$(document).ready(function() {
    // Obtenemos el listado de podcasts
    getPodcastList();
});

function setCacheTTL() {
    // Un valor de -1 representa un TTL infinito.
    let ttlTime = -1;
    let hour = 1000*60*60;
    let day = hour*24;

    ttlTime = day;

    return ttlTime;
}

/**
 * Establece el tiempo de expiración de la información.
 */
function setExpirationTime() {
    let curTTL = this.setCacheTTL();
    return curTTL !== -1 ? new Date().getTime() + curTTL : curTTL;
}

/**
 * Verifica si el TTL de los datos almacenados para la clave especificada ha vencido.
 * @param data Datos obtenidos desde storage
 */
function isDataOutdated(data) {
    let dataExpTime = parseInt(data.ExpDate, 10);
    let curTime = new Date().getTime();

    if (curTime >= dataExpTime) return true;
    else return false;
}

function saveDataToStorage() {
    var data = {
        EpList: _listaEpisodios,
        ExpDate: setExpirationTime()
    };

    if (!localStorage.getItem("ep_list")) {
        localStorage.setItem("ep_list", JSON.stringify(data));
    }
}

function getEpisodesFromStorage() {
    let data = localStorage.getItem(CACHE_KEY_EPISODES);

    if (!data) return false;

    let parsedData = JSON.parse(data);
    if (isCacheOutdated(parsedData)) getPodcastList();
}

/**
 * Obtiene el listado de podcasts
 */
function getPodcastList() {
    // Verificamos si el listado de episodios ya fue obtenido previamente.


    let url = base_url + podcast_api_url;

    $.get(url, function() {
        console.log("success");}
    ).done(function(data) {
        load_page(data);
    }).fail(function(e, msg) {
        alert('Error leyendo podcast: ' + msg);
    }).always(function() {
        console.log('always');
    });
}

function load_page(data) {
    // Guardamos el listado de episodios
    _listaEpisodios = data;

    $("#psp_main_title").html(data.nombre);
    $("#psp_main_subtitle").html(data.descripcion);

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

    $.each(data.episodios, function(j, episodio){
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
    });
}