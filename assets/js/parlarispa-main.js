var base_url = 'https://parlarispa.com';
var podcast_api_url = '/api/v1/podcasts/podcast/aa2b715c-73aa-412a-9e04-100f60881ffa/';

/** Corresponde a la data completa recibida desde el API */
var _podcastData = null;

$(document).ready(function() {
    init();
});

/** Comienza todo el proceso de inicialización del sitio. */
function init() {
    // Obtenemos toda la información desde el API
    getPodcastData().then((result) => {
        if (result == true) {
            initAudioPlayer();

            let lastEpisode = getLastEpisode();

            setPlayerMedia(createMediaObject(lastEpisode));
        }

        // La inicialización del router debe hacerse luego de haber obtenido
        // los datos de episodios.
        initRouter();
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
    openPage(curElement);
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

function findEpisode_bySlug(slugText) {
    for (let i = 0; i < _podcastData.episodios.length; i++) {
        let curEpisode = _podcastData.episodios[i];

        if (curEpisode && curEpisode.slug == slugText) {
            return curEpisode;
        }
    }
}

function replacePlaceholderValues(values, htmlText) {
    for (var i in values) {
        // Utilizamos una Regular Expression de manera tal que los placeholders
        // puedan ser reemplazados a lo largo de todo el texto y no solamente la primera vez que se encuentre dicho valor
        let re = new RegExp("{{ " + i + " }}", "ig");
        htmlText = htmlText.replace(re, values[i]);
    }

    return htmlText;
}