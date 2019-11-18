/* global mapboxgl, d3 */

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhZGxhd2xpcyIsImEiOiJlaERjUmxzIn0.P6X84vnEfttg0TZ7RihW1g';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  customAttribution: '<a href="https://chadlawlis.com">Chad Lawlis</a>'
});

var usBounds = [[-131.497070, 22.093303], [-62.502929, 52.661410]];
map.fitBounds(usBounds);

// log map bounds for fitBounds bbox
// console.log(map.getBounds());

map.on('load', function () {
  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

  // Create custom "zoom to US" control class
  // https://docs.mapbox.com/mapbox-gl-js/api/#icontrol
  class ZoomUsControl {
    onAdd (map) {
      this._map = map;
      this._container = document.createElement('div');
      this._container.id = 'usa-control';
      this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group usa-control';
      this._container.appendChild(document.createElement('button'));
      return this._container;
    }

    onRemove () {
      this._container.parentNode.removeChild(this._container);
      this._map = undefined;
    }
  }

  // Add custom "zoom to US" control to map
  var zoomUsControl = new ZoomUsControl();
  map.addControl(zoomUsControl);

  // Customize "zoom to US" control to display custom icon and fitBounds functionality
  // using same usBounds bounding box from page landing extent above
  var usaControl = document.getElementById('usa-control');
  var usaButton = usaControl.firstElementChild;
  usaButton.id = 'usa';
  usaButton.title = 'Zoom to US';
  usaButton.addEventListener('click', function () {
    map.fitBounds(usBounds);
  });

  // Create region filter elements
  var overlays = document.getElementById('overlays');

  var filterOverlay = document.createElement('div');
  filterOverlay.className = 'map-overlay bottom-left';

  var regionFilter = document.createElement('div');
  regionFilter.id = 'region-filter';

  var filterTitle = document.createElement('div');
  filterTitle.className = 'filter-title';
  filterTitle.innerHTML = 'Filter by Region';

  regionFilter.appendChild(filterTitle);
  filterOverlay.appendChild(regionFilter);
  overlays.appendChild(filterOverlay);

  // Create legend
  var legendOverlay = document.createElement('div');
  legendOverlay.className = 'map-overlay bottom-right';

  var legend = document.createElement('ul');
  legend.id = 'legend';

  legendOverlay.appendChild(legend);
  overlays.appendChild(legendOverlay);

  var legendLabels = ['< $53', '< $71k', '< $95k', '< $132k', '> $198k'];
  var legendColors = ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#b30000'];

  for (var l = 0; l < legendLabels.length; l++) {
    var legendLabel = legendLabels[l];
    var legendColor = legendColors[l];
    var item = document.createElement('li');
    var key = document.createElement('span');
    key.className = 'legend-block';
    key.style.backgroundColor = legendColor;

    var value = document.createElement('span');
    value.innerHTML = legendLabel;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item); // appends to element with id="legend"; shorthand to avoid document.getElementById('legend')
  }

  // Create information panel elements
  var infoPanel = document.getElementById('info-panel');
  infoPanel.className = 'info-panel';

  // Create lightbox for "about" modal
  // https://developer.mozilla.org/en-US/docs/Web/CSS/:target
  var infoLightBox = document.createElement('div');
  infoLightBox.id = 'about';
  infoLightBox.className = 'lightbox';
  var infoLightBoxFigure = document.createElement('figure');
  var infoLightBoxFigureAnchor = document.createElement('a');
  infoLightBoxFigureAnchor.setAttribute('href', '#');
  infoLightBoxFigureAnchor.className = 'close';
  var infoLightBoxFigureCaption = document.createElement('figcaption');
  infoLightBoxFigureCaption.innerHTML = '<h3>About</h3>' +
  '<p>Created by <a href="https://chadlawlis.com" target="_blank">Chad Lawlis</a>.</p>' +
  '<p>This map was inspired by an <a href="https://www.nytimes.com/2019/03/14/realestate/how-much-do-you-need-to-make.html" target="_blank">article</a> from the New York Times, based on a <a href="https://www.hsh.com/finance/mortgage/salary-home-buying-25-cities.html" target="_blank">study</a> from HSH.com.</p>' +
  '<h3>Data</h3>' +
  '<p><b>Median home price</b> is the sales prices of existing single-family homes, by <a href="https://www.census.gov/programs-surveys/metro-micro.html" target="_blank">Census metropolitan statistical area</a>, from the National Association of Realtors (NAR) <a href="https://www.nar.realtor/sites/default/files/documents/metro-home-prices-q4-2018-single-family-2019-02-12.pdf" target="_blank">fourth-quarter 2018</a>.</p>' +
  '<p><b>Monthly payment</b> is calculated using the expected base costs, as described by <a href="https://www.hsh.com/finance/mortgage/salary-home-buying-25-cities.html#how-did-we-come-up-with-these-salaries" target="_blank">HSH.com</a>, after a 20% down payment with a 30-year fixed mortgage.</p>' +
  '<p><b>Salary</b> is then calculated as the annual pre-tax income required to cover these monthly payments.</p>' +
  '<p><b>Affordability Index</b> ranges 1-5, with 1 most affordable and 5 most expensive. It is a custom calculation, inspired by a <a href="https://www.kiplinger.com/tool/real-estate/T010-S003-home-prices-in-100-top-u-s-metro-areas/index.php" target="_blank">report</a> from Kiplinger, using a <a href="https://www.sapling.com/5114529/calculate-affordability" target="_blank">formula</a> from Sapling.</p>' +
  '<p>All other data is either directly or derived from latest available Census data: 2017 ACS 5-year profile for median income and median monthly rent, Vintage 2018 population estimates for total population (from which population density is derived).</p>' +
  '<p>Final map data is available <a href="https://github.com/chadlawlis/affordability/blob/master/assets/data/top50.geojson" target="_blank">here</a>.</p>';

  infoLightBoxFigure.appendChild(infoLightBoxFigureAnchor);
  infoLightBoxFigure.appendChild(infoLightBoxFigureCaption);
  infoLightBox.appendChild(infoLightBoxFigure);
  infoPanel.appendChild(infoLightBox);

  var infoPanelTitle = document.createElement('div');
  infoPanelTitle.className = 'info-panel-title';
  infoPanelTitle.innerHTML = '<h3>How Much Do You Need to Make?</h3>' +
  '<p>To buy a median-priced home in one of the<br>50 largest cities in the United States&nbsp;<a href="#about"><i class="fas fa-question-circle"></i></a></p>'; // "&nbsp;" = non-breaking space
  infoPanel.appendChild(infoPanelTitle);

  var infoPanelContent = document.createElement('div');
  infoPanelContent.className = 'info-panel-content';
  infoPanelContent.innerHTML = '<h2>Click a city to explore</h2>';
  infoPanel.appendChild(infoPanelContent);

  var infoPanelLocal = document.createElement('div');
  infoPanelLocal.className = 'info-panel-local';
  infoPanel.appendChild(infoPanelLocal);

  var infoPanelUs = document.createElement('div');
  infoPanelUs.className = 'info-panel-us';
  infoPanelUs.innerHTML = '<h3>National Comparison</h3><p>Median home price: <b>$257,600</b></p><p>Monthly payment: <b>$1,434</b></p><p>Salary required: <b>$61,454</b></p>';
  infoPanel.appendChild(infoPanelUs);

  // Load the data
  d3.json('assets/data/top50.geojson').then(function (data) {
    // log feature properties
    // console.log(data.features[1].properties);
    // console.log(data.features[1].properties.region_name);

    var layers = map.getStyle().layers;

    // log map style object
    // console.log('map.getStyle(): ', map.getStyle());

    // log layers before adding top50 fill layers
    // i.e., layers from mapbox light-v10
    // console.log('map.getStyle().layers: ', layers);

    // Find the index of the first admin layer in the map style
    var firstLandUseId;
    for (let i = 0; i < layers.length; i++) {
      // If needed, can use regular expression to identify layer with id starting with "admin"
      // (https://stackoverflow.com/a/1315236)
      // -> layers[i].id.match(/landuse.*/)
      if (layers[i].id === 'landuse') {
        firstLandUseId = layers[i].id;

        // log layer id of first landuse layer from map style
        // console.log('firstLandUseId: ', firstLandUseId);

        break;
      }
    }

    map.addSource('top50', {
      type: 'geojson',
      data: data
    });

    data.features.forEach(function (feature) {
      // Only iterate through features with "region" value (excludes "National" record with null value)
      if (feature.properties.region) {
        var regionName = feature.properties.region_name;
        var layerId = regionName;

        // Add layer to the map if it hasn't been added already
        if (!map.getLayer(layerId)) {
          map.addLayer({
            id: layerId,
            type: 'fill',
            source: 'top50',
            paint: {
              'fill-color': [
                'step',
                ['get', 'salary'],
                // Any feature with a "salary" value *above* each step will render that color
                // i.e., fill-color is legendColors[0] (#fef0d9) for features with "salary" value <= 53000
                legendColors[0],
                53000, legendColors[1],
                71000, legendColors[2],
                95000, legendColors[3],
                132000, legendColors[4]
              ],
              'fill-opacity': 1
            },
            filter: ['==', 'region_name', regionName]
          }, firstLandUseId); // place each fill layer before first symbol layer, so symbol layers rendered on top of fill

          // log layers after adding layers (all layers should appear above first layer with type = 'symbol')
          // console.log('map.getStyle().layers after addLayers: ', map.getStyle().layers);

          // Add checkbox and label elements for the layer.
          var row = document.createElement('div');
          row.className = 'region-checkbox';
          var input = document.createElement('input');
          input.type = 'checkbox';
          input.id = layerId;
          input.checked = true;

          var label = document.createElement('label');
          label.setAttribute('for', layerId);
          label.textContent = regionName;

          row.appendChild(input);
          row.appendChild(label);
          regionFilter.appendChild(row);

          // When the checkbox changes, update the visibility of the layer.
          input.addEventListener('change', function (e) {
            map.setLayoutProperty(layerId, 'visibility',
              e.target.checked ? 'visible' : 'none');
          });
        }
      }
    });

    // Create popup, but don't add it to the map yet
    var popup = new mapboxgl.Popup({
      closeButton: false
      // closeOnClick: false
    });

    var regionLayers = ['South', 'West', 'Northeast', 'Midwest'];

    for (var x = 0; x < regionLayers.length; x++) {
      var id = regionLayers[x];

      // When a click event occurs on a feature in the states layer, open a popup at the
      // location of the click, with description HTML from its properties.
      map.on('click', id, function (e) {
        // log clicked feature properties
        // console.log('clicked feature properties: ', e.features[0].properties);

        // Coordinate salary header background color with map legend
        var salary;

        if (e.features[0].properties.salary <= 53000) {
          salary = '<h1 style="background: ' + legendColors[0] + ';">$' + e.features[0].properties.salary.toLocaleString() + '</h1>';
        } else if (e.features[0].properties.salary > 53000 && e.features[0].properties.salary <= 71000) {
          salary = '<h1 style="background: ' + legendColors[1] + ';">$' + e.features[0].properties.salary.toLocaleString() + '</h1>';
        } else if (e.features[0].properties.salary > 71000 && e.features[0].properties.salary <= 95000) {
          salary = '<h1 style="background: ' + legendColors[2] + ';">$' + e.features[0].properties.salary.toLocaleString() + '</h1>';
        } else if (e.features[0].properties.salary > 95000 && e.features[0].properties.salary <= 132000) {
          salary = '<h1 style="background: ' + legendColors[3] + ';">$' + e.features[0].properties.salary.toLocaleString() + '</h1>';
        } else if (e.features[0].properties.salary > 132000) {
          salary = '<h1 style="background: ' + legendColors[4] + ';">$' + e.features[0].properties.salary.toLocaleString() + '</h1>';
        }

        // Populate info-panel-content
        infoPanelContent.innerHTML = salary +
        '<p>To buy a home in:</p>' +
        '<h3>' + e.features[0].properties.name + ', ' + e.features[0].properties.state + '</h3>' +
        '<p>Where the median home price is:</p>' +
        '<h3>$' + e.features[0].properties.home.toLocaleString() + '</h3>' +
        '<p>Requiring a monthly payment of:</p>' +
        '<h3>$' + e.features[0].properties.piti.toLocaleString() + '/mo</h3>' +
        '<p>Affordability Index (1-5):&nbsp;<a href="#about"><i class="fas fa-question-circle"></i></a></p>' +
        '<h3>' + e.features[0].properties.index + '</h3>';

        // Populate info-panel-local
        infoPanelLocal.innerHTML = '<h3>Reality Check</h3>' +
        '<p class="local-city">' + e.features[0].properties.name + ', ' + e.features[0].properties.state + '</p>' +
        '<p>Median annual income: <b>$' + e.features[0].properties.income.toLocaleString() + '</b></p>' +
        '<p>Median monthly rent: <b>$' + e.features[0].properties.rent.toLocaleString() + '</b></p>' +
        '<p>Population density: <b>' + e.features[0].properties.pop_density.toLocaleString() + '/mi<sup>2</sup></b></p>';
      });

      // Change the cursor to a pointer when the mouse is over the states layer.
      map.on('mousemove', id, function (e) {
        map.getCanvas().style.cursor = 'pointer';

        popup.setLngLat(e.lngLat)
          .setHTML('<p><b>' + e.features[0].properties.name + '</b></p><p>$' + e.features[0].properties.salary.toLocaleString() + '</p>')
          .addTo(map);
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', id, function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    }
  });
});
