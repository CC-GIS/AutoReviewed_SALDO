'use strict'; // Attach search control for desktop or mobile
// remove jQuery [future step]

var attachSearch = function attachSearch() {
  var parentName = $(".geocoder-control").parent().attr("id"),
      geocoder = $(".geocoder-control"),
      width = $(window).width();

  if (width < 992 && parentName !== "geocodeMobile") {
    geocoder.detach();
    $("#geocodeMobile").append(geocoder);
  } else if (width >= 992 && parentName !== "geocode") {
    geocoder.detach();
    $("#geocode").append(geocoder);
  }
};
/*** Navigation Modal Windows ***/
// Open Search info window


$("#search-btn").click(function () {
  $('#searchModal').modal('show');
}); // Open About info window

$("#about-btn").click(function () {
  $('#aboutModal').modal('show');
}); // Open Legend info window

$("#legend-btn").click(function () {
  $('#legendModal').modal('show');
}); // Open Discliamer info window

$("#disclaimer-btn").click(function () {
  $('#disclaimerModal').modal('show');
}); // open standard filter window

$("#std-filter-btn").click(function () {
  $('#filterModal').modal('show');
}); // Open filter by year info window

$("#year-filter-btn").click(function () {
  $('#filterYearModal').modal('show');
}); // Open filter by mulitple years info window

$("#multi-year-filter-btn").click(function () {
  $('#filterMultiYearModal').modal('show');
}); // Open municipal zoom info window

$("#final-plan-btn").click(function () {
  $('#filterFinalPlans').modal('show');
});

$("#muni-zoom-btn").click(function () {
  $('#muniZoomModal').modal('show');
}); // reset default value

var resetDefaultOptionElement = function resetDefaultOptionElement(id) {
  // construct selector
  var selector = '#' + id + ' option'; // reset default option

  $(selector).prop('selected', function () {
    return this.defaultSelected;
  });
}; // set filter dates in user interface widget


var setFilterUIWidgetContent = function setFilterUIWidgetContent(startDate, endDate) {
  // start date span
  var startDateSpan = document.getElementById('startDateUI'); // end date span

  var endDateSpan = document.getElementById('endDateUI'); // set values

  startDateSpan.innerHTML = startDate;
  endDateSpan.innerHTML = endDate;
};

var years = ["Select Year", "2019", "2020", "2021"];
var targetIds = ["plansSelectedYear", "plansStartYear", "plansEndYear"];
var date = new Date();
var yearDate = date.getFullYear();
var psuedoDate = 2030; 

function addDates(currentYear, id) {
  console.log(years);
  var intYearStart = parseInt(years[years.length - 1], 10);
  console.log(intYearStart);

  for (var i = intYearStart + 1; i < currentYear; i++) {
    var select = document.getElementById(id);
    var newYear = "<option value=".concat(i.toString(), ">").concat(i, "</option>");
    select.insertAdjacentHTML("beforeend", newYear);
  }
}

function chartVisibility() {
  if($('.chartContainer').css('display') == 'none') {
    // $('.chartContainer').css('display', 'block')
    $(".chartContainer").delay(100).fadeIn();
  } else {
    // $('.chartContainer').css('display', 'none')
    $(".chartContainer").delay(100).fadeOut();
  }
};

for (var i = 0; i < targetIds.length; i++) {
  addDates(yearDate + 1, targetIds[i]);
}
/* Document Ready */


$(document).ready(function () {
  // zoom to muni widget
  $("#selectMuni").on("change", function (e) {
    zoomToMuni($(this).val());
  });
  attachSearch();
  $(window).resize(function () {
    attachSearch();
  });
}); // Set max height of pop-up window

var setPopupMaxHeight = function setPopupMaxHeight(windowArea) {
  var maxHeight;

  if (windowArea < 315000) {
    maxHeight = 150;
  } else {
    maxHeight = 500;
  }

  return maxHeight;
}; // Set max width of pop-up window


var setPopupMaxWidth = function setPopupMaxWidth(windowWidth) {
  var maxWidth;

  if (windowWidth < 450) {
    maxWidth = 240;
  } else {
    maxWidth = 300;
  }

  return maxWidth;
}; // return text for map legend alt text


