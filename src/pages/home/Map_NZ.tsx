import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';
import axios from 'axios';
import 'ol/proj/proj4';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import Papa from "papaparse";
import OSM from "ol/source/OSM";
import {Simulate} from "react-dom/test-utils";
import loadedData = Simulate.loadedData;
proj4.defs("EPSG:2193", "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4);

interface PopulationData {
    area_code: string;
    median_income: string;
}

interface PopulationDataMap {
    [key: string]: PopulationData;
}

export default function MapComponent() {
    const mapRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [populationData, setPopulationData] = useState<PopulationDataMap>({});
    const mapInstanceRef = useRef<Map | null>(null);
    const [geojsonData, setGeojsonData] = useState<any>(null);
    useEffect(() => {
        async function fetchData() {
            if (!mapRef.current) return;

            try {
                const csvResponse = await axios.get('http://127.0.0.1:5000/api/geojson/2018_population_age.csv');

                Papa.parse<PopulationData>(csvResponse.data, {
                    header: true,
                    complete: (results) => {
                        const data = results.data.reduce<PopulationDataMap>((acc, current: any) => {
                            if (current['Area_Code'] && current['Median age']) {
                                acc[current['Area_Code']] = {
                                    area_code: current['Area_Code'],
                                    median_income: current['Median age'],
                                };
                            }
                            return acc;
                        }, {});
                        console.log("Parsed Population Data: ", data);
                        setPopulationData(data);
                    }
                });

                const geoJsonResponse = await axios.get('http://127.0.0.1:5000/api/geojson/map_auckland.geojson');

                setGeojsonData(geoJsonResponse.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }

        fetchData();
    }, []); // Only run on mount

    useEffect(() => {
        const vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(geojsonData, {
                featureProjection: 'EPSG:3857',
            }),
        });
        const vectorLayer = new VectorLayer({ source: vectorSource });

        if (mapInstanceRef.current) {
            // @ts-ignore
            mapInstanceRef.current.setTarget(null);
        }


        const map = new Map({
            // @ts-ignore
            target: mapRef.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                vectorLayer
            ],
            view: new View({
                center: fromLonLat([174.7762, -41.2865]),
                zoom: 6,
            }),
        });

        mapInstanceRef.current = map;
        if (mapInstanceRef.current) {
            console.log("Population Data is available: ", populationData);
            // Add click event listener after population data is available
            mapInstanceRef.current.on('click', (evt) => {
                console.log("Map clicked, Population Data: ", populationData);
                mapInstanceRef.current!.forEachFeatureAtPixel(evt.pixel, (feature) => {
                    const area_code = feature.get('SA12023_V1');
                    console.log("Feature clicked, Area Code: ", area_code);
                    if (area_code && populationData[area_code]) {
                        const data = populationData[area_code];
                        if (overlayRef.current) {
                            overlayRef.current.innerHTML = `<h1>Area Code: ${data.area_code}</h1><p>Median Income: ${data.median_income}</p>`;
                            overlayRef.current.style.display = 'block';
                            const [x, y] = evt.pixel;
                            overlayRef.current.style.left = `${x}px`;
                            overlayRef.current.style.top = `${y}px`;
                        }
                    } else {
                        console.log("No data found for the clicked area.");
                    }
                    return true;
                });
            });
        }
    }, []); // Run when populationData changes

    return (
        <div style={{ position: 'relative' }}>
            <div ref={mapRef} className="map" style={{ width: '100%', height: '600px' }}></div>
            <div ref={overlayRef} className="overlay" style={{ display: 'none', position: 'absolute', background: 'white', padding: '10px', pointerEvents: 'none', transform: 'translate(-50%, -100%)' }}>
                {/* Content is dynamically inserted here */}
            </div>
        </div>
    );
}

