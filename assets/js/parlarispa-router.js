var _urlList = [
    {
        // Corresponde al parametro de las páginas
        param: "p",
        // Valores que puede aceptar el parametro
        values: [
            {
                // Corresponde a la página del listado de episodios
                page: "episodios",
                // Listado de parametros extra que puede aceptar la pagina actual
                params: [],
                // Funcion a cargar cuando se desee cargar esta pagina.
                load: loadPage_episodeList
            },
            {
                page: "episodio",
                // función a ejecutar cuando se solicita la página
                load: loadPage_episodeDetail,
                params: [
                    {
                        // nombre del parametro
                        name: "id"
                    }
                ]
            }
        ]
    }
];

var _mainContainer = null;

function initRouter() {
    _mainContainer = $("#main_container");

    openPage(null);
}

function playMedia(episodeUID) {
    // TODO: Añadir parseo de URLs para capturar el slug del episodio
    // y buscar la data correspondiente de memoria.
    //let episodeUID = eventSender.attr("data-uid");

    let selectedEpisode = findEpisode_byUID(episodeUID);
    //pageTitle = selectedEpisode.nombre + " - " + pageTitle;
    setPlayerMedia(createMediaObject(selectedEpisode));
}

function openPage(eventSender) {
    let requestedUrl = (eventSender) ? eventSender.attr("href") : window.location.href;
    let pageTitle = "";
    let found = false;
    let pageParam = getParameterByName("p", requestedUrl);

    // Limpiamos el contenedor
    _mainContainer.html("");

    // Verificamos que la URL solicitada sea válida
    if (pageParam) {
        // Recorremos la lista de urls permitidas
        for (let i = 0; i < _urlList.length; i++) {
            if (_urlList[i] && _urlList[i].param == "p") {
                let curParam = _urlList[i];

                // recorremos la lista de posibles valores que puede aceptar el parametro
                for (let j = 0; j < curParam.values.length; j++) {
                    let curValue = curParam.values[j];

                    if (curValue.page === pageParam) {
                        found = true;
                        curValue.load(eventSender);
                        break;
                    }
                } // -- fin: for de posibles valores de parametros
            }

            if (found) break;
        } // -- fin: for de urls permitidas
    }
    else {
        // Si no se encuentra ningún parámetro vamos a cargar siempre la página principal.
        loadPage_main();
    }

    // Si no se encontró la página solicitada mostramos una página de error 404.
    if (found === false) {
        //show404Page();
        loadPage_main();
        //return;
    }

    // Cambiamos la URL y SIN cambiar el estado, de esta manera no se va a poder utilizar el botón "Volver" del navegador.
    // Si permitimos que se pueda utilizar el botón volver, se perderá cualquier episodio en reproducción.
    window.history.replaceState({}, pageTitle, requestedUrl);
}

/**
 * Inicializa la carga de la página principal.
 */
function loadPage_main() {
    let lastEpisode = getLastEpisode();

    let tpl_episode = `
        <div class='container'>
            <article class='card mb-3'>
                <a class='img-fluid' data-id='link_episode' data-uid='{{ episode_uid }}' href='index.html?p=episodio&id={{ episode_slug }}'><img class='img-fluid' src='{{ episode_image_url }}' /></a>
                <div class='card-body'>
                    <h5 class='card-title'><a href='index.html?p=episodio&id={{ episode_slug }}' data-id='link_episode' data-uid='{{ episode_uid }}'>{{ episode_title }}</a></h5>
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
    
    let article = tpl_episode;
            
    _mainContainer.html(replacePlaceholderValues(values, article));

    setPageTitle("Cadena de datos");
}

/**
 * Carga la página con la lista de episodios
 */
function loadPage_episodeList() {
    let tpl_episode = "";
    let episodeList = _podcastData.episodios;
    let htmlCode = "<div class='container'><div class='row'>";

    // Recorremos la lista de episodios
    for (let i = 0; i < episodeList.length; i++) {
        let curEpisode = episodeList[i];

        tpl_episode = `
            <div class='col-sm-6'>
                <article class='card mb-3'>
                    <a class='img-fluid' data-id='link_episode' data-uid='{{ episode_uid }}' href='index.html?p=episodio&id={{ episode_slug }}'><img class='img-fluid' src='{{ episode_image_url }}' /></a>
                    <div class='card-body'>
                        <h5 class='card-title'><a href='index.html?p=episodio&id={{ episode_slug }}' data-id='link_episode' data-uid='{{ episode_uid }}'>{{ episode_title }}</a></h5>
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

        htmlCode += replacePlaceholderValues(values, tpl_episode);
    }

    htmlCode += "</div></div>"

    _mainContainer.html(htmlCode);

    setPageTitle("Listado de episodios - Cadena de datos");
}

/**
 * Carga la página con los detalles del episodio e inicia la reproducción del mismo.
 * @param {*} eventSender Elemento disparador del evento.
 */
function loadPage_episodeDetail(eventSender) {
    $.get("/episodio.html", function(content) {
        let episodeUID; 
        let selectedEpisode;

        if (eventSender) {
            episodeUID = eventSender.attr("data-uid");
            selectedEpisode = findEpisode_byUID(episodeUID);
        }
        else {
            selectedEpisode = findEpisode_bySlug(getParameterByName("id", window.location.href));
        }

        setPlayerMedia(createMediaObject(selectedEpisode));

        let values = {
            'episode_image_url': selectedEpisode.imagen, 
            'episode_title': selectedEpisode.nombre, 
            'episode_description': selectedEpisode.descripcion,
            'episode_uid': selectedEpisode.uid,
            'episode_slug': selectedEpisode.slug
        };

        setPageTitle(selectedEpisode.nombre + " - Cadena de datos");

        _mainContainer.html(replacePlaceholderValues(values,content));
    });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function setPageTitle(titleText) {
    // Para actualizar el título correctamente debemos hacerlo de esta manera, debido a que
    // replaceState (o pushState) ignora el parámetro del título.
    document.title = titleText;
}