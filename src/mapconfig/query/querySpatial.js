import { WFS, GeoJSON } from "ol/format";
import { intersects } from "ol/format/filter";
export function querySpatial(
  featureNS,
  featurePrefix,
  featureTypes,
  geom,
  url,
  projection = "EPSG:4326"
) {
  let featureRequest = new WFS().writeGetFeature({
    srsName: projection,
    featureNS: featureNS,
    featurePrefix: featurePrefix,
    featureTypes: featureTypes,
    outputFormat: "application/json",
    filter: intersects("the_geom", geom)
  });
  fetch(url, {
    method: "POST",
    body: new XMLSerializer().serializeToString(featureRequest)
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      let features = new GeoJSON().readFeatures(json);
      return features;
    });
}
