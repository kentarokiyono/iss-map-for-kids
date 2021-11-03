import React from "react";
// @ts-ignore
import geojsonExtent from '@mapbox/geojson-extent'
import toGeoJson from './toGeoJson'
import Shop from './Shop'
import SimpleStyle from './simplestyle';
import { moveISS } from './move-iss'
import config from '../config.json'

type Props = {
  data: Iemeshi.ShopData[];
};

const CSS: React.CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
}

const Content = (props: Props) => {
  const mapNode = React.useRef<HTMLDivElement>(null);
  const [ mapObject, setMapObject ] = React.useState<any>()
  const [ shop, setShop ] = React.useState<Iemeshi.ShopData | undefined>(undefined)

  React.useEffect(() => {
    if (!mapObject || !props.data) {
      return
    }

    // nothing to do if shops exists.
    if (mapObject.getSource('shops')) {
      return
    }

    const geojson = toGeoJson(props.data)

    new SimpleStyle(geojson, mapObject, {
      cluster: (true),
      clusterColor: config.markers.clusterColor,
    }).addTo(mapObject);

    mapObject.on('click', 'circle-simple-style-points', (event: any) => {
      if (!event.features[0].properties.cluster) {
        setShop(event.features[0].properties)
      }
    })

    mapObject.on('click', 'symbol-simple-style-points', (event: any) => {
      if (!event.features[0].properties.cluster) {
        setShop(event.features[0].properties)
      }
    })

  }, [mapObject, props.data])

  React.useEffect(() => {
    // Only once reder the map.
    if (!mapNode.current || mapObject || props.data.length === 0) {
      return
    }

    // @ts-ignore
    const { geolonia } = window;

    const style = 'geolonia/gsi'

    const geojson = toGeoJson(props.data)
    const bounds = geojsonExtent(geojson)

    const container:HTMLImageElement|null = document.querySelector('#iss');

    if (!container) {
      return
    }

    const marker = new geolonia.Marker({
      element: container,
      offset: [-3,-28],
    })

    const map = new geolonia.Map({
      container: mapNode.current,
      style: style,
      bounds: bounds,
      fitBoundsOptions: {padding: 50}
    });

    const onMapLoad = () => {
      map.setLayoutProperty('poi', 'visibility', 'none')
      map.setLayoutProperty('poi-primary', 'visibility', 'none')
      moveISS(marker, map);
      setMapObject(map)
      container.style.display = 'block';
    }

    const orienteationchangeHandler = () => {
      map.resize()
    }

    // attach
    map.on('load', onMapLoad)

    window.addEventListener('orientationchange', orienteationchangeHandler)

    return () => {
      // detach to prevent memory leak
      window.removeEventListener('orientationchange', orienteationchangeHandler)
      map.off('load', onMapLoad)
    }
  }, [mapNode, mapObject, props.data])

  const closeHandler = () => {
    setShop(undefined)
  }

  return (
    <div style={CSS}>
      <div
        ref={mapNode}
        style={CSS}
        data-geolocate-control="on"
        data-marker="off"
        data-gesture-handling="off"
      ></div>
      {shop?
        <Shop shop={shop} close={closeHandler} />
        :
        <></>
      }
    </div>
  );
};

export default Content;
