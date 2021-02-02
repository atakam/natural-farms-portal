import React from "react";
import Axios from 'axios';

function initMap(addresses) {
    var mymap = L.map('mapid').setView(addresses[0], 12);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
    }).addTo(mymap);
    
    addresses.forEach((add) => {
        L.marker(add).addTo(mymap);
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
                apiKey: 'Csfp8cowhVtB5fn18cfN4_xKblUvJP2Etmdm0mL9Bxo',
                q: address
            }
            return Axios.get("https://geocode.search.hereapi.com/v1/geocode", {
                params,
            })
            .then((response) => {
                addresses.push([response.data.items[0].position.lat, response.data.items[0].position.lng]);
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
        this.fetchGeocode();
    }

    render() {
        return (
        <div id="mapid" style={{height: '700px'}} />
        )
    }
}
export default MyFancyComponent;