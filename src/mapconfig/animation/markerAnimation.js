import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { createMarkerStyle } from "@/mapconfig/addlayer/mapStyle";
import { getVectorContext } from "ol/render";

let carImage = require("@/assets/car.png");

function markerAnimation(map, feature, vectorLayer, val) {
  this.k = null;
  this.speed = val;
  this.map = map;
  this.vectorLayer = vectorLayer;
  this.animation = true;
  this.routeCoords = feature.getGeometry().getCoordinates();
  this.routeLength = this.routeCoords.length;
  this.along = [];
  let distance = 0.02;
  for (let i = 0; i < this.routeLength - 1; ++i) {
    let bPoint = this.routeCoords[i];
    let ePoint = this.routeCoords[i + 1];
    let bevelling = Math.sqrt(
      Math.pow(ePoint[0] - bPoint[0], 2) + Math.pow(ePoint[1] - bPoint[1], 2)
    );
    let cosA = (ePoint[0] - bPoint[0]) / bevelling;
    let sinA = (ePoint[1] - bPoint[1]) / bevelling;

    let curStep = 0;
    this.along.push(new Point([bPoint[0], bPoint[1]]));
    do {
      curStep++;
      let nextPoint;
      if (curStep * distance >= bevelling) {
        nextPoint = new Point([ePoint[0], ePoint[1]]);
      } else {
        nextPoint = new Point([
          cosA * curStep * distance + bPoint[0],
          sinA * curStep * distance + bPoint[1]
        ]);
      }
      this.along.push(nextPoint);
    } while (curStep * distance < bevelling);
  }
  this.coordinatesLen = this.along.length;
  this.init();
}

markerAnimation.prototype.init = function() {
  this.geoMarker = new Feature({
    type: "geoMarker",
    geometry: new Point(this.routeCoords[0])
  });
  this.startMarker = new Feature({
    type: "icon",
    geometry: new Point(this.routeCoords[0])
  });
  this.endMarker = new Feature({
    type: "icon",
    geometry: new Point(this.routeCoords[this.routeLength - 1])
  });
  this.vectorLayer
    .getSource()
    .addFeatures([this.geoMarker, this.startMarker, this.endMarker]);
};

markerAnimation.prototype.startAnimation = function() {
  this.animation = true;
  this.now = new Date().getTime();
  this.geoMarker.setStyle(null);
  this.vectorLayer.on("postrender", this.moveFeature.bind(this));
  this.map.render();
};

markerAnimation.prototype.stopAnimation = function() {
  if (this.vectorLayer === null) {
    return;
  }
  this.animation = false;
  let coord = this.routeCoords[this.routeLength - 1];
  let geometry = this.geoMarker.getGeometry();
  geometry.setCoordinates(coord);
  this.vectorLayer.un("postrender", this.moveFeature.bind(this));
};

markerAnimation.prototype.moveFeature = function(event) {
  let vectorContext = getVectorContext(event);
  let frameState = event.frameState;
  if (this.animation) {
    let elapsedTime = frameState.time - this.now;
    let index = Math.round((this.speed * elapsedTime) / 1000);
    if (index >= this.coordinatesLen) {
      this.stopAnimation();
      return;
    }
    let feature = new Feature(this.along[index]);
    if (index >= 2) {
      let rotation = Math.atan2(
        this.along[index].flatCoordinates[1] -
          this.along[index - 1].flatCoordinates[1],
        this.along[index].flatCoordinates[0] -
          this.along[index - 1].flatCoordinates[0]
      );
      if (rotation > Math.PI / 2) {
        rotation = Math.PI - rotation;
      } else if (rotation < -1 * (Math.PI / 2)) {
        rotation = -1 * Math.PI - rotation;
      } else {
        rotation = -rotation;
      }
      this.k = rotation;
      vectorContext.drawFeature(feature, createMarkerStyle(carImage, this.k));
    }
    this.map.render();
  }
};

export default markerAnimation;
