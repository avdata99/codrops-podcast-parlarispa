# Template de ejemplo para Parlarispa

Basado en [Dropcast](dropcast.md).  
La plataforma de podcast _Parlarispa_ procesa audios y entrega APIs simples con datos sobre podcasts y sus episodios.  

Este repositorio es un prototipo de aplicación web que consume esos datos, los muestra y permite reproducir los audios.  

Se hizo con la finalidad de mostrar el producto final buscado.

## Requerimientos

### Generales

Lineamientos:
 - Definir que librerías / framewors se van a usar.
 - Que el producto final sea simple de entender y modificar. El producto actual es muy simple, esta simpleza se debe mantener.
  - Mobile first.
  - El producto final será libre y algunos clientes lo usarán como base para crear sus propios sitios. Debe estar pensado para que otros desarrolladores accedan rápido a comprender como funciona.

### Particulares

Tickets:
 - Que el sitio web no se refresque completamente al hacer click y moverse entre secciones.
 - Si un audio se está reproduciendo no debe cortarse porque el usuario se mueva a otra sección.
 - Tener un control de volumen disponible.
 - Adaptar el template (o proponer otro) para que funcione perfecto en mobile. Hoy tiene algunos detalles a corregir.
 - URL únicas para cada episodio/recurso interno. Al moverse el usuario la URL deberá cambiar y esta deberá ser válida para volver al recurso.
 - Definir una forma de mostrar los links a otras plataformas de podcasts (ya está en el API pero no en la web).
 

