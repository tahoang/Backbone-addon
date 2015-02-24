/*
Author: Tu Hoang
ESRGC 2014 
CBCA

base map view using backbone.js
element: '.map'
renders map for cbca

*/

app.View.Map = Backbone.View.extend({
  el: '.map-container',
  name: 'MapView',
  events: {},
  selectedLayerName: '',
  selectedLayer: null, //leaflet layer object
  isRendered: false,
  actionHash: '', //for printing and share actions (maintaining state)
  mapData: {

  },
  events: {
    'click #btn-sidebar-close': 'onSidebarBtnClick'
  },
  mapStyle: {
    selected: {
      fillOpacity: 0,
      weight: 1.5,
      color: 'blue'
    },
    unselected: { fillOpacity: 0.6, weight: 0 }
  },
  initialize: function() {
    //this.render();
  },
  render: function(callback) {
    this.makeMap();
    this.loadMapData(callback);
    this.renderControls();
  },
  makeMap: function() {
    var scope = this;
    this.mapViewer = new app.CriticalAreaViewer({
      measureControl: true,
      sidebar: true,
      onMapZoomEnd: function(mapViewer) {
        var map = mapViewer.map;
        var countyLayer = mapViewer.geoJsonFeatures;
        var zoomLvl = map.getZoom();
        if (scope.selectedLayer != null) {
          if (zoomLvl >= 10) {
            map.removeLayer(countyLayer);//county layer
          }
          else {
            map.addLayer(countyLayer);//county layer
          }
        }
      }
    });
    app.getSidebar = function() {
      return scope.mapViewer.sidebarControl;
    };
    //getter for global access
    app.getMapViewer = function() {
      return scope.mapViewer;
    };
  },
  renderControls: function() {
    var scope = this;
    //hover box and zoom to full extend
    this.$('div.leaflet-top.leaflet-left').prepend([
      '<div  class="leaflet-control overlay overlay-text" style="display: block;">',
        '<span id="lbl-county">No county selected.</span>',
      '</div>',
      '<div class="leaflet-control-zoom leaflet-bar leaflet-control" title="Initial extent">',
        '<a id="btn-zoom-to-initial-extent" href="#" class="leaflet-bar">',
          '<i class="fa fa-arrows-alt"/>',
        '</a>',
      '</div>'
    ].join(''));
    this.$('div.leaflet-top.leaflet-left').append([
      '<div class="leaflet-bar leaflet-control" title="Identify">',
        '<a id="btn-identify" href="#">',
          '<i class="fa fa-info"/>',
        '</a>',
      '</div>'
    ].join(''));

    this.$('#btn-identify').on('click', function(e) {
      scope.toggleIdentify();
    });

    this.$('#btn-zoom-to-initial-extent').on('click', function(e) {
      scope.mapViewer.zoomToInitialExtent();
    });
  },
  loadMapData: function(callback) {
    var scope = this;
    var mapViewer = this.mapViewer;
    var model = new Backbone.Model();
    model.url = '../client/json/MDcnty.geojson';
    model.fetch({
      success: function(model, res) {
        var data = model.toJSON();
        scope.geojson = data;//for later processing
        console.log('GeoJson data loaded for County layer');
        scope.addLayer(data);

        scope.isRendered = true;
        //load preset search data here
        //..............TO DO
        if (typeof callback == 'function') {
          callback.call(scope);
        }
      }
    });
  },
  //add geojson layer
  addLayer: function(data) {
    var scope = this;
    var mapViewer = scope.mapViewer;
    mapViewer.addGeoJsonLayer(data, {
      onEachFeature: function(feature, layer) {
        //layer.bindPopup(scope.getMapStatusPopup(feature.properties));
        //on mouse over
        layer.on('mouseover', function(e) {
          var properties = e.target.feature.properties;
          var layerGroup = mapViewer.getGeoJsonGroup();
          layerGroup.setStyle(scope.mapStyle.unselected);
          //set selected style
          e.target.setStyle({
            fillOpacity: .2
          });
          //hi-light selected layer
          if (scope.selectedLayer != null)
            scope.selectedLayer.setStyle(scope.mapStyle.selected);
          var name = properties.COUNTY;
          if (typeof name != 'undefined') {
            scope.updateText(scope.getMapStatusPopup(properties));
          }
          else
            scope.updateText('No county selected.');
          //open popup
          //e.target.openPopup();
        });
        //on mouse out
        layer.on('mouseout', function(e) {
          var properties = e.target.feature.properties;
          var layerGroup = mapViewer.getGeoJsonGroup();
          layerGroup.setStyle(scope.mapStyle.unselected);
          if (scope.selectedLayer != null)
            scope.selectedLayer.setStyle(scope.mapStyle.selected);
          var name = scope.selectedLayerName;
          if (name != '') {
            scope.updateText(scope.getMapStatusPopup(properties));
          }
          else
            scope.updateText('No county selected.');
          //close popup
          //e.target.closePopup();
        });
        //on mouse click select county
        layer.on('click', function(e) {
          var properties = e.target.feature.properties;
          if (scope.selectedLayer == e.target)
            return;
          mapViewer.zoomToDataExtent(e.target);//target is the layer triggered the event
          scope.selectedLayerName = e.target.feature.properties.COUNTY;
          scope.selectedLayer = e.target;
          //reset style for layers
          var layerGroup = mapViewer.getGeoJsonGroup();
          layerGroup.setStyle(scope.mapStyle.unselected);
          //set selected style
          e.target.setStyle(scope.mapStyle.selected);
          //show data for selected layer
          scope.processSelectedLayer();
          var name = scope.selectedLayerName;
          if (name != '') {
            console.log(name);
            scope.updateText(name);
          }

        });

      },
      style: function(feature) {
        var style = { fillColor: "#D4D7D9", weight: 1, fillOpacity: .6, color: 'gray' };
        switch (feature.properties.StatusID) {
          case 0: style.fillColor = "#D4D7D9"; break;
          case 1: style.fillColor = "#ECEC17"; break;
          case 2: style.fillColor = "#9961A8"; break;
          case 3: style.fillColor = "#E3A107"; break;
          case 4: style.fillColor = "#348217"; break;
        }
        return style;
      }
    });
    //add the same layer for boundary
    this.countyBoundary = mapViewer.addCountyBoundary(data);
  },
  //remove geojson layer
  removeLayer: function() {
    var scope = this;
    scope.mapViewer.clearGeoJsonFeatures();
  },
  //select county by name and show cbca service layer
  selectCountyByName: function(name) {
    var scope = this;
    var mapViewer = scope.mapViewer;
    var layerGroup = mapViewer.getGeoJsonGroup();
    var layers = layerGroup.getLayers()[0]._layers;
    for (var i in layers) {
      var layer = layers[i];
      if (layer.feature.properties.COUNTY.toLowerCase() == name.toLocaleLowerCase()) {
        var countyName = layer.feature.properties.COUNTY;
        //zoom to layer
        //mapViewer.zoomToDataExtent(layer);
        //set style
        layerGroup.setStyle(scope.mapStyle.unselected);
        layer.setStyle(scope.mapStyle.selected);
        //store selected layer
        scope.selectedLayer = layer;
        scope.selectedLayerName = countyName;
        //show cbca layer
        scope.processSelectedLayer();
        scope.updateText(countyName);
        break;
      }
    }
  },
  processSelectedLayer: function() {
    var mapViewer = this.mapViewer;
    var layer = this.selectedLayer;
    if (typeof layer == 'undefined') return;
    //process selected layer
    var properties = layer.feature.properties;
    //remove previous dynamic layer if there's any
    mapViewer.removeDynamicLayer();

    //get service url
    var url = properties.ServiceUrl;
    //now show the new layer
    if (url != null)
      mapViewer.addDynamicLayer(properties.COUNTY, url);
    else {
      this.updateText('No data available for this county: ' + properties.COUNTY);
      //print out to status text
    }
  },
  updateText: function(text) {
    this.$('#lbl-county').html(text);
  },
  //query feature using dynamic layer
  identify: function(latlng) {
    var scope = this;
    console.log('Identifying at ' + latlng + '...');

    //do identifying on map
    var map = scope.mapViewer.map;
    var parcelFeatures = scope.mapViewer.parcelFeatures;

    var dlayer = scope.mapViewer.getDynamicLayer();
    if (typeof dlayer == 'undefined') {
      scope.updateText('Please select a county first!');
      return;
    }

    //identify new parcel
    parcelFeatures.clearLayers();//clear previous features
    //marker conetent
    var html = [
      'Identifying... ',
      '<i class="fa fa-circle-o-notch fa-spin">'
    ].join('');
    //place marker
    var marker = L.marker(latlng)
      .addTo(parcelFeatures)
      .bindPopup(html)
      .openPopup();
    //run identify tool
    dlayer.identify()
      .on(map)
      .at(latlng)
      .layers('2')
      .tolerance(1)
      .run(function(error, featureCollection, response) {
        console.log('Response: ');
        console.log(response);
        console.log(featureCollection);
        if (response.results.length > 0) {
          scope.showParcel(featureCollection);
          marker.setPopupContent('Parcel identified! Click/tap on the parcel for details')
        }
        else
          marker.setPopupContent('No parcel found!');
      });
  },
  findAddress: function(address) {
    var scope = this;
    address = address.toUpperCase().trim();

    scope.updateText('Finding address: ' + address + '... <i class="fa fa-spinner fa-spin">');

    address = address.replace(".", " ");
    address = address.replace("  ", " ");
    //convert address suffix
    address = address.replace(" ROAD", " RD");
    address = address.replace(" LANE", " LN");
    address = address.replace(" DRIVE", " DR");
    address = address.replace(" STREET", " ST");
    address = address.replace(" CIRCLE", " CIR");
    address = address.replace(" AVENUE", " AVE");

    console.log('Address: ' + address);

    var map = scope.mapViewer.map;
    var parcelFeatures = scope.mapViewer.parcelFeatures;

    var dlayer = scope.mapViewer.getDynamicLayer();
    if (typeof dlayer == 'undefined') {
      scope.updateText('Please select a county first!');
      return;
    }

    //find new parcel with account id provided
    parcelFeatures.clearLayers();//clear previous features
    dlayer.find()
    .layers('2')
    .text(address)
    .contains(false)//get exact match
    .fields('ADDRESS')
    .run(function(error, featureCollection, response) {
      console.log('Response: ');
      console.log(response);
      console.log(featureCollection);
      if (response.results.length > 0) {
        scope.showParcel(featureCollection, true);
        scope.updateText('Parcel found for Address ' + address + '.');
      }
      else
        scope.updateText('No parcel found! Please try again.');
    });
  },
  findAcctID: function(acctId) {
    var scope = this;
    var accountID = acctId.toLowerCase().trim();
    scope.updateText('Finding accountID: ' + accountID + '... <i class="fa fa-spinner fa-spin">');

    var map = scope.mapViewer.map;
    var parcelFeatures = scope.mapViewer.parcelFeatures;

    var dlayer = scope.mapViewer.getDynamicLayer();
    if (typeof dlayer == 'undefined') {
      scope.updateText('Please select a county first!');
      return;
    }

    //find new parcel with account id provided
    parcelFeatures.clearLayers();//clear previous features
    dlayer.find()
    .layers('2')
    .text(accountID)
    .contains(false)//get exact match
    .fields('ACCTID')
    .run(function(error, featureCollection, response) {
      console.log('Response: ');
      console.log(response);
      console.log(featureCollection);
      if (response.results.length > 0) {
        scope.showParcel(featureCollection, true);
        scope.updateText('Parcel found for Account ID ' + accountID + '.');
      }
      else
        scope.updateText('No parcel found! Please try again.');
    });
  },
  findTaxID: function(map, parcelNo) {
    var scope = this;
    var mapID = map.toLowerCase().trim();
    parcelNo = parcelNo.toLowerCase().trim();
    scope.updateText('Finding parcel...<i class="fa fa-spinner fa-spin">');

    var map = scope.mapViewer.map;
    var parcelFeatures = scope.mapViewer.parcelFeatures;

    var dlayer = scope.mapViewer.getDynamicLayer();
    if (typeof dlayer == 'undefined') {
      scope.updateText('Please select a county first!');
      return;
    }

    //find new parcel with account id provided
    parcelFeatures.clearLayers();//clear previous features
    dlayer.find()
    .layers('2')
    .text(mapID)
    .contains(false)//get exact match
    .fields(['Map'])
    .run(function(error, featureCollection, response) {
      console.log('Response: ');
      console.log('Features with MAP ID ' + mapID);
      console.log(featureCollection);
      //if found map id save the collection
      if (response.results.length > 0) {
        //loop through and find the ones with parcel ID
        var newFeatures = [];
        _.each(featureCollection.features, function(feature) {
          if (feature.properties.PARCEL == parcelNo)
            newFeatures.push(feature);
        });

        //finally set new feature collection 
        if (newFeatures.length > 0) {
          featureCollection.features = newFeatures;
          console.log('Features with MAP ID ' + mapID + ' and PARCEL number ' + parcelNo);
          console.log(featureCollection);//show new collection
          scope.showParcel(featureCollection, true);
          scope.updateText('Parcel(s) found for Map ID ' + mapID + ' and Parcel # ' + parcelNo);
        }
        else
          scope.updateText('No parcel found! Please try again.');
        //dlayer.find()
        //.layers('2')
        //.text(parcelNo)
        //.contains(false)
        //.fields('PARCEL')
        //.run(function(error, featureCollection, response) {
        //  console.log(featureCollection);
        //  if (response.results.length > 0) {
        //    var parcelCollection = featureCollection;
        //    //find intersection of 2 collections

        //  }
        //  else
        //    scope.updateText('No parcel found! Please try again.');
        //});
      }
      else
        scope.updateText('No parcel found! Please try again.');
    });
    //if (response.results.length > 0) {
    //  scope.showParcel(featureCollection, true);
    //  scope.updateText('Parcel found for Map ID ' + mapID + ' and Parcel # ' + parcelNo);
    //}
    //else
    //  scope.updateText('No parcel found! Please try again.');
  },
  showParcel: function(geoJson, openPopup) {
    var scope = this;
    var mapViewer = scope.mapViewer;

    mapViewer.parcelFeatures.addLayer(L.geoJson(geoJson, {
      onEachFeature: function(feature, layer) {
        var template = scope.generatePopup(feature.properties);
        layer.bindPopup(template);
      },
      style: {
        fillOpacity: 0,
        weight: 8,
        color: 'lime'
      }
    }));
    //zoom to data
    mapViewer.zoomToDataExtent(mapViewer.parcelFeatures);
    if (openPopup)
      mapViewer.parcelFeatures.openPopup();
  },
  toggleIdentify: function() {
    var scope = this;
    var identifyFn = function(e) {
      if (scope.selectedLayer == null) {
        alert('Please select a county first!');
        scope.updateText('Please select a county first!');
      }
      else {
        scope.identify(e.latlng);
        //update path
        var path = 'identify/' + scope.selectedLayerName + '/' + e.latlng.lat + '/' + e.latlng.lng;
        var router = app.getRouter('Main');
        router.navigate(path, { trigger: false });
        scope.actionHash = path;
        //update email link
        app.getView('Share').updateEmailLink(path);
      }
      scope.toggleIdentify();
    };
    var target = this.$('#btn-identify');

    if (target.hasClass('control-on')) {//deactivate
      target.removeClass('control-on');
      //scope.$('#map').css('cursor', 'auto');//set map cursors
      //this layer is added in addLayer()
      scope.countyBoundary.clearAllEventListeners();
      scope.countyBoundary.bringToBack();
      //enable measure control
      console.log('Identify off!')
    }
    else {//activate
      target.addClass('control-on');
      scope.countyBoundary.bringToFront();
      //scope.$('#map').css('cursor', 'crosshair');//identify curosor
      scope.countyBoundary.on('click', identifyFn);
      //disable measure control
      console.log('Identify on!')
    }
  },
  generatePopup: function(attributes) {
    console.log(attributes);
    var determination = '';
    if (attributes.ACCTID == '') {
      return 'Not a valid parcel';
    }
    if (attributes.Contained == '1') {
      determination = 'Completely inside critical area'
    }
    else if (attributes.ContainedP > 0) {
      determination = 'Partially inside critical area ('
          + (attributes.ContainedP * 100).toFixed(3) + ' %)';
    }
    else if (attributes.Dist > 0) {
      if (attributes.Dist >= 1000)
        determination = 'Outside critical area (greater than 1000 ft. away)';
      else
        determination = 'Outside critical area ('
            + parseFloat(attributes.Dist).toFixed(2) + ' ft. away)';
    }
    //put new determination to attributes to generate template
    attributes.Determination = determination;

    var template = _.template($('#parcel-popup').html(), { model: attributes });
    return template;
  },
  getMapStatusPopup: function(attributes) {
    var status = '';
    switch (attributes.StatusID) {
      case 0:
        status = 'Unavailable';
        break;
      case 1:
        status = 'Initiated';
        break;
      case 2:
        status = 'Working draft';
        break;
      case 3:
        status = 'Summary draft';
        break;
      case 4:
        status = 'Final approved';
        break;
    }
    attributes.status = status;
    var template = _.template($('#map-status-popup').html(), attributes);
    return template;
  },
  onSidebarBtnClick: function(e) {
    var sb = app.getSidebar();
    sb.close();
  }



});