declare namespace Iemeshi {
  type ShopData = {
    index: number;
    distance?: number;
    'title': string;
    'lat': string;
    'lng': string;
    'description': string;
    'marker-size': string;
    'marker-color': string;
    'stroke': string;
    'stroke-width': string;
  }

  type LngLat = [number, number]
}
