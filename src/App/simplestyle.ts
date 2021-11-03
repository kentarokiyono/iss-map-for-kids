// @ts-ignore
import geojsonExtent from '@mapbox/geojson-extent';
import { GeoJSON } from './toGeoJson';

const textColor = '#000000';
const textHaloColor = '#FFFFFF';
const backgroundColor = 'rgba(255, 0, 0, 0.4)';
const strokeColor = '#FFFFFF';

class SimpleStyle {
  json: GeoJSON | undefined;
  map: any;
  options: any;

  constructor(json: GeoJSON | undefined, map:any, options: any) {
    this.json = json;
    this.map = map;

    this.options = {
      cluster: true,
      heatmap: false,
      clusterColor: '#ff0000',
      ...options,
    };
  }

  addTo(map: any) {
    if (!this.json) {
      return
    }
    const features = this.json.features;
    const points = features.filter((feature) => (feature.geometry.type.toLowerCase() === 'point'));

    map.addSource('geolonia-simple-style-points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: points,
      },
      cluster: this.options.cluster,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    this.setPointGeometries(map);
    this.setCluster(map);

    const container = map.getContainer();

    if (!container.dataset || (!container.dataset.lng && !container.dataset.lat)) {
      const bounds = geojsonExtent(this.json);
      map.fitBounds(bounds, {
        duration: 0,
        padding: 30,
      });
    }
  }

  /**
   * Setup point geometries.
   *
   * @param map
   */
  setPointGeometries(map: any) {
    map.addLayer({
      id: 'circle-simple-style-points',
      type: 'circle',
      source: 'geolonia-simple-style-points',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-radius': [
          'case',
          ['==', 'small', ['get', 'marker-size']], 7,
          ['==', 'large', ['get', 'marker-size']], 13,
          9,
        ],
        'circle-color': ['string', ['get', 'marker-color'], backgroundColor],
        'circle-opacity': ['number', ['get', 'fill-opacity'], 0.4],
        'circle-stroke-width': ['number', ['get', 'stroke-width'], 2],
        'circle-stroke-color': ['string', ['get', 'stroke'], strokeColor],
        'circle-stroke-opacity': ['number', ['get', 'stroke-opacity'], 1.0],
      }
    });

    map.addLayer({
      id: 'symbol-simple-style-points',
      type: 'symbol',
      source: 'geolonia-simple-style-points',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'text-color': ['string', ['get', 'text-color'], textColor],
        'text-halo-color': ['string', ['get', 'text-halo-color'], textHaloColor],
        'text-halo-width': 2,
      },
      layout: {
        'icon-image': [
          'case',
          ['==', 'large', ['get', 'marker-size']], ['image', ['concat', ['get', 'marker-symbol'], '-15']],
          ['image', ['concat', ['get', 'marker-symbol'], '-11']],
        ],
        'text-field': ['get', 'title'],
        'text-font': ['Noto Sans Regular'],
        'text-size': 12,
        'text-anchor': 'top',
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-max-width': 12,
        'text-offset': [
          'case',
          ['==', 'small', ['get', 'marker-size']], ['literal', [0, 0.6]],
          ['==', 'large', ['get', 'marker-size']], ['literal', [0, 1.2]],
          ['literal', [0, 0.8]],
        ],
        'text-allow-overlap': false,
        'text-radial-offset': 0.5,
        'text-justify': 'auto'
      }
    });

    map.on('mouseenter', 'circle-simple-style-points', () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'circle-simple-style-points', () => {
      map.getCanvas().style.cursor = ''
    })

    map.on('mouseenter', 'symbol-simple-style-points', () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'symbol-simple-style-points', () => {
      map.getCanvas().style.cursor = ''
    })
  }

  /**
   * Setup cluster markers
   *
   * @param map
   */
  setCluster(map: any) {
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'geolonia-simple-style-points',
      filter: ['has', 'point_count'],
      paint: {
        'circle-radius': 20,
        'circle-color': this.options.clusterColor,
        'circle-opacity': 1.0,
      },
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'geolonia-simple-style-points',
      filter: ['has', 'point_count'],
      paint: {
        'text-color': '#FFFFFF',
      },
      layout: {
        'text-field': '{point_count_abbreviated} 件',
        'text-size': 12,
        'text-font': ['Noto Sans Regular'],
      },
    });

    map.on('click', 'clusters', (e: any) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      map.getSource('geolonia-simple-style-points').getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
        if (err)
          return;

          map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
    });

    map.on('mouseenter', 'clusters', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'clusters', () => {
      map.getCanvas().style.cursor = '';
    });
  }
}

export default SimpleStyle;
