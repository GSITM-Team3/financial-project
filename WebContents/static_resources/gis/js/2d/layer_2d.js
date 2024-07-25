var vworldMap_2D = new ol.layer.Tile({ title : 'VWorld Gray Map',visible : true, type : 'base',
      source : new ol.source.XYZ({
          url : 'http://xdworld.vworld.kr:8080/2d/Base/service/{z}/{x}/{y}.png' }) });

var vworldMapSatellite_2D = new ol.layer.Tile({title : 'satellite',visible : false,  type : 'base',
      source : new ol.source.XYZ({
          url : 'http://xdworld.vworld.kr:8080/2d/Satellite/service/{z}/{x}/{y}.jpeg' }) });