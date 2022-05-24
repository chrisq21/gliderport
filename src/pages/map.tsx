import * as React from "react"
import { PageProps } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"

// Chilhowee -84.591110, 35.228432
// 42.568466666666666, -77.70881666666666
// -112.16145, 33.084983333333334 AZ`
// 6.169066666666667, 43.86986666666667 NY

let tourIndex = 0
let map
let shouldRotate = false

const MapPage: React.FC<PageProps> = () => {
  const [tourIndex, setTourIndex] = React.useState(0)
  const [mapLoaded, setMapLoaded] = React.useState(false)

  React.useEffect(() => {
    const initTourMap = async () => {
      mapboxgl.accessToken = process.env.GATSBY_MAP_TOKEN
      map = new mapboxgl.Map({
        container: "tourMap", // container ID
        style: "mapbox://styles/mapbox/satellite-v9", // style URL
        center: [-112.16145, 33.084983333333334],
        zoom: 13,
        pitch: 80,
        interactive: true,
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
      setMapLoaded(true)
    }

    const initNearbyMap = async () => {
      mapboxgl.accessToken = process.env.GATSBY_MAP_TOKEN
      const nearbyMap = new mapboxgl.Map({
        container: "nearbyMap", // container ID
        style: "mapbox://styles/mapbox/streets-v11", // style URL
        center: [-112.16145, 33.084983333333334],
        zoom: 13,
        interactive: true,
      })
      nearbyMap.resize()
    }

    initTourMap()
    initNearbyMap()
  }, [])

  const showcaseStep = () => {
    map.easeTo({
      zoom: 16,
      pitch: 70,
      curve: 1,
      duration: 3000,
      easing(t) {
        return t
      },
    })
  }

  const ridgeStep = () => {
    map.easeTo({
      center: [-112.16146, 33.084983333333334],
      zoom: 15,
      pitch: 90,
      bearing: -30,
      curve: 1,
      duration: 3000,
      easing(t) {
        return t
      },
    })
  }

  const nearbyStep = () => {
    map.easeTo({
      zoom: 10,
      pitch: 0,
      curve: 1,
      duration: 3000,
      easing(t) {
        return t
      },
    })
  }

  React.useEffect(() => {
    if (mapLoaded) {
      switch (true) {
        case tourIndex === 0:
          shouldRotate = true
          showcaseStep()
          break
        case tourIndex === 1:
          ridgeStep()
          break
        case tourIndex === 2:
          nearbyStep()
          break
        default:
          break
      }
    }
  }, [tourIndex, mapLoaded])

  const handleTourClick = () => {
    if (tourIndex >= 2) {
      setTourIndex(0)
    } else {
      setTourIndex(tourIndex + 1)
    }
  }

  const handleFreeRoamClick = () => {
    map.interactive = true
  }

  return (
    <Layout>
      <Seo title="Map" />
      <button onClick={handleTourClick}>Next</button>
      <button onClick={handleFreeRoamClick}>Interactive</button>

      <h2>Arizona Soaring Gliderport</h2>
      <div
        style={{
          padding: "2rem",
          margin: "0 auto",
          height: "75vh",
          width: "100%",
          position: "relative",
          boxShadow: "#919191 38px 9px 23px",
        }}
      >
        <div
          id="tourMap"
          style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
        >
          <p>Map</p>
        </div>
      </div>

      <h2>What's Nearby?</h2>
      <div
        style={{
          padding: "2rem",
          margin: "0 auto",
          height: "75vh",
          width: "100%",
          position: "relative",
          boxShadow: "#919191 38px 9px 23px",
        }}
      >
        <div
          id="nearbyMap"
          style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
        >
          <p>Map</p>
        </div>
      </div>
    </Layout>
  )
}

export default MapPage
