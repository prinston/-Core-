class Camera {

  constructor(coords = GetGameplayCamCoord(), rotation = GetGameplayCamRot()) {
    this.cam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);
    this.activeCam = this.cam;
    this.moveToCam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);
    this.coords = coords;
    this.rot = rotation;
    this.moving = false;
  }

  getCam() {
    return this.cam;
  }

  getCoords() {
    return this.coords;
  }

  setCoords(coords) {
    this.coords = coords;
    SetCamCoord(this.activeCam, ...this.coords);
  }

  setCoords(x, y, z) {
    this.coords = [x,y,z];
    SetCamCoord(this.activeCam, ...this.coords);
  }

  getRotation() {
    return this.rot;
  }

  setRotation(rotation) {
    this.rot = rotation;
    SetCamRot(this.activeCam, ...this.rot, 2);
  }

  setRotation(x, y, z) {
    this.rot = [x,y,z];
    SetCamRot(this.activeCam, ...this.rot, 2);
  }

  isMoving() {
    return this.moving;
  }

  activate() {
    this.active = true;
    SetCamActive(this.activeCam, true);
    RenderScriptCams(true, true, 5000, true, false);
  }

  deactivate() {
    this.active = false;
    SetCamActive(this.activeCam, false);
    RenderScriptCams(false, true, 1000, true, false);
  }

  render() {
    if(this.active) {
      this.moveTo(...this.coords, this.rot, 0);
    }
  }

  moveTo(coords = GetGameplayCamCoord(), rotation = GetGameplayCamRot(), duration = 500, locationEase = 1, rotationEase = 1, finishedCallback = undefined) {
    if(this.active && !this.moving) {
      this.moving = true;
      setTimeout(() => {
        this.moving = false;
        if(finishedCallback != undefined) finishedCallback();
      }, duration);

      if(IsCamActive(this.cam)) { // Use moveToCam
        this.activeCam = this.moveToCam;
        SetCamCoord(this.moveToCam, ...coords);
        SetCamRot(this.moveToCam, ...rotation, 2);
        SetCamActiveWithInterp(this.moveToCam, this.cam, duration, locationEase, rotationEase);
        SetCamActive(this.cam, false);
      } else { // Use cam
        this.activeCam = this.cam;
        SetCamCoord(this.cam, ...coords);
        SetCamRot(this.cam, ...rotation, 2);
        SetCamActiveWithInterp(this.cam, this.moveToCam, duration, locationEase, rotationEase);
        SetCamActive(this.moveToCam, false);
      }
      this.coords = coords;
      this.rotation = rotation;
    }
  }

}

class RadialCamera extends Camera {

