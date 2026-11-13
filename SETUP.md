# Instalación y despliegue

## Requisitos

- Node.js 22.
- npm.
- Un navegador compatible con WebGL.

## Uso local

Clona el repositorio y ejecuta:

```bash
git clone https://github.com/BlackWolfJM/SISTEMA-SOLAR-3D.git
cd SISTEMA-SOLAR-3D/frontend
npm ci --legacy-peer-deps
npm start
```

El navegador abre `http://localhost:3000`.

## Compilación

```bash
CI=false npm run build
```

Los archivos finales se guardan en `frontend/build/`.

## GitHub Pages

1. En GitHub abre **Settings > Pages**.
2. Selecciona **GitHub Actions** como fuente de publicación.
3. Desde **Actions** ejecuta el workflow **Publicar Sistema Solar 3D** si no se ha iniciado automáticamente.
4. Comprueba el resultado en https://blackwolfjm.github.io/SISTEMA-SOLAR-3D/.

La ruta pública de React está configurada mediante `homepage` en `frontend/package.json`. Las texturas se resuelven desde `PUBLIC_URL` para funcionar bajo el subdirectorio de GitHub Pages.

## Publicación alternativa en Netlify

El repositorio incluye `netlify.toml` como alternativa de despliegue. La aplicación no necesita un backend para mostrar su escena 3D.

## Notas

El sistema solar se representa de forma esquemática y no a escala. Este proyecto no proporciona simulación gravitatoria ni posiciones astronómicas oficiales.
