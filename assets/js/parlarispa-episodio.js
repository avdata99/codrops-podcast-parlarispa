
var base_url = 'http://dev.com:8000';
var episodio_api_url = '/api/v1/podcasts/episodio/';

function get_episodio(uid) {
    let url = base_url + episodio_api_url + uid + '/';
    $.get(url, function() {console.log("success");})
        .done(function(data) {
            load_page(data);
            })
        .fail(function(e, msg) {
            alert('Error leyendo episodio: ' + msg);
            })
        .always(function() {
            console.log('always');
        });
    }

function load_page(data) {
    $("#epi_main_title").html(data.nombre);
    $("#epi_descripcion").html(data.descripcion);
    $("#epi_image").attr('src', data.imagen);
    $("#podcast_name").html(data.podcast.nombre);
    $("#epi_audio").attr('src', base_url + data.audio_url);
    
}

$(function() {
    let url = window.location.href;
    let params = url.split('?')[1];
    let uid = params.split('=')[1];
    get_episodio(uid);
});

