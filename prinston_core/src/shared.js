class Circle {

  constructor(radius) {
    this.radius = radius;
  }

  setRadius(newRadius) {
    this.radius = newRadius;
  }

  getRadius() {
    return this.radius;
  }

  posX(degree) {
    return (this.radius * Math.cos((degree * Math.PI) / 180));
  }

  posY(degree) {
    return (this.radius * Math.sin((degree * Math.PI) / 180));
  }

}

class Sphere extends Circle{

  posX(lat, long) {
    return this.radius * (Math.cos((lat * Math.PI) / 180) * Math.sin((long * Math.PI) / 180));
  }

  posY(lat, long) {
    return this.radius * (Math.cos((lat * Math.PI) / 180) * Math.cos((long * Math.PI) / 180));
  }

  posZ(lat) {
    return this.radius * (Math.sin(lat * Math.PI) / 180);
  }

}

on('calculations:circle', (response, radius = 1) => { emit(response, new Circle(radius)); })
exports('circle', (radius = 1) => { return new Circle(radius); });

function determineDegreeOffset(degree, endDegree) {
  let oppDegree = validateDegree(-1 * endDegree);
  let degOff = (endDegree<degree?degree-endDegree:endDegree-degree);
  let oppOff = (oppDegree<degree?degree-oppDegree:oppDegree-degree);
  return (degOff<oppOff?degOff:oppOff);
}

function determineMotion(degree, endDegree) {
  let posDistance = determineDegreeOffset(validateDegree(degree + 45), endDegree);
  let negDistance = determineDegreeOffset(validateDegree(degree - 45), endDegree);
  return (
    determineDegreeOffset(validateDegree(degree + 45), endDegree)
    <
    determineDegreeOffset(validateDegree(degree - 45), endDegree)
    ?1:-1
  );
}

function validateDegree(degree) {
  while(degree >= 360) degree -= 360;
  while(degree < 0) degree += 360;
  return degree;
}

exports('validateDegree', validateDegree);
exports('determineMotion', determineMotion);
exports('determineDegreeOffset', determineDegreeOffset);

function getMonthName(month) {
  switch(month) {
    case 1: return 'January';
    case 2: return 'February';
    case 3: return 'March';
    case 4: return 'April';
    case 5: return 'May';
    case 6: return 'June';
    case 7: return 'July';
    case 8: return 'August';
    case 9: return 'September';
    case 10: return 'October';
    case 11: return 'November';
    default: return 'December';
  }
}

function getDOB(month, day, year) {
  return `${getMonthName(month)} ${day}, ${year}`;
}

let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

function formatMoney(amount) {
  return formatter.format(amount);
}
