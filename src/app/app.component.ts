import { Component } from '@angular/core';
import * as Leaflet from 'leaflet';
import * as geojson from 'geojson';
import shp from 'shpjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];

  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 10,
    center: { lat: -3.1190, lng: -60.0217 }
  }

  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: -3.1190, lng: -60.0217 },
        draggable: true
      },
      {
        position: { lat: 28.625293, lng: 79.817926 },
        draggable: false
      },
      {
        position: { lat: 28.625182, lng: 79.81464 },
        draggable: true
      }
    ];
    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
      this.map.panTo(data.position);
      this.markers.push(marker)
    }
  }

  initGeoJson() {
    let features = [{
        "type": "Feature",
        "properties": {"party": "Republican"},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-104.05, 48.99],
                [-97.22,  48.98],
                [-96.58,  45.94],
                [-104.03, 45.94],
                [-104.05, 48.99]
            ]]
        }
    }, {
        "type": "Feature",
        "properties": {"party": "Democrat"},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-109.05, 41.00],
                [-102.06, 40.99],
                [-102.03, 36.99],
                [-109.04, 36.99],
                [-109.05, 41.00]
            ]]
        }
    }];


    let feature;

    const geo = Leaflet.geoJson(feature, { onEachFeature: function popUp(f, l) {
        const out = [];
        if (f.properties) {
            for (const key of Object.keys(f.properties)) {
                out.push(key + ' : ' + f.properties[key]);
            }
            l.bindPopup(out.join('<br />'));
        }
    }}).addTo(this.map);

    // const geo = Leaflet.geoJson(feature).addTo(this.map);

    const base = '/src/assets/indigenous_area_legal_amazon.zip';
    
    shp(base).then(function(data) {
        geo.addData(data);
    });
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }



  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    
    this.initGeoJson();
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  } 
}
