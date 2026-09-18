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
    description: "Самая маленькая и ближайшая к Солнцу планета. Поверхность покрыта кратерами."
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
    description: "Самая горячая планета с плотной атмосферой из углекислого газа."
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
    description: "Наш дом! Единственная известная планета с жизнью и жидкой водой на поверхности."
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
    description: "Красная планета с самой высокой горой в Солнечной системе — Олимп."
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
    description: "Крупнейшая планета. Газовый гигант с Большим Красным Пятном — гигантским штормом."
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
    description: "Знаменита своими кольцами из льда и камней. Плотность меньше воды!"
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
    description: "Ледяной гигант, вращающийся «на боку» — ось наклонена на 98°."
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
    description: "Самая далёкая планета. Ветры достигают 2100 км/ч — рекорд в Солнечной системе."
  }
];
