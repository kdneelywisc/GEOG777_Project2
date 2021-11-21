require([
    "esri/config",
    "esri/WebMap",
    "esri/layers/FeatureLayer",
    "esri/views/MapView",
    "esri/widgets/Editor",
    "esri/widgets/Expand",
    "esri/widgets/Search",
    "esri/widgets/Locate",
    "esri/widgets/LayerList"
  ], (esriConfig, WebMap, FeatureLayer, MapView, Editor, Expand, Search, Locate, LayerList) => {
    let pointLayer, floodLayerView;
    
          const scenicView = new FeatureLayer({
    portalItem: {
        id: "e4a4389b75de4d9896bc321337e6a897"
    },
      outFields: ["*"]
  });
  const trailHeads = new FeatureLayer({
    portalItem: {
        id: "2fcb62dc9ad24e67bd05c35166731533"
    },
      outFields: ["*"]
  });
    
    // Create a map from the referenced webmap item id
    
    esriConfig.apiKey = "AAPKd37cc5041a3f412ebf0bbc7d12868dd454BSzekDr2S3psvWDf5mwUPisZlcuEg0ZiHzG9YmEUpc-AlV9o4ITuwNNpiLyI2g";
    const webmap = new WebMap({
      portalItem: {
        id: "34362ae16a4f430ba53268f7aa81d4f5"
      },
        layers: [trailHeads, scenicView]
    });

    const view = new MapView({
      container: "viewDiv",
      map: webmap
    });
  // Create the layers
  const parkBoundary = new FeatureLayer({
    portalItem: {
        id: "c5b33d86fc1741b4936b7e64d204c29b"
    }
  });
  const visitorCenter = new FeatureLayer({
    url: "https://services3.arcgis.com/VNV3Cd3le8zQX8yy/arcgis/rest/services/Visitor_center/FeatureServer"
  });
    
/*  const scenicView = new FeatureLayer({
    portalItem: {
        id: "e4a4389b75de4d9896bc321337e6a897"
    },
      outFields: ["*"]
  });
  const trailHeads = new FeatureLayer({
    portalItem: {
        id: "2fcb62dc9ad24e67bd05c35166731533"
    },
      outFields: ["*"]
  });*/
    
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
 * Demo 5: Add/Edit Data
 *
 ******************************************************************/
    
    view.when(() => {
      view.map.loadAll().then(() => {


        // Create layerInfos for layers in Editor. This
        // sets the fields for editing.

        const pointInfos = {
          layer: pointLayer,
          fieldConfig: [
            {
              name: "Conditions",
              label: "Environmental Conditions"
            },
            {
              name: "Description",
              label: "Moose Description"
            }
          ]
        };


        const editor = new Editor({
          view: view,
          //container: document.createElement("div")
          layerInfos: [
            {
              layer: pointLayer,
              fieldConfig: [pointInfos]
            }
          ],
            });
        const editorExpand = new Expand({
            view: view,
            content: editor
        });


        // Add the widgets to top and bottom right of the view
        view.ui.add(editorExpand, "top-left");
      });
    });
    
      view.when(function() {

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
              layer: scenicView,
              searchFields: ["FAC_NAME"],
              displayField: "FAC_NAME",
              exactMatch: false,
              outFields: ["*"],
              name: "Scenic Overlook",
              placeholder: "example: Kelly Lakes",
              zoomScale: 50000
            }              

          ]
        });
      
        // Add the search widget to the top left corner of the view
        view.ui.add(searchWidget, {
          position: "top-right"
        }); 
  });
  /******************************************************************
 *
 * Demo 00. Set up Layer List
 *
 ******************************************************************/     
        const layerlist = new LayerList({
          view: view,
          container: document.createElement("div")
        });


        const lyrExpand = new Expand({
          view: view,
          content: layerlist
        });

        // Add the expand instance to the ui

        view.ui.add(lyrExpand, "top-left");
  /******************************************************************
 *
 * Demo 00. Set up Location
 *
 ******************************************************************/    
    
            const locate = new Locate({
          view: view,
          useHeadingEnabled: false,
          goToOverride: function(view, options) {
            options.target.scale = 1500;
            return view.goTo(options.target);
          }
        });
        view.ui.add(locate, "bottom-right");
          
});

