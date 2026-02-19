export const planetData = {
  sun: {
    name: "Sol",
    radius: 4,
    color: "#FDB813",
    distance: 0,
    speed: 0,
    rotationSpeed: 0.005,
    info: {
      type: "Estrella",
      diameter: "1,392,000 km",
      mass: "1.989 × 10³⁰ kg",
      temperature: "5,778 K (superficie)",
      composition: "Hidrógeno (73%), Helio (25%), otros (2%)",
      age: "4.6 mil millones de años",
      description: "El Sol es la estrella central del sistema solar y la fuente de luz y calor que sustenta la vida en la Tierra."
    }
  },
  mercury: {
    name: "Mercurio",
    radius: 0.38,
    color: "#8C7853",
    distance: 8,
    speed: 0.024,
    rotationSpeed: 0.017,
    info: {
      type: "Planeta rocoso",
      diameter: "4,879 km",
      mass: "3.301 × 10²³ kg",
      temperature: "-173°C a 427°C",
      orbital_period: "88 días terrestres",
      day_length: "176 días terrestres",
      description: "Mercurio es el planeta más cercano al Sol y el más pequeño del sistema solar. Su superficie está llena de cráteres."
    }
  },
  venus: {
    name: "Venus",
    radius: 0.95,
    color: "#FFC649",
    distance: 11,
    speed: 0.015,
    rotationSpeed: -0.004,
    info: {
      type: "Planeta rocoso",
      diameter: "12,104 km",
      mass: "4.867 × 10²⁴ kg",
      temperature: "462°C (superficie)",
      orbital_period: "225 días terrestres",
      day_length: "243 días terrestres",
      description: "Venus es el planeta más caliente del sistema solar debido a su densa atmósfera de dióxido de carbono."
    }
  },
  earth: {
    name: "Tierra",
    radius: 1,
    color: "#6B93D6",
    distance: 15,
    speed: 0.01,
    rotationSpeed: 0.02,
    info: {
      type: "Planeta rocoso",
      diameter: "12,756 km",
      mass: "5.972 × 10²⁴ kg",
      temperature: "-88°C a 58°C",
      orbital_period: "365.25 días",
      day_length: "24 horas",
      description: "La Tierra es el único planeta conocido que alberga vida, con océanos de agua líquida y una atmósfera protectora."
    },
    moons: [
      {
        name: "Luna",
        radius: 0.27,
        distance: 2.5,
        speed: 0.05,
        texture: "/textures/2k_moon.jpg"
      }
    ]
  },
  mars: {
    name: "Marte",
    radius: 0.53,
    color: "#CD5C5C",
    distance: 20,
    speed: 0.008,
    rotationSpeed: 0.018,
    info: {
      type: "Planeta rocoso",
      diameter: "6,792 km",
      mass: "6.39 × 10²³ kg",
      temperature: "-87°C a -5°C",
      orbital_period: "687 días terrestres",
      day_length: "24.6 horas",
      description: "Marte, conocido como el planeta rojo, tiene los volcanes más grandes del sistema solar y evidencia de agua antigua."
    },
    moons: [
      {
        name: "Fobos",
        radius: 0.1,
        distance: 1.2,
        speed: 0.08,
        texture: "/textures/2k_phobos.jpg"
      },
      {
        name: "Deimos",
        radius: 0.08,
        distance: 1.8,
        speed: 0.04,
        texture: "/textures/2k_deimos.jpg"
      }
    ]
  },
  jupiter: {
    name: "Júpiter",
    radius: 2.5,
    color: "#D8CA9D",
    distance: 30,
    speed: 0.002,
    rotationSpeed: 0.04,
    info: {
      type: "Gigante gaseoso",
      diameter: "142,984 km",
      mass: "1.898 × 10²⁷ kg",
      temperature: "-108°C (superficie de nubes)",
      orbital_period: "12 años terrestres",
      day_length: "9.9 horas",
      description: "Júpiter es el planeta más grande del sistema solar y actúa como un escudo protector para los planetas internos."
    }
  },
  saturn: {
    name: "Saturno",
    radius: 2.1,
    color: "#FAD5A5",
    distance: 40,
    speed: 0.0009,
    rotationSpeed: 0.038,
    hasRings: true,
    info: {
      type: "Gigante gaseoso",
      diameter: "120,536 km",
      mass: "5.683 × 10²⁶ kg",
      temperature: "-139°C (superficie de nubes)",
      orbital_period: "29 años terrestres",
      day_length: "10.7 horas",
      description: "Saturno es famoso por sus espectaculares anillos compuestos principalmente de hielo y roca."
    }
  },
  uranus: {
    name: "Urano",
    radius: 1.6,
    color: "#4FD0E7",
    distance: 50,
    speed: 0.0004,
    rotationSpeed: -0.03,
    info: {
      type: "Gigante de hielo",
      diameter: "51,118 km",
      mass: "8.681 × 10²⁵ kg",
      temperature: "-197°C (superficie de nubes)",
      orbital_period: "84 años terrestres",
      day_length: "17.2 horas",
      description: "Urano es único porque rota de lado, probablemente debido a una colisión antigua. Es un gigante de hielo."
    }
  },
  neptune: {
    name: "Neptuno",
    radius: 1.5,
    color: "#4B70DD",
    distance: 60,
    speed: 0.0001,
    rotationSpeed: 0.032,
    info: {
      type: "Gigante de hielo",
      diameter: "49,528 km",
      mass: "1.024 × 10²⁶ kg",
      temperature: "-201°C (superficie de nubes)",
      orbital_period: "165 años terrestres",
      day_length: "16.1 horas",
      description: "Neptuno es el planeta más distante del Sol y tiene los vientos más fuertes del sistema solar."
    }
  }
};
