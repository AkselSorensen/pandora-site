# Site vitrine Pandora Bleach : une page HTML et le modèle 3D servis par nginx.
# Construction : docker build -t localhost:5000/pandora-site:2 .
FROM nginx:1.27-alpine
COPY index.html /usr/share/nginx/html/index.html
COPY models /usr/share/nginx/html/modelsEXPOSE 80
