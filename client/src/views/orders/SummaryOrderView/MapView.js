import React from "react";
import Axios from 'axios';

function initMap(addresses) {
    var mymap = L.map('mapid').setView(addresses[0].coordinates, 12);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
    }).addTo(mymap);
    
    addresses.forEach((add) => {
        L.marker(add.coordinates).addTo(mymap);
        // .setPopup(new L.Popup({ offset: 25 }) // add popups
        // .setHTML('<h3>' + add.user + '</h3>'))
        
    });
}

class MyFancyComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            addresses: props.addresses
        }
    }

    fetchGeocode = async () => {
        const addresses = [];
        const promises = this.state.addresses.map((address) => {
            const params = {
                apiKey: 'cX4Z2BzaQuCueR8IPso10mJOcGlc_GveEO8ui_iMgW4',
                q: address.address
            }
            return Axios.get("https://geocode.search.hereapi.com/v1/geocode", {
                params,
            })
            .then((response) => {
                addresses.push({
                    user: address.user,
                    coordinates: [response.data.items[0].position.lat, response.data.items[0].position.lng]
                });
                return response;
            });
        });
        Promise.all(promises)
        .then(() => {
            initMap(addresses);
        })
        .catch(console.error)
    }

    componentDidMount() {
        const script = document.createElement("script");

        script.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";
        script.integrity = "sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==";
        script.crossOrigin = "";
        script.async = true;
        document.body.appendChild(script);
        
        this.fetchGeocode();
    }

    render() {
        return (
        <div id="mapid" style={{height: '700px'}} />
        )
    }
}
export default MyFancyComponent;