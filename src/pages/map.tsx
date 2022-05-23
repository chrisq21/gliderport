// If you don't want to use TypeScript you can delete this file!
import * as React from "react"
import { PageProps, Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"

const MapPage: React.FC<PageProps> = () => {
  React.useEffect(() => {
    mapboxgl.accessToken = process.env.GATSBY_MAP_TOKEN
    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [-112.16145, 33.084983333333334],
      zoom: 9,
    })
    map.resize()
  }, [])

  return (
    <Layout>
      <Seo title="Map" />
      <div
        style={{
          padding: "2rem",
          margin: "0 auto",
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
        <div
          id="map"
          style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
        >
          <p>Map</p>
        </div>
      </div>
    </Layout>
  )
}

export default MapPage