var returnAltTextForLegend = function returnAltTextForLegend(layerName, layerLabel) {
  var appendText;

  if (layerLabel === "" || layerLabel === " ") {
    appendText = layerName;
  } else {
    appendText = layerLabel;
  }

  var altText = "alt=\"legend icon representing ".concat(appendText, "\"");
  return altText;
}; // create a legend element for a map service


var createMapLegend = function createMapLegend(url, element) {
  // legend plugin uses dynamic map layer object
  var dynamicMapService = L.esri.dynamicMapLayer({
    url: url
  });
  dynamicMapService.legend(function (error, legend) {
    var html = '';

    if (!error) {
      legend.layers.forEach(function (element) {
        html += '<ul>';
        html += "<li><strong>".concat(element.layerName, "</strong></li>");
        element.legend.forEach(function (item) {
          var iconAlt = returnAltTextForLegend(element.layerName, item.label);
          html += L.Util.template('<li><img ' + iconAlt + ' width="{width}" height="{height}" src="data:{contentType};base64,{imageData}"><span>{label}</span></li>', item);
        });
        html += '</ul>';
      });
    } else {
      html += '<h4>There was an error creating the legend</h4>';
    }

    $(element).prepend(html);
  });
}; // return text value from domain


var returnDomainText = function returnDomainText(value) {
  var landUse;

  switch (value) {
    case 1:
      landUse = 'Residential';
      break;

    case 2:
      landUse = 'Lot Addition';
      break;

    case 3:
      landUse = 'Commerical';
      break;

    case 4:
      landUse = 'Industrial';
      break;

    case 5:
      landUse = 'Agriculture';
      break;

    case 6:
      landUse = 'Institutional';
      break;

    default:
      landUse = 'Vacant';
  }

  return landUse;
}; // Convert JSON date format to plain language format


var convertJSONDateToString = function convertJSONDateToString(jsonDate) {
  var shortDate;

  if (jsonDate) {
    var regex = /-?\d+/;
    var matches = regex.exec(jsonDate);
    var dt = new Date(parseInt(matches[0]));
    var month = dt.getMonth() + 1;
    var monthString = month > 9 ? month : '0' + month;
    var day = dt.getDate();
    var dayString = day > 9 ? day : '0' + day;
    var year = dt.getFullYear();
    shortDate = "".concat(monthString, "-").concat(dayString, "-").concat(year);
  }

  return shortDate;
}; // test for null or empty string values


var testforFiedlValues = function testforFiedlValues(field, defaultValue) {
  var returnVal;

  if (field !== null && field !== '') {
    returnVal = field;
  } else {
    returnVal = defaultValue;
  }

  return returnVal;
}; // re-format numbers with commas


var returnNumberWithCommas = function returnNumberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}; //  Basemap Changer


var zoomToMuni = function zoomToMuni(selectedMuni) {
  // where clause
  var whereClause = "MUNI = '".concat(selectedMuni, "'");
  var query = L.esri.query({
    url: 'https://services1.arcgis.com/1Cfo0re3un0w6a30/arcgis/rest/services/Municipal_Boundaries/FeatureServer/0'
  });
  query.where(whereClause).bounds(function (error, latLngBounds, response) {
    if (error) {
      // add message to console
      console.warn('An error with the query request has occured');
      console.warn("Code: ".concat(error.code, "; Message: ").concat(error.message)); // set content of results element
    } else if (response.features < 1) {
      // add message to console
      console.log('No features selected'); // set content of results element
    } else {
      map.fitBounds(latLngBounds);
    }
  }); // close basemap modal

  $('#muniZoomModal').modal('hide');
}; // function to handle load event for map services


var processLoadEvent = function processLoadEvent(service) {
  // service request success event
  service.on('requestsuccess', function (e) {
    // set isLoaded property to true
    service.options.isLoaded = true;
  }); // request error event

  service.on('requesterror', function (e) {
    // if the error url matches the url for the map service, display error messages
    // without this logic, various urls related to the service appear
    if (e.url == service.options.url) {
      // set isLoaded property to false
      service.options.isLoaded = false; // add warning messages to console

      console.warn("Layer failed to load: ".concat(service.options.url));
      console.warn("Code: ".concat(e.code, "; Message: ").concat(e.message)); // close modal window

      $('#layerErrorModal').modal('show');
    }
  });
}; // set definition query for plan submissions layer


