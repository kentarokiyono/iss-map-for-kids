import React from "react";
import { HashRouter, Route } from "react-router-dom";
import "./App.scss";

import Home from './App/Home'
import List from './App/List'
import AboutUs from './App/AboutUs'

import Tabbar from './App/Tabbar'

import csvParser from 'csv-parse'
import config from './config.json'

const zen2han = (str: string) => {
  return str.replace(/[！-～]/g, function(s: string) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }).replace(/　/g, ' ');
}

const App = () => {
  const [ shopList, setShopList ] = React.useState<Iemeshi.ShopData[]>([])

  React.useEffect(() => {
    const csvUrl = `${window.location.origin}${window.location.pathname}/data.csv`
    fetch(csvUrl)
    .then((response) => {
      return response.ok ? response.text() : Promise.reject(response.status);
    })
    .then((data) => {
      csvParser(data, async (error, data) => {
        if (error) {
          console.log(error)
          setShopList([])
          return
        }

        const [header, ...records] = data;

        const features = records.map((record: string) => {
          const properties = header.reduce((prev: any, column: any) => {
            const value = record[header.indexOf(column)];
            prev[column] = zen2han(value);
            return prev;
          }, {});

          return properties;
        });

        const nextShopList: Iemeshi.ShopData[] = []
        for (let i = 0; i < features.length; i++) {
          const feature = features[i] as Iemeshi.ShopData
          if (!feature['lat'] || !feature['lng']) {
            continue;
          }
          if (!feature['lat'].match(/^[0-9]+(\.[0-9]+)?$/)) {
            continue
          }
          if (!feature['lng'].match(/^[0-9]+(\.[0-9]+)?$/)) {
            continue
          }
          const shop = {
            index: i,
            ...feature
          }

          nextShopList.push(shop)
        }
        setShopList(nextShopList)
      });
    });
  }, [])

  // eslint-disable-next-line
  const PagesRoute = config.menus.map((menu, index) => {
    if(menu.url !== "/" && menu.url !== "/list") {
      return <Route key={index} exact path={`${menu.url}`}><AboutUs data={menu.content} /></Route>
    }
  })

  return (
    <div className="app">
      <div className="app-body">
        <HashRouter>
          <Route exact path="/"><Home data={shopList} /></Route>
          <Route exact path="/list"><List data={shopList} /></Route>
          {PagesRoute}
        </HashRouter>
      </div>
      <div className="app-footer">
        <Tabbar />
      </div>
    </div>
  );
}

export default App;
