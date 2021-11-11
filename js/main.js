require([
  "esri/Map",
  "esri/layers/FeatureLayer",
  "esri/views/MapView",
  "esri/PopupTemplate",
  "esri/widgets/Expand",
  "esri/widgets/Search"
], function (Map, FeatureLayer, MapView, PopupTemplate, Expand, Search) {

  let floodLayerView;
  /******************************************************************
   *
   * Popup example
   *
   ******************************************************************/

  // Step 1: Create the template
  const popupTemplate = new PopupTemplate({
    title: "Trailheads: {name}",
    content: [{
        // Specify the type of popup element - fields
        //fieldInfos autocasts
        type: "fields",
        fieldInfos: [{
            fieldName: "type",
            visible: true,
            label: "Type: "
          },
          {
            fieldName: "bathrooms",
            visible: true,
            label: "Bathroom Available: "
          },
                  {
            fieldName: "water",
            visible: true,
            label: "Drinking Water Available: "
          },
                  {
            fieldName: "WINTER_STA",
            visible: true,
            label: "Winter Status: "
          },
        ]
      }]
  });    
  /******************************************************************
   *
   * Add featurelayers to the map example
   *
   ******************************************************************/

  // Create the layers
  const parkBoundary = new FeatureLayer({
    url: "https://services3.arcgis.com/VNV3Cd3le8zQX8yy/arcgis/rest/services/State_Forest_Park_Boundary/FeatureServer"
  });
    
  const visitorCenter = new FeatureLayer({
    url: "https://services3.arcgis.com/VNV3Cd3le8zQX8yy/arcgis/rest/services/Visitor_center/FeatureServer"
  });
    
  const ScenicView = new FeatureLayer({
    url: "https://services3.arcgis.com/VNV3Cd3le8zQX8yy/arcgis/rest/services/Scenic_Overlook/FeatureServer"
  });
    
   const trailHeads = new FeatureLayer({
    url: "https://services3.arcgis.com/VNV3Cd3le8zQX8yy/arcgis/rest/services/Trailheads/FeatureServer",
    popupTemplate: popupTemplate,
    outFields: ["*"]
   });
    
  const parkingLots = new FeatureLayer({
    url: "https://services3.arcgis.com/VNV3Cd3le8zQX8yy/arcgis/rest/services/Parking/FeatureServer"
  });
    
  const drinkingWater = new FeatureLayer({
    url: "https://services3.arcgis.com/VNV3Cd3le8zQX8yy/arcgis/rest/services/Drinking_water/FeatureServer"
  });   
    
  const restrooms = new FeatureLayer({
    url: "https://services3.arcgis.com/VNV3Cd3le8zQX8yy/arcgis/rest/services/Restrooms/FeatureServer"
  });    

  const trails = new FeatureLayer({
    url: "https://services3.arcgis.com/VNV3Cd3le8zQX8yy/arcgis/rest/services/Trails/FeatureServer"
  });     
    
  // 2 - This additional point layer shows time aware data used for the
  //     TimeSlider
  // var vehicleThefts = new FeatureLayer({
  //   url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/ChicagoCrime/FeatureServer/0"
  // });

  // Set map's basemap
  const map = new Map({
    basemap: "topo-vector"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 10,
    center: [-106.010278, 40.511400],
    popup: {
      dockEnabled: true,
      dockOptions: {
        buttonEnabled: false,
        breakpoint: false
      }
    }
  });

  view.when(function() {
    // Add the layer
    //map.add(parkBoundary);
    map.addMany([parkBoundary, visitorCenter, ScenicView, trailHeads, parkingLots, drinkingWater, restrooms, trails]);
  
/******************************************************************
 *
 * Demo 5: Filter data to display
 *
 ******************************************************************/


    const seasonsNodes = document.querySelectorAll('.season-item');
    const seasonsElement = document.getElementById("seasons-filter");

    // click event handler for seasons choices
    seasonsElement.addEventListener("click", filterBySeason);

    // User clicked on Winter, Spring, Summer or Fall
    // set an attribute filter on flood warnings layer view
    // to display the warnings issued in that season
    function filterBySeason(event) {
        const selectedSeason = event.target.getAttribute("data-season");
        floodLayerView.filter = {
            where: "WINTER_STA = '" + selectedSeason + "'"
          };
        }

    view.whenLayerView(trailHeads).then(function (layerView) {
      // Crime data layer is loaded
      // Get a reference to the crime data layerview
      floodLayerView = layerView;

      // Set up the UI items
      seasonsElement.style.visibility = "visible";
      const seasonsExpand = new Expand({
        view: view,
        content: seasonsElement,
        expandIconClass: "esri-icon-filter",
        group: "top-left"
      });

      // Clear the filters when the user closes the expand widget
      seasonsExpand.watch("expanded", function () {
        if (!seasonsExpand.expanded) {
          floodLayerView.filter = null;
        }
      });

      // Add the widget
      view.ui.add(seasonsExpand, "top-left");
    });
  /******************************************************************
 *
 * Demo 00. Set up Search Bar
 *
 ******************************************************************/ 
      const searchWidget = new Search({
          view: view,
          allPlaceholder: "Trail or Scenic Overlook",
          includeDefaultSources: false,
          sources: [
            {
              layer: trailHeads,
              searchFields: ["name"],
              displayField: "name",
              exactMatch: false,
              outFields: ["name", "bathrooms", "water"],
              name: "Trails",
              placeholder: "example: Lake Agnes"
            },
            {
              layer: ScenicView,
              searchFields: ["FAC_NAME"],
              displayField: "FAC_NAME",
              exactMatch: false,
              outFields: ["*"],
              name: "Scenic Overlook",
              placeholder: "example: Kelly Lakes",
              zoomScale: 50000
            }              
/*            {
              layer: ScenicView,
              searchFields: ["FAC_NAME", "CONDITION"],
              suggestionTemplate: "{Name}, Party: {Party}",
              exactMatch: false,
              outFields: ["*"],
              placeholder: "example: Kelly Lake Overlook",
              name: "Scenic Overlook",
              zoomScale: 500000,
              resultSymbol: {
                type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                url: "https://developers.arcgis.com/javascript/latest//sample-code/widgets-search-multiplesource/live/images/senate.png",
                height: 36,
                width: 36
              }
            },
            {
              name: "ArcGIS World Geocoding Service",
              placeholder: "example: Nuuk, GRL",
              apiKey: "YOUR_API_KEY",
              singleLineFieldName: "SingleLine",
              locator: "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer"
            }*/
          ]
        });
      
        // Add the search widget to the top left corner of the view
        view.ui.add(searchWidget, {
          position: "top-right"
        }); 
  });
});