var setDateQuery = function setDateQuery(dateStart, dateEnd) {
  var definitionQuery = "DATE >= date '".concat(dateStart, "' AND DATE <= date '").concat(dateEnd, "'");
  return definitionQuery;
};
/*** Date Picker ***/


$(function () {
  // get user selected date from calendar ui
  var getDate = function getDate(element) {
    var date;

    try {
      date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
      date = null;
      $('#dateErrorModal').modal('show');
    }

    return date;
  }; // set date format


  var dateFormat = "mm/dd/yy",
      from = $("#fromDate").datepicker({
    defaultDate: "0",
    changeMonth: true,
    numberOfMonths: 1
  }).on("change", function () {
    to.datepicker("option", "minDate", getDate(this));
  }),
      to = $("#toDate").datepicker({
    defaultDate: "0",
    changeMonth: true,
    numberOfMonths: 1
  }).on("change", function () {
    from.datepicker("option", "maxDate", getDate(this));
  });
});
/*** Variables ***/
// viewport

var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var windowArea = windowWidth * windowHeight; // home coordinates

var homeCoords = [40.15, -77.25];
/*** Map & Controls ***/
// PA State Plane South (ft) projection

var spcPACrs = new L.Proj.CRS('EPSG:2272', '+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs', {
  origin: [-1.192142E8, 1.461669E8],
  resolutions: [260.41666666666663, 86.80555555555556, 43.40277777777778, 20.833333333333332, 10.416666666666666, 6.944444444444444, 4.166666666666666, 2.083333333333333, 1.0416666666666665, 0.5208333333333333]
});
var map = L.map('map', {
  center: homeCoords,
  zoom: 0,
  zoomControl: false,
  crs: spcPACrs,
  minZoom: 0,
  maxZoom: 8
}); // Zoom Home Control

var zoomHomeControl = L.Control.zoomHome({
  position: 'topleft',
  zoomHomeTitle: 'Full map extent',
  homeCoordinates: homeCoords,
  homeZoom: 0
}).addTo(map);

// Full Screen Control

var fullscreenControl = new L.Control.Fullscreen({
  position: 'topleft'
}).addTo(map);

//  

// month and day for start date

var startDate = '01-01-'; // month and day for end date

var endDate = '12-31-'; // get current year to set definition query for Plan Submissions

var currentYear = new Date().getFullYear(); // initial start date

var intialStartDate = startDate + currentYear; // initial end date

var initialEndDate = endDate + currentYear; // definition query for plan submissions layer

var initialWhereClause = setDateQuery(intialStartDate, initialEndDate);
/*** Layers ***/
// 2020 Imagery - cached map service

var imagery2020 = L.esri.tiledMapLayer({
  url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Imagery/Imagery2020/MapServer',
  maxZoom: 8,
  minZoom: 0,
  continuousWorld: true,
  attribution: 'Cumberland County',
  errorTileUrl: '//downloads2.esri.com/support/TechArticles/blank256.png',
  isLoaded: false
}); // Roads & Municipal Boundaries - cached map service

var roadsMunicipality = L.esri.tiledMapLayer({
  url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Property_Assessment/Roads_Municipal_Boundaries/MapServer',
  maxZoom: 8,
  minZoom: 0,
  continuousWorld: true,
  attribution: 'Cumberland County',
  errorTileUrl: '//downloads2.esri.com/support/TechArticles/blank256.png',
  isLoaded: false
}); // Plan Review Features - map service

var landUseTypeArr = []
var landUses = function(feature) {
  landUseTypeArr.push(feature.properties.LANDUSE)
} 

function countDistinct(arr,n)
{
    let hs = new Set();
 
        for(let i = 0; i < n; i++)
        {
            // add all the elements to the HashSet
            hs.add(arr[i]);
        }
         
        // return the size of hashset as
        // it consists of all Unique elements
        return hs.size;    
}

