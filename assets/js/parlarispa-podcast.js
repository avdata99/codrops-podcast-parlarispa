
var base_url = 'https://parlarispa.com';
var podcast_api_url = '/api/v1/podcasts/podcast/16f5edfd-dcf5-4cfd-9b40-c90f0a6f6d47/';

function get_data() {
    let url = base_url + podcast_api_url;
    $.get(url, function() {console.log("success");})
        .done(function(data) {
            load_page(data);
            })
        .fail(function(e, msg) {
            alert('Error leyendo podcast: ' + msg);
            })
        .always(function() {
            console.log('always');
        });
    }

function load_page(data) {
    $("#psp_main_title").html(data.nombre);
    $("#psp_main_subtitle").html(data.descripcion);

    tpl_episode = `<article class="episode">
                <h2 class="episode__number">{{ episode_number }}</h2>
                <div class="episode__media">
                    <a href="episodio.html" class="episode__image" style="background-image: url({{ episode_image_url }});"></a>
                </div>
                <div class="episode__detail">
                    <a href="episodio.html?uid={{ episode_uid }}" class="episode__title"><h4>{{ episode_title }}</h4></a>
                    <!-- <p class="episode__description">{{ episode_description }}</p> -->
                </div>
                </article>`;

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



$(function() {

    get_data();    

    
});

