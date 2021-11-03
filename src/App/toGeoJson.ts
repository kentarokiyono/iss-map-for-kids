type Geometry = {
  type: string;
  coordinates: number[]
}

type featureProperties = {
  [key: string]: string;
}

type Feature = {
  type: string;
  geometry: Geometry;
  properties: featureProperties
}

type itemObject = {
  [key: string]: any;
}

export type GeoJSON = {
  type: string;
  features: Feature[]
}

const toGeoJson = (data: any) => {
  const geojson = {
    type: "FeatureCollection",
    features: []
  } as GeoJSON

  for (const id in data) {
    const item = data[id] as itemObject

    if (!item['lng'] || !item['lat']) {
      return;
    }

    const feature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [Number(item['lng']), Number(item['lat'])]
      },
      properties: {_id: id}
    } as Feature

    for (let i = 0; i < Object.keys(item).length; i++) {
      const key = Object.keys(item)[i]
      feature.properties[key] = item[key]
    }

    geojson.features.push(feature)
  }

  return geojson
}

export default toGeoJson;