var planSubmissions = L.esri.featureLayer({
  url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/Auto_Reviewed_SALDO_Plans_Public/MapServer/0',
  where: initialWhereClause,
  onEachFeature: function onEachFeature(feature, layer) {
    // console.log(convertJSONDateToString(feature.properties.DATE))
    // console.log(landUseTypeArr)
    // Pop-up control for small screen sizes
    landUseTypeArr.push(feature.properties.LANDUSE)
    if (windowArea < 315000) {
      // Hide leaflet controls when pop-up opens
      layer.on('popupopen', function () {
        $('div.leaflet-top').css('opacity', 0);
        $('div.leaflet-bottom').css('opacity', 0);
      }); // Display Leaflet controls when pop-up closes

      layer.on('popupclose', function () {
        $('div.leaflet-top').css('opacity', 1);
        $('div.leaflet-bottom').css('opacity', 1);
      });
    }
  },
  isLoaded: false
}); // format popup for plan review featres

planSubmissions.bindPopup(function (evt, layer) {
  // reformat date field value
  var jsonDate = evt.feature.properties.DATE;
  var formattedDate = convertJSONDateToString(jsonDate); // reformat land use coded domain value

  var landUseField = evt.feature.properties.LANDUSE;
  var formattedLandUse = returnDomainText(landUseField); // test for null values in square footage field

  var sqFtField = evt.feature.properties.SQFT;
  var sqFtVal = testforFiedlValues(sqFtField, 'N/A'); // if value numeric, re-format

  if (sqFtVal !== 'N/A') {
    sqFtVal = returnNumberWithCommas(sqFtField);
  } // test for null values in units field


  var unitsField = evt.feature.properties.UNITS;
  var unitsVal = testforFiedlValues(unitsField, 'N/A'); // test for null values in pdf plan link field

  var pdfLinkField = evt.feature.properties.PLNLINK;
  var pdfLinkVal = testforFiedlValues(pdfLinkField, 'Plan not available');

  if (pdfLinkVal !== 'Plan not available') {
    pdfLinkVal = "<a target=\"_blank\" rel=\"noopener\" href=\"".concat(pdfLinkField, "\">View Electronic Plan</a>");
  } // return popup content


  var popupContent = '<div class="feat-popup">';
  popupContent += '<h3><span class="gray-text">Plan Name:</span> {NAME}</h3>';
  popupContent += '<ul>';
  popupContent += "<li><span class=\"gray-text\">Land Use:</span> ".concat(formattedLandUse, "</li>");
  popupContent += "<li><span class=\"gray-text\">Date Received:</span> ".concat(formattedDate, "</li>");
  popupContent += "<li><span class=\"gray-text\">Square Footage:</span> ".concat(sqFtVal, "</li>");
  popupContent += "<li><span class=\"gray-text\">Number of Proposed Units:</span> ".concat(unitsVal, "</li>");
  popupContent += "<li><span class=\"gray-text\">Plan & Comments (pdf):</span> ".concat(pdfLinkVal, "</li>");
  popupContent += '</ul>';
  popupContent += '<h4><strong>Description:</strong></h4>';
  popupContent += '<p>{DESCRIPTION}</p>';
  popupContent += '</div>';
  return L.Util.template(popupContent, evt.feature.properties);
}, {
  closeOnClick: true,
  maxHeight: setPopupMaxHeight(windowArea),
  maxWidth: setPopupMaxWidth(windowWidth)
}); // array of map services to run loading function on

var mapServices = [imagery2020, roadsMunicipality, planSubmissions]; // call load/error events function on layers

mapServices.forEach(function (element) {
  return processLoadEvent(element);
}); // add layers to map

mapServices.forEach(function (element) {
  return element.addTo(map);
}); // set UI widget

setFilterUIWidgetContent(intialStartDate, initialEndDate); // Create Map Legend

createMapLegend('https://gis.ccpa.net/arcgiswebadaptor/rest/services/Property_Assessment/Roads_Municipal_Boundaries/MapServer', '#map-legend-content');
createMapLegend('https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/Auto_Reviewed_SALDO_Plans_Public/MapServer', '#map-legend-content'); // filter logic