    constructor(degree, radius, offset, mod = 0.1) {
      this.cam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);
      this.degree = validateDegree(degree);
      this.radius = radius;
      this.circle = new Circle(radius);
      this.offset = offset;
      this.coords = GetGameplayCamCoord();
      this.rot = GetGameplayCamRot();
      this.currentDegree = this.rot[2];
      this.modulationRate = mod;
      this.active = false;
      this.zoom = 0;
      this.relativePos = [0, 0, 0];
      this.rotationOffset = [0, 0, 0];
    }

    getCam() {
      return this.cam;
    }

    setDegree(deg) {
      this.degree = validateDegree(deg);
    }

    getDegree(deg) {
      return this.degree;
    }

    setRadius(rad) {
      this.radius = rad;
      this.circle.setRadius(rad - ((rad/2)*this.zoom));
    }

    getRadius() {
      return this.radius;
    }

    setZoom(zom) {
      this.zoom = zom;
      this.circle.setRadius(this.radius - ((this.radius/2)*zom));
    }

    getZoom() {
      return this.zoom;
    }

    getFinalRadius() {
      return this.circle.getRadius();
    }

    setOffset(off) {
      this.offset = off;
    }

    setOffset(x, y, z) {
      this.offset = [x, y, z];
    }

    getOffset() {
      return this.offset;
    }

    setRelativePosition(pos) {
      this.relativePos = pos;
    }

    setRelativePosition(x, y, z) {
      this.relativePos = [x, y, z];
    }

    getRelativePosition() {
      return this.relativePos;
    }

    setRotationOffset(off) {
      this.rotationOffset = off;
    }

    setRotationOffset(x, y, z) {
      this.rotationOffset = [x, y, z];
    }

    getRotationOffset() {
      return this.rotationOffset;
    }

    setModulationRate(mod) {
      this.modulationRate = mod;
    }

    getModulationRate() {
       return this.modulationRate;
    }

    getCoords() {
      return this.coords;
    }

    getRotation() {
      return this.rot;
    }

    isActive() {
      return this.active;
    }

    setActive(act) {
      this.active = act;
      SetCamActive(this.cam, act);
      RenderScriptCams(act, false, 0, act, false);
    }

    activate() {
      this.active = true;
      if(!this.active) {
        SetCamActive(this.cam, true);
        RenderScriptCams(true, false, 0, true, false);
        this.active = true;
      }
    }

    deactivate() {
      this.active = false;
      if(this.active) {
        let gc = GetGameplayCamCoord();
        let gr = GetGameplayCamRot();

        if(Math.abs(GetDistanceBetweenCoords(...GetEntityCoords(PlayerPedId()), ...this.coords, true)) < 1) {
          this.active = false;
          SetCamActive(this.cam, false);
          RenderScriptCams(false, false, 0, true, false);
          return;
        }

        this.coords[0] = this.modulatePos(gc[0], this.coords[0]);
        this.coords[1] = this.modulatePos(gc[1], this.coords[1]);
        this.coords[2] = this.modulatePos(gc[2], this.coords[2]);
        this.rot[0] = validateDegree(this.modulateRotation(gr[0], this.rot[0]));
        this.rot[1] = validateDegree(this.modulateRotation(gr[1], this.rot[1]));
        this.rot[2] = validateDegree(this.modulateRotation(gr[2], this.rot[2]));

        SetCamCoord(this.cam, ...this.coords);
        SetCamRot(this.cam, ...this.rot, 2);
      }
    }

    render() {
      if(!this.active) this.activate();
      let wantedPos = this.getWantedPos();

      this.currentDegree = validateDegree(this.modulateRotation(this.degree, this.currentDegree));

      this.coords[0] = this.modulatePos(this.offset[0] + wantedPos.x + this.relativePos[0], this.coords[0]);
      this.coords[1] = this.modulatePos(this.offset[1] + wantedPos.y + this.relativePos[1], this.coords[1]);
      this.coords[2] = this.modulatePos(this.offset[2] + this.relativePos[2], this.coords[2]);
      this.rot[0] = validateDegree(this.modulateRotation(this.rotationOffset[0], this.rot[0]));
      this.rot[1] = validateDegree(this.modulateRotation(this.rotationOffset[1], this.rot[1]));
      this.rot[2] = validateDegree(this.modulateRotation(this.currentDegree + this.rotationOffset[2], this.rot[2]));

      SetCamCoord(this.cam, this.coords[0], this.coords[1], this.coords[2]);
      SetCamRot(this.cam, this.rot[0], this.rot[1], this.rot[2], 2);
    }

    modulatePos(expected, current) {
      let rate = this.modulationRate * 15;
      if(expected < current) {
        current -= rate;
        if(expected >= current) current = expected;
      }
      if(expected > current) {
        current += rate;
        if(expected <= current) current = expected;
      }
      return current;
    }

    modulateRotation(expected, current) {
      let rate = this.modulationRate * 15;
      expected = validateDegree(expected);
      current = validateDegree(current);
      let iv = expected<current?Math.abs((expected+360)-current):Math.abs((current+360)-expected);
      let av = Math.abs(expected-current);
      let cw = true;

      if(iv < av && expected > current) cw = false;
      if(av < iv && current > expected) cw = false;

      if(Math.abs(current - expected) < rate) {
        return expected;
      }

      if(!cw) {
        current -= rate;
        current = validateDegree(current);
      } else {
        current += rate;
        current = validateDegree(current);
      }
      return current;
    }

    getWantedPos() {
      return {
        x: this.circle.posX(this.currentDegree),
        y: this.circle.posY(this.currentDegree),
      }
    }

}
