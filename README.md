# 🌌 Sistema Solar 3D Interactivo

Una impresionante simulación interactiva del sistema solar en 3D, construida desde cero con **React**, **Three.js** y **React Three Fiber**. Explora el cosmos con texturas realistas, órbitas dinámicas y controles de viaje espacial.

![Solar System Banner](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop)  


## ✨ Características Principales

### 🌑 Cuerpos Celestes
- **Sistema Completo**: Sol + 8 Planetas (Mercurio a Neptuno).
- **Lunas**: 
  - 🌕 **La Luna** orbitando la Tierra.
  - 🥔 **Fobos y Deimos** orbitando a gran velocidad alrededor de Marte.
- **Cinturón de Asteroides**: Un anillo masivo de **2000+ asteroides** orbitando entre Marte y Júpiter, renderizados eficientemente.
- **Anillos de Saturno**: Textura translúcida y detallada.

### 🎮 Interactividad Avanzada
- **Control de Tiempo**: Slider para acelerar, pausar o ralentizar el paso del tiempo en la simulación.
- **Modo Viaje**: Botones "Viajar a..." que animan la cámara suavemente hacia cualquier planeta seleccionado.
- **Información Detallada**: Panel con datos reales (diámetro, masa, temperatura, etc.) al hacer clic en cualquier cuerpo celeste.
- **Controles de Cámara**: Orbit Controls completos (rotar, zoom, desplazarse).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [React 19](https://react.dev/)
- **3D Engine**: [Three.js](https://threejs.org/)
- **React Renderer**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Componentes 3D**: [React Three Drei](https://github.com/pmndrs/drei)
- **Estilos**: [TailwindCSS](https://tailwindcss.com/)
- **Lenguaje**: JavaScript (ES6+)

---

## 🚀 Instalación y Uso

Sigue estos pasos para correr el proyecto en tu máquina local:

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/sistema-solar-3d.git
   cd sistema-solar-3d/frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Explorar**
   Abre tu navegador en `http://localhost:3000` y disfruta del viaje espacial.

---

## 🎮 Guía de Controles

| Acción | Control Mouse / Teclado |
| :--- | :--- |
| **Rotar Vista** | Clic Izquierdo + Arrastrar |
| **Zoom** | Rueda del Ratón (Scroll) |
| **Paneo (Moverse)** | Clic Derecho + Arrastrar |
| **Seleccionar** | Clic en cualquier planeta o luna |
| **Viajar** | Clic en el botón "🚀 Viajar a..." en el panel |

---

## 📂 Estructura del Proyecto

```
frontend/
├── public/
│   └── textures/       # Texturas 2K/8K de planetas, nubes y fondo
├── src/
│   ├── components/
│   │   ├── SolarSystem.jsx  # Componente principal con toda la lógica 3D
│   │   └── ...
│   ├── data/
│   │   └── planets.js       # Datos astronómicos y configuración
│   └── ...
└── ...
```

## 📝 Licencia

Este proyecto está bajo la Licencia **MIT**. Siéntete libre de usarlo, modificarlo y aprender de él, pero no te olvides de darme creditos.

---

Hecho con ❤️ y código estelar.
