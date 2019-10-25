var base_url = 'https://parlarispa.com';
var podcast_api_url = '/api/v1/podcasts/podcast/aa2b715c-73aa-412a-9e04-100f60881ffa/';

/** Corresponde a la data completa recibida desde el API */
var _podcastData = null;

var _mainContainer = null;

$(document).ready(function() {
    _mainContainer = $("#main_container");

    init();
});

/** Comienza todo el proceso de inicialización del sitio. */
function init() {
    // Obtenemos toda la información desde el API
    getPodcastData().then((result) => {
        if (result == true) {
            loadPage_main();

            initAudioPlayer();

            let lastEpisode = getLastEpisode();

            setPlayerMedia(createMediaObject(lastEpisode));
        }
    });

    registerPageEvents();
}

/**
 * Enlaza eventos a elementos HTML a lo largo del documento.
 * 
 * Nota: Todos los eventos, como por ejemplo clicks, mouseover, etc. deberían registrarse acá
 * para mantener el orden.
 */
function registerPageEvents() {
    
    // Eventos de click sobre todas las etiquetas "<a>"
    $(document).on("click", "a", function(event) {
        onClickEventHandler_link($(this), event);
    });
}

/**
 * Controlador de evento de click sobre hipervinculos.
 * @param {*} curElement Elemento clickeado disparador del evento.
 * @param {*} event Evento de click disparado.
 */
function onClickEventHandler_link(curElement, event) {
    event.preventDefault();

    let curID = curElement.attr("data-id");
    let targetLink = curElement.attr("href");
    let pageTitle = "Cadena de Datos";

    switch (curID.toLowerCase())
    {
        case "link_epilist":    // lista de episodios
            loadPage_episodeList();
            break;

        case "link_episode":    // Carga del episodio seleccionado.
            let episodeUID = curElement.attr("data-uid");

            let selectedEpisode = findEpisode_byUID(episodeUID);
            pageTitle = selectedEpisode.nombre + " - " + pageTitle;
            setPlayerMedia(createMediaObject(selectedEpisode));
            break;

        case "link_home":       // Carga de la home.
        default:
            loadPage_main();
            break;
    }

    // Cambiamos la URL y SIN cambiar el estado, de esta manera no se va a poder utilizar el botón "Volver" del navegador.
    // Si permitimos que se pueda utilizar el botón volver, se perderá cualquier episodio en reproducción.
    window.history.replaceState({}, pageTitle, "/" + targetLink);
    // Para actualizar el título correctamente debemos hacerlo de esta manera, debido a que
    // replaceState (o pushState) ignora el parámetro del título.
    document.title = pageTitle;
}

/**
 * Obtiene toda la información del podcast desde el API.
 */
function getPodcastData() {
    return new Promise((resolve) => {
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
            }).fail(function(msg) {
                alert('Error leyendo podcast: ' + msg);

                resolve(false);
            }).always(function() {
                console.log('always');
            });
        }
    });
}

/**
 * Obtiene el último episodio de la lista.
 */
function getLastEpisode() {
    return _podcastData.episodios[0];
}

/**
 * Obtiene un episodio según su UID
 * @param {string} uid UID del episodio.
 */
function findEpisode_byUID(uid) {
    for (let i = 0; i < _podcastData.episodios.length; i++) {
        let curEpisode = _podcastData.episodios[i];

        if (curEpisode && curEpisode.uid == uid) {
            return curEpisode;
        }
    }
}

/**
 * Inicializa la carga de la página.
 */
function loadPage_main() {
    let lastEpisode = getLastEpisode();

    _mainContainer.html("");

    let tpl_episode = `
        <div class='container'>
            <article class='card mb-3'>
                <a class='img-fluid' data-id='link_episode' data-uid='{{ episode_uid }}' href='episodio/{{ episode_slug }}'><img class='img-fluid' src='{{ episode_image_url }}' /></a>
                <div class='card-body'>
                    <h5 class='card-title'><a href='episodio/{{ episode_slug }}' data-id='link_episode' data-uid='{{ episode_uid }}'>{{ episode_title }}</a></h5>
                    <p class='card-text'>{{ episode_description }}</p>
                </div>
            </article>
        </div>`;

    let values = {
        'episode_number': _podcastData.episodios.length - 1, 
        'episode_image_url': lastEpisode.imagen, 
        'episode_title': lastEpisode.nombre, 
        'episode_description': lastEpisode.descripcion,
        'episode_uid': lastEpisode.uid,
        'episode_slug': lastEpisode.slug
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


function loadPage_episodeList() {
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
                    <a class='img-fluid' data-id='link_episode' data-uid='{{ episode_uid }}' href='episodio/{{ episode_slug }}'><img class='img-fluid' src='{{ episode_image_url }}' /></a>
                    <div class='card-body'>
                        <h5 class='card-title'><a href='episodio/{{ episode_slug }}' data-id='link_episode' data-uid='{{ episode_uid }}'>{{ episode_title }}</a></h5>
                        <p class='card-text'>{{ episode_description }}</p>
                    </div>
                </article>
            </div>`;

        let values = {
            'episode_number': i + 1, 
            'episode_image_url': curEpisode.imagen, 
            'episode_title': curEpisode.nombre, 
            'episode_description': curEpisode.descripcion,
            'episode_uid': curEpisode.uid,
            'episode_slug': curEpisode.slug
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