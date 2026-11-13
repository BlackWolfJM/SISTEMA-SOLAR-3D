# Sistema Solar 3D

**Explorador educativo del sistema solar construido con React y Three.js.**

Sistema Solar 3D es una aplicación web interactiva para explorar el Sol, los ocho planetas y algunos satélites naturales. Combina una escena tridimensional, texturas planetarias, navegación por cámara y herramientas de aprendizaje.

**Acceder a la aplicación:** https://blackwolfjm.github.io/SISTEMA-SOLAR-3D/

## Características

### Visualización astronómica

- Escena 3D del Sol y los ocho planetas con texturas locales.
- Movimiento orbital y rotación configurables, con opción de pausar la simulación.
- Satélites de la Tierra y Marte, anillos de Saturno y cinturón de asteroides.
- Vistas generales y enfoque automático de los cuerpos celestes.
- Textura de la Vía Láctea y opción de campo estelar simplificado.
- Activación independiente de etiquetas, órbitas, satélites, asteroides y cuadrícula.
- Tres niveles de calidad gráfica para adaptar el rendimiento.

### Herramientas educativas

- Catálogo con búsqueda de cuerpos celestes y filtros por categoría.
- Fichas con información descriptiva, tamaños, masas, temperaturas y periodos orbitales.
- Comparación de dos planetas por sus atributos físicos.
- Recorrido guiado a través de ocho estaciones.
- Cuestionario de seis preguntas con retroalimentación.
- Captura de la escena en PNG y enlaces compartibles que conservan el planeta seleccionado.
- Accesos rápidos de teclado y diseño adaptable a móviles y tabletas.

### Diseño y experiencia

- Interfaz renovada con iconografía vectorial de Lucide, sin emojis.
- Paneles de navegación y fichas científicas coherentes con el estilo del observatorio.
- Metadatos de la página, icono SVG personalizado y etiquetas descriptivas.

## Tecnologías

| Herramienta | Uso |
| --- | --- |
| React | Componentes y estado de la interfaz |
| Three.js | Escena y materiales tridimensionales |
| React Three Fiber | Integración de Three.js con React |
| React Three Drei | Cámara, controles y elementos auxiliares |
| Lucide React | Iconos vectoriales |
| CSS | Estilos, diseño adaptable y accesibilidad |
| Create React App + CRACO | Compilación del proyecto |
| GitHub Actions | Verificación y publicación automática |

## Instalación local

Se recomienda Node.js 22.

```bash
git clone https://github.com/BlackWolfJM/SISTEMA-SOLAR-3D.git
cd SISTEMA-SOLAR-3D/frontend
npm ci --legacy-peer-deps
npm start
```

El servidor de desarrollo estará disponible en `http://localhost:3000`.

Para generar una versión de producción:

```bash
CI=false npm run build
```

La compilación se generará en `frontend/build/`.

## Publicación

El flujo `.github/workflows/deploy.yml` construye el frontend y publica el contenido generado en GitHub Pages cada vez que se actualiza `main`. La publicación requiere activar **GitHub Pages → GitHub Actions** en la configuración del repositorio si GitHub no lo habilita automáticamente.

**Dirección del proyecto:** https://blackwolfjm.github.io/SISTEMA-SOLAR-3D/

## Controles

| Acción | Control |
| --- | --- |
| Rotar la cámara | Arrastrar con el botón izquierdo o con un dedo |
| Zoom | Rueda del ratón o gesto de pellizco |
| Desplazar la cámara | Arrastrar con el botón derecho |
| Seleccionar un planeta | Pulsar su modelo o su nombre en el catálogo |
| Pausar o reanudar | Barra espaciadora |
| Restaurar vista | Tecla Inicio |
| Buscar | Tecla / |
| Cerrar panel | Esc |
| Cambiar selección | Flechas izquierda y derecha |

## Alcance del modelo

La representación es **didáctica y no está a escala**. Los radios planetarios, las distancias orbitales, las velocidades y el tamaño de los satélites han sido adaptados para facilitar la exploración. Las trayectorias se aproximan mediante circunferencias y no representan efemérides ni posiciones reales para una fecha determinada. Las texturas se usan con fines ilustrativos.

Los datos de las fichas proceden del material descriptivo de este proyecto y pueden contener aproximaciones. Para información astronómica verificada, consulta [NASA Solar System Exploration](https://science.nasa.gov/solar-system/) y [JPL Solar System Dynamics](https://ssd.jpl.nasa.gov/).

## Estructura del repositorio

```text
SISTEMA-SOLAR-3D/
├── .github/workflows/       # Pruebas y publicación
├── frontend/
│   ├── public/textures/     # Texturas planetarias
│   ├── public/solar-icon.svg
│   └── src/
│       ├── components/
│       │   ├── SolarScene.jsx
│       │   ├── SolarSystem.jsx
│       │   └── SolarSystem.css
│       └── data/planets.js
├── README.md
└── LICENSE
```

## Autoría y licencia

Proyecto desarrollado por [BlackWolfJM](https://github.com/BlackWolfJM). Código publicado bajo la licencia incluida en [LICENSE](LICENSE). Las imágenes y texturas de terceros mantienen sus condiciones de uso correspondientes; verifica su atribución y permisos antes de redistribuirlas.
