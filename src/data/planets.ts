export interface Moon {
  name: string;
  nameRu: string;
  radius: number; // km
  orbitalPeriod: number; // days around planet
  distanceFromPlanet: number; // thousand km
  displayDistance: number; // pixels from planet
  displayRadius: number; // pixels
  color: string;
}

export interface Planet {
  name: string;
  nameRu: string;
  radius: number; // km
  displayRadius: number; // pixels for canvas
  distanceFromSun: number; // million km
  orbitRadius: number; // pixels for canvas
  orbitalPeriod: number; // Earth days
  color: string;
  description: string;
  moons: Moon[];
}

export const planets: Planet[] = [
  {
    name: "Mercury",
    nameRu: "Меркурий",
    radius: 2439,
    displayRadius: 4,
    distanceFromSun: 57.9,
    orbitRadius: 60,
    orbitalPeriod: 88,
    color: "#b5b5b5",
    description: "Самая маленькая и ближайшая к Солнцу планета. Поверхность покрыта кратерами.",
    moons: []
  },
  {
    name: "Venus",
    nameRu: "Венера",
    radius: 6051,
    displayRadius: 7,
    distanceFromSun: 108.2,
    orbitRadius: 90,
    orbitalPeriod: 225,
    color: "#e8cda0",
    description: "Самая горячая планета с плотной атмосферой из углекислого газа.",
    moons: []
  },
  {
    name: "Earth",
    nameRu: "Земля",
    radius: 6371,
    displayRadius: 8,
    distanceFromSun: 149.6,
    orbitRadius: 120,
    orbitalPeriod: 365,
    color: "#4da6ff",
    description: "Наш дом! Единственная известная планета с жизнью и жидкой водой на поверхности.",
    moons: [
      {
        name: "Moon",
        nameRu: "Луна",
        radius: 1737,
        orbitalPeriod: 27.3,
        distanceFromPlanet: 384,
        displayDistance: 14,
        displayRadius: 2.5,
        color: "#cccccc"
      }
    ]
  },
  {
    name: "Mars",
    nameRu: "Марс",
    radius: 3389,
    displayRadius: 5,
    distanceFromSun: 227.9,
    orbitRadius: 155,
    orbitalPeriod: 687,
    color: "#e07040",
    description: "Красная планета с самой высокой горой в Солнечной системе — Олимп.",
    moons: [
      {
        name: "Phobos",
        nameRu: "Фобос",
        radius: 11,
        orbitalPeriod: 0.32,
        distanceFromPlanet: 9.4,
        displayDistance: 10,
        displayRadius: 1.5,
        color: "#a08070"
      },
      {
        name: "Deimos",
        nameRu: "Деймос",
        radius: 6,
        orbitalPeriod: 1.26,
        distanceFromPlanet: 23.5,
        displayDistance: 14,
        displayRadius: 1,
        color: "#908070"
      }
    ]
  },
  {
    name: "Jupiter",
    nameRu: "Юпитер",
    radius: 69911,
    displayRadius: 18,
    distanceFromSun: 778.5,
    orbitRadius: 210,
    orbitalPeriod: 4333,
    color: "#c8a060",
    description: "Крупнейшая планета. Газовый гигант с Большим Красным Пятном — гигантским штормом.",
    moons: [
      {
        name: "Io",
        nameRu: "Ио",
        radius: 1821,
        orbitalPeriod: 1.77,
        distanceFromPlanet: 422,
        displayDistance: 26,
        displayRadius: 2.5,
        color: "#e8e060"
      },
      {
        name: "Europa",
        nameRu: "Европа",
        radius: 1560,
        orbitalPeriod: 3.55,
        distanceFromPlanet: 671,
        displayDistance: 31,
        displayRadius: 2.2,
        color: "#c8d8e8"
      },
      {
        name: "Ganymede",
        nameRu: "Ганимед",
        radius: 2634,
        orbitalPeriod: 7.15,
        distanceFromPlanet: 1070,
        displayDistance: 37,
        displayRadius: 3,
        color: "#a8a098"
      },
      {
        name: "Callisto",
        nameRu: "Каллисто",
        radius: 2410,
        orbitalPeriod: 16.69,
        distanceFromPlanet: 1883,
        displayDistance: 43,
        displayRadius: 2.8,
        color: "#808080"
      }
    ]
  },
  {
    name: "Saturn",
    nameRu: "Сатурн",
    radius: 58232,
    displayRadius: 15,
    distanceFromSun: 1434,
    orbitRadius: 270,
    orbitalPeriod: 10759,
    color: "#e8d080",
    description: "Знаменита своими кольцами из льда и камней. Плотность меньше воды!",
    moons: [
      {
        name: "Titan",
        nameRu: "Титан",
        radius: 2574,
        orbitalPeriod: 15.95,
        distanceFromPlanet: 1222,
        displayDistance: 30,
        displayRadius: 3,
        color: "#d8a860"
      },
      {
        name: "Enceladus",
        nameRu: "Энцелад",
        radius: 252,
        orbitalPeriod: 1.37,
        distanceFromPlanet: 238,
        displayDistance: 23,
        displayRadius: 1.5,
        color: "#f0f0f0"
      },
      {
        name: "Rhea",
        nameRu: "Рея",
        radius: 764,
        orbitalPeriod: 4.52,
        distanceFromPlanet: 527,
        displayDistance: 26,
        displayRadius: 2,
        color: "#c0c0c0"
      },
      {
        name: "Dione",
        nameRu: "Диона",
        radius: 561,
        orbitalPeriod: 2.74,
        distanceFromPlanet: 377,
        displayDistance: 24,
        displayRadius: 1.8,
        color: "#d0d0d0"
      }
    ]
  },
  {
    name: "Uranus",
    nameRu: "Уран",
    radius: 25362,
    displayRadius: 11,
    distanceFromSun: 2871,
    orbitRadius: 330,
    orbitalPeriod: 30687,
    color: "#7de0e0",
    description: "Ледяной гигант, вращающийся «на боку» — ось наклонена на 98°.",
    moons: [
      {
        name: "Titania",
        nameRu: "Титания",
        radius: 788,
        orbitalPeriod: 8.71,
        distanceFromPlanet: 436,
        displayDistance: 20,
        displayRadius: 2,
        color: "#b0b0b0"
      },
      {
        name: "Oberon",
        nameRu: "Оберон",
        radius: 761,
        orbitalPeriod: 13.46,
        distanceFromPlanet: 584,
        displayDistance: 24,
        displayRadius: 1.8,
        color: "#a0a0a0"
      },
      {
        name: "Miranda",
        nameRu: "Миранда",
        radius: 235,
        orbitalPeriod: 1.41,
        distanceFromPlanet: 129,
        displayDistance: 16,
        displayRadius: 1.2,
        color: "#c8c8c8"
      }
    ]
  },
  {
    name: "Neptune",
    nameRu: "Нептун",
    radius: 24622,
    displayRadius: 10,
    distanceFromSun: 4495,
    orbitRadius: 380,
    orbitalPeriod: 60190,
    color: "#4060e0",
    description: "Самая далёкая планета. Ветры достигают 2100 км/ч — рекорд в Солнечной системе.",
    moons: [
      {
        name: "Triton",
        nameRu: "Тритон",
        radius: 1353,
        orbitalPeriod: 5.88,
        distanceFromPlanet: 355,
        displayDistance: 19,
        displayRadius: 2.2,
        color: "#d0c8b8"
      },
      {
        name: "Proteus",
        nameRu: "Протей",
        radius: 210,
        orbitalPeriod: 1.12,
        distanceFromPlanet: 118,
        displayDistance: 15,
        displayRadius: 1.3,
        color: "#909090"
      }
    ]
  }
];
