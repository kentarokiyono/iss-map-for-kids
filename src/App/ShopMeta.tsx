import React from "react";
import './ShopMeta.scss'

type Props = {
  shop: Iemeshi.ShopData;
}

const Content = (props: Props) => {
  const { shop } = props

  const tableData = Object.entries(shop).filter((data, i) => {
    const key = data[0]
    const value = data[1]
    const excludes = [
      '_id',
      'index',
      'distance',
      'lat',
      'lng',
      'title',
      'description',
      'marker-size',
      'marker-symbol',
      'marker-color',
      'stroke',
      'stroke-width',
      'fill'
    ]
    if (!excludes.includes(key)) {
      return <tr key={i}><th>{key}</th><td>{value}</td></tr>
    } else {
      return false
    }
  })

  return (
    tableData.length !== 0 ? (
      <table className="shop-meta-table">
        <tbody>
          {tableData}
        </tbody>
      </table>
    )
    :
    <></>
  );
};

export default Content;
