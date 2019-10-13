
var base_url = 'https://parlarispa.com';
var podcast_api_url = '/api/v1/podcasts/podcast/aa2b715c-73aa-412a-9e04-100f60881ffa/';

$(document).ready(function() {
    // Obtenemos el listado de podcasts
    getPodcastList();
});

/**
 * Obtiene el listado de podcasts
 */
function getPodcastList() {
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
                <img src='{{ episode_image_url }}' />
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