import * as React from "react"
import { PageProps } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"

// Chilhowee -84.591110, 35.228432
// 42.568466666666666, -77.70881666666666
// -112.16145, 33.084983333333334 AZ
// 6.169066666666667, 43.86986666666667 NY

const MapPage: React.FC<PageProps> = () => {
  React.useEffect(() => {
    const initMap = async () => {
      mapboxgl.accessToken = process.env.GATSBY_MAP_TOKEN
      const map = new mapboxgl.Map({
        container: "map", // container ID
        style: "mapbox://styles/mapbox/satellite-v9", // style URL
        center: [ -112.16145, 33.084983333333334],
        zoom: 10,
        pitch: 0,
        interactive: false,
      })
      map.resize()

      // Wait until map loads
      await map.once("load")

      // Add some 3d terrain
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
        tileSize: 512,
        maxzoom: 14,
      })

      map.setTerrain({
        source: "mapbox-dem",
        exaggeration: 1.5,
      })

      // sky
      map.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 0.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      })

      // Wait until nothing else is loading
      await map.once("idle")

      let isPitchDone = false
      /* Animations */
      const movePitch = () => {
        map.on("moveend", () => {
          if (!isPitchDone) {
            isPitchDone = true
            setTimeout(() => {
              window.requestAnimationFrame(moveBearing)
            }, 500)
          }
        })

        map.easeTo({
          zoom: 17,
          pitch: 70,
          curve: 1,
          duration: 4000,
          easing(t) {
            return t
          },
        })
      }

      movePitch()

      const initialBearing = map.getBearing()
      let lastTime = 0.0
      let animationTime = 0.0

      // rotate view in a circle
      const moveBearing = time => {
        const elapsedTime = (time - lastTime) / 1000.0
        animationTime += elapsedTime
        const rotation = initialBearing + animationTime * 2.0
        map.setBearing(-rotation % 360)
        lastTime = time
        window.requestAnimationFrame(moveBearing)
      }
    }

    initMap()
  }, [])

  return (
    <Layout>
      <Seo title="Map" />
      <div
        style={{
          padding: "2rem",
          margin: "0 auto",
          height: "75vh",
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
