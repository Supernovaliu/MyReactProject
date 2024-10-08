/// src/components/MapWithPopulation.js
import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css'; // Import OpenLayers CSS
import {Map, Overlay, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke, Text } from 'ol/style';
import Papa, {ParseResult} from 'papaparse';
import axios from 'axios';
import 'ol/proj/proj4';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
proj4.defs("EPSG:2193", "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4);
interface PopulationData {
    [key: string]: any;
    area_code: string;
    area_name: string;
    population: number;
}

export default function MapWithPopulation() {
    const mapRef = useRef(null);
    const mapInstance = useRef<any>(null);
    const [geojsonData, setGeojsonData] = useState<any>(null);
    const [populationData, setPopulationData] = useState<PopulationData[]>([]);
    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const popupRef = useRef(null);

    // Step 1: Load population CSV data
    useEffect(() => {
        const loadPopulationData = async () => {
            const csvFilePath = 'http://127.0.0.1:5000/api/geojson/MergedTable.csv';  // Replace with your CSV file path

            // Fetch the CSV file
            const response = await axios.get(csvFilePath);
            const csvText = response.data;

            // Parse CSV data using PapaParse
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                transformHeader: header => header.trim(),
                complete: function (results:ParseResult<PopulationData>) {
                    const parsedData = results.data.map(row => ({
                        ...row,
                        area_code: row["Area_Code"]?.toString().trim() || "Unknown"  // Make sure to trim and convert to string
                    }));
                    setPopulationData(parsedData);

                },
            });
        };

        loadPopulationData();
    }, []);

    // Step 2: Load and display the map's GeoJSON data
    useEffect(() => {
        const loadGeoJSON = async () => {
            const geojsonFilePath = 'http://127.0.0.1:5000/api/geojson/map_auckland.geojson';  // Replace with your GeoJSON file path

            // Fetch GeoJSON file
            const response = await axios.get(geojsonFilePath);
            setGeojsonData(response.data);

        };

        loadGeoJSON();

    }, []);

    // Step 3: Initialize the map and display population data in the map areas
    useEffect(() => {
        if (mapRef.current && geojsonData && populationData.length > 0 && !mapInstance.current) {
            // Create a vector layer for the GeoJSON data
            const vectorLayer = new VectorLayer({
                source: new VectorSource({
                    features: new GeoJSON().readFeatures(geojsonData, {
                        featureProjection: 'EPSG:3857',  // Use Web Mercator projection for OpenLayers
                    }),
                }),

            });
            // Create an overlay for the popups

            const overlay = new Overlay({
                // @ts-ignore
                element: popupRef.current, // You need to have a popup element
                positioning: 'bottom-center',
                stopEvent: false,
                autoPan: true,
            });
            // Initialize the map
            mapInstance.current = new Map({
                target: mapRef.current,
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                    vectorLayer,  // Add the vector layer with the population data
                ],
                view: new View({
                    center: fromLonLat([174.7762, -41.2865]),  // Center on Auckland, NZ
                    zoom: 6,
                }),
                overlays: [overlay],
            });
            // @ts-ignore
            mapInstance.current.on('click', function (e: any) {

                const features = mapInstance.current.getFeaturesAtPixel(e.pixel);

                // Ensure features is an array and contains at least one feature
                if (features && features.length > 0) {
                    const feature = features[0]; // Get the first feature

                    if (feature && typeof feature.get === 'function') {
                        // Extract the area code from the feature
                        const area_code = feature.get('SA12023_V1');
                        const selectedFea = populationData.filter(item => item.area_code === area_code);

                        setSelectedFeature(selectedFea.length > 0 ? selectedFea[0] : null);

                        // Get the coordinate of the clicked point and set the overlay's position
                        const coordinates = mapInstance.current.getCoordinateFromPixel(e.pixel);
                        overlay.setPosition(coordinates); // Correctly setting the overlay position

                    }
                } else {
                    overlay.setPosition(undefined); // Hide the overlay if no feature is clicked
                }
            });





            // Clean up the map on unmount
            return () => mapInstance.current?.setTarget(undefined);
        }
    }, [geojsonData, populationData]);



    return (
        <div>
            <div ref={mapRef} className="map" style={{ width: '100%', height: '600px' }}></div>

            <div id="popup" ref={popupRef} className="ol-popup p-4 shadow-lg rounded-md bg-white">
                <div id="popup-content" className="flex flex-col gap-2">
                    {selectedFeature && (
                        <div className="p-4 bg-amber-50 rounded-md shadow-md">
                            {Object.entries(selectedFeature).map(([key, value]) => (
                                <p key={key} className="flex justify-between">
                                    <strong className="capitalize">{key}:</strong>
                                    <span>{value}</span>
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