// console.log(landUseTypeArr)
// console.log(countDistinct(landUseTypeArr, landUseTypeArr.length))

landUseTypeSum = [0, 0, 0, 0, 0, 0, 0, 0]
let getSums = function() {
  landUseTypeSum.length = 0;
  landUseTypeSum = [0, 0, 0, 0, 0, 0, 0, 0]
  
}
planSubmissions.on('load', function() {
  console.log(landUseTypeArr)
  console.log(countDistinct(landUseTypeArr, landUseTypeArr.length))
})


function clearFilter() {
  planSubmissions.setWhere(initialWhereClause); // reset UI widget

  setFilterUIWidgetContent(intialStartDate, initialEndDate); // close modal

  $('#filterModal').modal('hide'); // refresh plan submissions layer on map

  planSubmissions.refresh();
}

// planSubmissions.on("load", function(e, layer) {
//   console.log('hello')
//   // landUses(e)
//   console.log(e)
// })

function setFilter() {
  // beginning date
  var from = $('#fromDate').val(); // ending date

  var to = $('#toDate').val(); // where clause for filter

  var where_clause = "DATE >= date '".concat(from, "' AND DATE <= date '").concat(to, "'"); // apply filter

  planSubmissions.setWhere(where_clause); // get count of features
  // if no features exist, add message
  // call clearFilter()
  // reset UI widget

  setFilterUIWidgetContent(from, to); // close modal

  $('#filterModal').modal('hide'); // refresh plan submissions layer on map

  planSubmissions.refresh();
} // add event listeners


$('#setFilter').click(setFilter);
$('#clearFilter').click(clearFilter); // filter by selected year

$("#plansSelectedYear").on("change", function (e) {
  // user selected year
  var userYear = $(this).val(); // initial date for query

  var userStartDate = startDate + userYear; // end date for query

  var userEndDate = endDate + userYear; // create definition query

  var userQuery = setDateQuery(userStartDate, userEndDate); // apply defitional query

  planSubmissions.setWhere(userQuery); // close panel

  $('#panelSelectByYearFilter').collapse("hide"); // reset default value

  resetDefaultOptionElement('plansSelectedYear'); // reset UI widget

  setFilterUIWidgetContent(userStartDate, userEndDate); // close modal

  $('#filterYearModal').modal('hide'); // refresh plan submissions layer on map

  planSubmissions.refresh();
}); // filter by start and end year

$('#setFilterMultipleYears').on('click', function (e) {
  // start year
  var filterStartYear = $('#plansStartYear').val(); // end year

  var filterEndYear = $('#plansEndYear').val(); // query from date

  var filterFromDate = startDate + filterStartYear; // query end date

  var filterEndDate = endDate + filterEndYear; // construct defintion query

  var where_clause = setDateQuery(filterFromDate, filterEndDate); // apply query

  planSubmissions.setWhere(where_clause); // close panel

  $('#panelSelectByStartEndYearFilter').collapse('hide'); // reset default value

  resetDefaultOptionElement('plansStartYear');
  resetDefaultOptionElement('plansEndYear'); // reset UI widget

  setFilterUIWidgetContent(filterFromDate, filterEndDate); // close modal

  $('#filterMultiYearModal').modal('hide'); // refresh plan submissions layer on map

  planSubmissions.refresh();
}); // CCPA Composite Locatoer

var ccpaProvider = L.esri.Geocoding.geocodeServiceProvider({
  label: 'Street Addresses',
  maxResults: 8,
  attribution: 'Cumberland County',
  url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Locators/Composite_Address_Locator/GeocodeServer'
}); // Feature Layer Provider - Submitted Plans

var featureLayerProvider = L.esri.Geocoding.featureLayerProvider({
  url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/Planning/Reviewed_SALDO_Plans_Public/MapServer/0',
  label: 'Submitted Plans',
  maxResults: 8,
  searchFields: ['NAME'],
  formatSuggestion: function formatSuggestion(feature) {
    return feature.properties.NAME;
  }
});
var addressSearchControl = L.esri.Geocoding.geosearch({
  useMapBounds: false,
  providers: [featureLayerProvider, ccpaProvider],
  placeholder: 'Search by Plan or Street Address',
  title: 'Search Tool',
  expanded: true,
  collapseAfterResult: false,
  zoomToResult: false
}).addTo(map);
/*** Address search results event ***/

