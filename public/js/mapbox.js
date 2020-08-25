/* eslint-disable */
console.log('Hello from chrome!');


export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYnJhaGltYWthciIsImEiOiJjazkwZWV5MTQwMHJtM2VsZG1mMXFmbjFkIn0.Z9ywdCfnG_M734c9bfdt-Q';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: false
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'center'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(
        `<p style="background-color:orange;color:white">Day ${loc.day}: ${loc.description}</p>`
      )
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });

  document.getElementsByClassName('mapboxgl-ctrl-logo')[0].style.display =
    'none';
};
