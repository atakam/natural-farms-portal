import React from "react";
import Axios from 'axios';
import mbxClient from '@mapbox/mapbox-sdk';
import mbxGeocodeClient from '@mapbox/mapbox-sdk/services/geocoding';

class MyFancyComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            addresses: props.addresses
        }
        this.apiKey = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    }

    fetchGeocode = () => {
        const addresses = [];
        const promises = this.state.addresses.map((address) => {
            const baseClient = mbxClient({ accessToken: this.apiKey });
            const geocodeClient = mbxGeocodeClient(baseClient);

            return geocodeClient.forwardGeocode({
                query: address.address,
                limit: 2
            }).send()
            .then((response) => {
                addresses.push({
                    user: address.user,
                    address: address.address,
                    coordinates: response.body.features[0].geometry.coordinates
                });
                return response;
            });
        });
        Promise.all(promises)
        .then(() => {
            this.initMap(addresses);
        })
        .catch(console.error)
    }

    initMap = (addresses) => {
        mapboxgl.accessToken = this.apiKey;
    
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v10',
            center: addresses[0].coordinates,
            zoom: 10
        });
    
        const features = addresses.map((add) => {
            return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: add.coordinates
                },
                properties: {
                  title: add.user,
                  description: add.address
                }
              };
        });
        const geojson = {
            type: 'FeatureCollection',
            features
        };
    
        // add markers to map
        geojson.features.forEach(function(marker) {
    
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'marker';
        
            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
            .addTo(map);
        });
    }

    componentDidMount() {
        const link1 = document.createElement('link');
        link1.setAttribute('href', 'https://fonts.googleapis.com/css?family=Open+Sans');
        link1.setAttribute('rel', 'stylesheet');
        document.head.appendChild(link1);

        const script = document.createElement("script");
        script.src = "https://api.tiles.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.js";
        document.head.appendChild(script);

        const link2 = document.createElement('link');
        link2.setAttribute('href', 'https://api.tiles.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css');
        link2.setAttribute('rel', 'stylesheet');
        document.head.appendChild(link2);

        this.fetchGeocode();
    }

    render() {
        return (
            <div id="map"/>
        )
    }
}
export default MyFancyComponent;