addressSearchControl.on('results', function (data) {
  // make sure there is a result
  if (data.results.length > 0) {
    // set map view
    map.setView(data.results[0].latlng, 7); // open pop-up for location

    var popup = L.popup({
      closeOnClick: true
    }).setLatLng(data.results[0].latlng).setContent(data.results[0].text).openOn(map);
  } else {
    // open pop-up with no results message
    var _popup = L.popup({
      closeOnClick: true
    }).setLatLng(map.getCenter()).setContent('No results were found. Please try a different address.').openOn(map);
  } // close search panel


  $('#searchModal').modal('hide');
});
var locateControl = L.control.locate({
  position: "topleft",
  drawCircle: true,
  follow: false,
  setView: true,
  keepCurrentZoomLevel: false,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  iconLoading: "fa fa-spinner fa-spin",
  metric: false,
  onLocationError: function onLocationError(err) {
    alert(err.message);
  },
  onLocationOutsideMapBounds: function onLocationOutsideMapBounds(context) {
    alert(context.options.strings.outsideMapBoundsMsg);
  },
  strings: {
    title: "Find my location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem to be located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);
/*** Remove loading screen after services loaded ***/

const ctx = document.getElementById('barChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Lot Addition', 'Public Semi-Public', 'Industrial', 'Commerical', 'Residential'],
      datasets: [{
        label: 'Plans By Land Use',
        data: [12, 19, 3, 5, 2],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

 const pieCtx = document.getElementById('pieChart')
 var xValues = ["Commerical", "Industrial", "Agricultural", "Public Semipublic"];
 var yValues = [55, 49, 44, 24];
 var barColors = ["red", "green","blue","orange"];

  new Chart(pieCtx, {
    type: "doughnut",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Non-residential Lots Created',
        legend: {
          display: true,
          position: 'right'
        }
      }
    }
  }});

var xyValues = [
    {x:50, y:7},
    {x:60, y:8},
    {x:70, y:8},
    {x:80, y:9},
    {x:90, y:9},
    {x:100, y:9},
    {x:110, y:10},
    {x:120, y:11},
    {x:130, y:14},
    {x:140, y:14},
    {x:150, y:15}
  ];

const horizontalBar = document.getElementById('horizontalBarChat')
new Chart(horizontalBar, {
    type: "scatter",
    data: {
      datasets: [{
        pointRadius: 4,
        pointBackgroundColor: "rgba(0,0,255,1)",
        data: xyValues
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  });


const pieChart2 = document.getElementById('pieChart2_id')
var xValues = [100,200,300,400,500,600,700,800,900,1000];

new Chart(pieChart2, {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
      borderColor: "red",
      fill: false
    },{
      data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
      borderColor: "green",
      fill: false
    },{
      data: [300,700,2000,5000,6000,4000,2000,1000,200,100],
      borderColor: "blue",
      fill: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {display: false}
  }
});


var loadScreenTimer = window.setInterval(function () {
  var backCover = $('#back-cover');
  var imagery2020Loaded = imagery2020.options.isLoaded,
      roadsMuniLoaded = roadsMunicipality.options.isLoaded,
      planReviewLoaded = planSubmissions.options.isLoaded;

  if (imagery2020Loaded && roadsMuniLoaded && planReviewLoaded) {
    // remove loading screen
    window.setTimeout(function () {
      backCover.fadeOut('slow');
    }, 500); // clear timer

    window.clearInterval(loadScreenTimer);
  } else {
    console.log('layers still loading');
  }
}, 1500); // Remove loading screen when warning modal is closed

$('#layerErrorModal').on('hide.bs.modal', function (e) {
  // remove loading screen
  $('#back-cover').fadeOut('slow'); // clear timer

  window.clearInterval(loadScreenTimer);
});
//# sourceMappingURL=app.js.map
