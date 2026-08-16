# Conexión Local — PWA

Esta carpeta contiene una versión PWA de `index(2).html`.

## Archivos nuevos
- `manifest.json`: identidad e instalación de la aplicación.
- `sw.js`: caché y funcionamiento offline.
- `icon-192.png` / `icon-512.png`: iconos PWA provisionales.
- `index.html`: tu página original con integración PWA.

## Importante
Mantén la carpeta `imagen/` y cualquier otro recurso local de tu proyecto en el mismo nivel que `index.html`.

Ejemplo:
```
conexion-local-pwa/
├─ index.html
├─ manifest.json
├─ sw.js
├─ icon-192.png
├─ icon-512.png
└─ imagen/
   ├─ HotelAl.jpeg
   ├─ itgem.png
   └─ ...
```

La PWA debe publicarse mediante HTTPS (por ejemplo GitHub Pages o un hosting con SSL).

Los iconos incluidos son provisionales; reemplázalos por el logo oficial conservando los tamaños 192x192 y 512x512.
