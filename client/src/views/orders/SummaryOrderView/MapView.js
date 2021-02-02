import React from "react";

function initMap(addresses) {
    var mymap = L.map('mapid').setView(addresses[0], 13);

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
            fetch('http://api.positionstack.com/v1/forward'
                +'?access_key=d324ff0da1ed4708136227639de090d3'
                + '&query=' + address, {
                headers: {
                'Content-Type': 'application/json',
                }
            }).then((response) => {
                addresses.push([response.data[0].latitude, response.data[0].longitude]);
            })
        });
        Promise.all(promises)
        .then(() => {
            initMap(addresses);
        })
        .catch(console.error)
    }

    componentDidMount() {
        this.fetchGeocode();
        initMap();
    }

    render() {
        return (
        <div id="mapid" style={{height: '700px'}} />
        )
    }
}
export default MyFancyComponent;