# Template de ejemplo para Parlarispa

Template basado en [Dropcast](dropcast.md).  

La plataforma de podcasts [Parlarispa](https://parlarispa.com/) (backend) procesa audios y entrega APIs simples con datos sobre podcasts y sus episodios. La idea es poder disponer de una versión web+app de todos los podcast alojados en la plataforma. 

Este repositorio es un prototipo de aplicación web que consume esos datos, los muestra y permite reproducir los audios. Cambiando [el ID del podcast](https://github.com/avdata99/codrops-podcast-parlarispa/blob/master/assets/js/parlarispa-main.js#L2) esta app debería poder servir para cualquier otro podcast de la misma plataforma.

Todos los datos a exponer en esta aplicacion [se encuentran en APIs](https://parlarispa.com/api/v1/podcasts/podcast/aa2b715c-73aa-412a-9e04-100f60881ffa/) que ya están funcionando en el backend.