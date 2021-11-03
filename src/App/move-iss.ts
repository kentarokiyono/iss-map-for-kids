// ISS の画像をアニメーション
export const moveISS = (marker:any, mapObject:any) => {
  fetch('https://api.wheretheiss.at/v1/satellites/25544')
    .then(response => response.json())
    .then(data => {
      const coordinates = [data.longitude,data.latitude];
      marker.setLngLat(coordinates).addTo(mapObject);
      mapObject.flyTo({center: coordinates});
    });
  setTimeout(function(){moveISS(marker, mapObject)}, 2000);
}
