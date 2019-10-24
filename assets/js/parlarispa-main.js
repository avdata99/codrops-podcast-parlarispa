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
            loadMainPage();

            initAudioPlayer();

            let lastEpisode = getLastEpisode();

            setPlayerMedia(createMediaObject(lastEpisode));
        }
    });

    registerPageEvents();
}

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

/**
 * Enlaza eventos a elementos HTML a lo largo del documento.
 * <p>
 * Nota: Todos los eventos, como por ejemplo clicks, mouseover, etc. deberían registrarse acá
 * para mantener el orden.
 * </p>
 */
function registerPageEvents() {
    
    // Eventos de click sobre todas las etiquetas "<a>"
    $(document).on("click", "a", function(event) {
        event.preventDefault();
        event.stopPropagation();

        let curID = $(this).attr("data-id");

        switch (curID.toLowerCase())
        {
            case "link_epilist":    // lista de episodios
                loadEpisodesList();
                break;

            case "link_episode":    // detalle de episodio

                break;

            default:
                loadMainPage();
                break;
        }

        /*if (curID == "link_epiList") {
            loadEpisodesList();
        }
        //else openLink($(this));
        else loadMainPage();*/
    })
}

function openLink(linkElement) {
    let linkDest = linkElement.attr("href");

    _mainContainer.load(linkDest);
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
 * Inicializa la carga de la página.
 */
function loadMainPage() {
    let lastEpisode = getLastEpisode();

    _mainContainer.html("");

    //$("#psp_main_title").html(_podcastData.nombre);
    //$("#psp_main_subtitle").html(_podcastData.descripcion);

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
                <a class='img-fluid' data-id='link_episode' href='episodio/{{ episode_slug }}'><img class='img-fluid' src='{{ episode_image_url }}' /></a>
                <div class='card-body'>
                    <h5 class='card-title'><a href='episodio/{{ episode_slug }}' data-id='link_episode'>{{ episode_title }}</a></h5>
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

/**
 * Obtiene el último episodio de la lista.
 */
function getLastEpisode() {
    return _podcastData.episodios[0];
}