let config = {
  updateRate: 1000,
  consumption: 0.001,
  smoothAccelerator: true,
  smoothAccelerationCurve: 7.5,
  smoothBrakeCurve: 5.0,
  class: [
    1.0, //Compacts
    1.0, //Sedans
    1.3, //SUVs
    1.0, //Coupes
    1.2, //Muscle
    1.1, //Sports Classics
    1.2, //Sports
    1.5, //Super
    1.5, //Motorcycles
    1.2, //Off-road
    1.0, //Industrial
    1.0, //Utility
    1.25, //Vans
    0.0, //Cycles
    0.75, //Boats
    1.0, //Helicopters
    1.0, //Planes
    1.0, //Service
    0.5, //Emergency
    1.0, //Military
    1.0, //Commercial
    1.0, //Trains
    1.25, //Open-wheel
  ],
  rpm: {
    '0.0': 0.01,
    '0.1': 0.10,
    '0.2': 0.20,
    '0.3': 0.40,
    '0.4': 0.55,
    '0.5': 0.70,
    '0.6': 0.80,
    '0.7': 0.90,
    '0.8': 1.00,
    '0.9': 1.20,
    '1.0': 1.40,
  },
  randomTireBurstPercent: 0.0001,
  failure: {
    torqueEffect: true,
    limp: true,
    limpTorque: 0.20,
    weaponMultiplier: 0.15,
    damage: {
      engine: 10,
      body: 10,
      tank: 65
    },
    degrading: 10,
    degradingThreshold: 750,
    cascading: 8,
    cascadingThreshold: 360,
    safeEngine: 100,
    class: [
      1.0, //Compacts
      1.0, //Sedans
      1.0, //SUVs
      1.0, //Coupes
      1.0, //Muscle
      1.0, //Sports Classics
      1.3, //Sports
      1.3, //Super
      0.25, //Motorcycles
      0.7, //Off-road
      0.25, //Industrial
      1.0, //Utility
      1.0, //Vans
      0.0, //Cycles
      10.5, //Boats
      1.0, //Helicopters
      1.0, //Planes
      1.0, //Service
      0.5, //Emergency
      0.5, //Military
      1.0, //Commercial
      1.0, //Trains
      1.5, //Open-wheel
    ]
  }
}
