## Requerimientos

### Generales

Lineamientos:
 - Definir que librerías / framewors se van a usar. Evitar propuestas muy complejas. El producto es simple.
 - Que el producto final sea simple de entender y modificar. El producto actual es muy simple, esta simpleza se debe mantener.
  - Responsivo/Mobile first.
  - El producto final será libre y algunos clientes lo usarán como base para crear sus propios sitios. Debe estar pensado para que otros desarrolladores accedan rápido a comprender como funciona.
 - Que el sitio web **no se refresque completamente al hacer touch/click** y moverse entre secciones.
   - Si un audio se está reproduciendo no debe cortarse porque el usuario se mueva a otra sección.
 - Esta app debería ser _templatizable_
   - Debería ser facil cambiar colores y fuentes
   - Debería mantenerse la logica javascript separada de la parte estética
 - Siempre URL únicas para cada episodio/recurso interno. Al moverse el usuario la URL deberá cambiar y esta deberá ser válida para volver al recurso (que se pueda compartirse un episodio con una URL).

