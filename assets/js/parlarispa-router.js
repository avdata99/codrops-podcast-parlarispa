var _urlList = [
    {
        requestedUrl: "/",
        pageTitle: "Cadena de Datos",
        load: loadPage_main
    },
    {
        requestedUrl: "/home",
        pageTitle: "Cadena de Datos",
        load: loadPage_main
        
    },
    {
        requestedUrl: "/episodios",
        pageTitle: "Lista de episodios - Cadena de Datos",
        load: loadPage_episodeList
    },
    {
        requestedUrl: "/episodio",
        pageTitle: "Episodio - Cadena de Datos",
        load: playMedia
    }
];

var _mainContainer = null;

function initRouter() {
    _mainContainer = $("#main_container");

    //let url = window.location.href;
    //let params = url.split('?')[1];
    //let uid = params.split('=')[1];
    //get_episodio(uid);
}

function playMedia() {
    // TODO: Añadir parseo de URLs para capturar el slug del episodio
    // y buscar la data correspondiente de memoria.
}

function openPage(requestedUrl) {
    let pageTitle = "";
    let found = false;

    // Limpiamos el contenedor
    _mainContainer.html("");

    // Verificamos que la URL solicitada sea válida
    for (let i = 0; i < _urlList.length; i++) {
        if (_urlList[i] && _urlList[i].requestedUrl === requestedUrl) {
            pageTitle = _urlList[i].pageTitle;
            _urlList[i].load();
            found = true;
            break;
        }
    }

    // Si no se encontró la página solicitada mostramos una página de error 404.
    if (found === false) {
        //show404Page();
        return;
    }

    /*switch (requestedUrl.toLowerCase())
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
    }*/

    // Cambiamos la URL y SIN cambiar el estado, de esta manera no se va a poder utilizar el botón "Volver" del navegador.
    // Si permitimos que se pueda utilizar el botón volver, se perderá cualquier episodio en reproducción.
    window.history.replaceState({}, pageTitle, requestedUrl);
    // Para actualizar el título correctamente debemos hacerlo de esta manera, debido a que
    // replaceState (o pushState) ignora el parámetro del título.
    document.title = pageTitle;
}

/**
 * Inicializa la carga de la página.
 */
function loadPage_main() {
    let lastEpisode = getLastEpisode();

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
    
    let article = tpl_episode;
            
    _mainContainer.html(replacePlaceholderValues(values, article));
}

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

        htmlCode += replacePlaceholderValues(values, tpl_episode);
    }

    htmlCode += "</div></div>"

    _mainContainer.html(htmlCode);
}