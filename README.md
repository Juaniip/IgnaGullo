# Igna Gullo — Propuesta audiovisual

Single page con la propuesta de producción audiovisual para el DJ Igna Gullo: rodaje multicámara 4K 60 fps, iluminación de cabina, repertorio en vivo y muestra del último set. Animaciones con [Anime.js](https://animejs.com) v4.

## Estructura

```
site/
├── index.html        # Escenas de la página
├── styles.css        # Estética blanco y negro
├── main.js           # Animaciones de scroll (Anime.js)
├── data.js           # Repertorio por bloques
├── assets/logo.png
├── media/            # Video del set (H.264 1080p) y portada
└── vendor/anime.esm.min.js
```

## Local

```bash
python -m http.server 5173 --directory site
```

## Producción (Raspberry Pi)

Servido con nginx en Docker en el puerto `8090`, expuesto con Cloudflare Tunnel (`HTTP → localhost:8090`).

```bash
docker run -d --name propuesta-igna --restart unless-stopped \
  -p 8090:80 -v "$HOME/Desktop/propuesta IGNA":/usr/share/nginx/html:ro nginx:alpine
```
