import { map } from "./index.js";

// 绑定图层事件
bondLayers(map)





// ————————————————————————————————————函数
// 绑定图层事件
function bondLayers(map) {


    // 绑定兴趣点
    var addPoi = false
    $('#poiLayer input:radio[name="poiInput"]').click(function () {

        if (addPoi) {



            return
        }

        if ($('#poiLayer input:radio[name="poiInput"]').prop("checked")) {

            addPoi = true

            // 选中后
            console.log(map._displayOptions.poi = true)
            map.setZoom(9)

        }

    });

    //绑定交通页面
    var addJiaotong = false
    $('#jiaotongLayer input:radio[name="jiaotong"]').click(function () {


        if (addJiaotong) {
            map.setTrafficOff();
            $('#jiaotongLayer input:radio[name="jiaotong"]').attr("checked", false);
            addJiaotong = false
            return
        }

        if ($('#jiaotongLayer input:radio[name="jiaotong"]').prop("checked")) {

            addJiaotong = true
            map.setTrafficOn();
        }

    });


    // 绑定geojson
    addGeoJsonFunc(map)


    // 绑定wms图层
    wmsBond(map) 



    // 绑定geojson
    function addGeoJsonFunc(map) {
        //绑定geojsond页面
        var addGeojson = false

        var bjRegionLayer;

        $('#geojsonLayer input:radio[name="geojsonData"]').click(function () {


            if (addGeojson) {
                $('#geojsonLayer input:radio[name="geojsonData"]').attr("checked", false);
                addGeojson = false


                // 按钮取消，执行


                bjRegionLayer && map.removeGeoJSONLayer(bjRegionLayer);
                map.removeOverlay(label);

                return
            }

            if ($('#geojsonLayer input:radio[name="geojsonData"]').prop("checked")) {

                addGeojson = true

                // 按钮选中，执行
                //宝鸡市的geojson数据
                $.ajax({
                    type: "GET",
                    url: "https://geo.datav.aliyun.com/areas_v3/bound/610300_full.json",
                    dataType: 'json',
                    success: (data) => {
                        console.log(data);

                        addGeoLayer1(data)


                    }
                })

            }


            // 添加宝鸡图层
            function addGeoLayer1(data) {
                //   let myPolygonStyle = {
                //     strokeColor: 'darkred',
                //     strokeWeight: 4,
                //     fillOpacity: 0.6
                //   }

                //     let geoJsonSetting = {
                //         dataSource: data,
                //         reference: "GCJ02",
                //         polygonStyle: myPolygonStyle,
                //         minZoom: 7,        
                //         maxZoom:19,         
                //         level: -10,
                //         visible: true
                //     }

                //     //构建图层,地图展示
                //     let geoJsonLayer = BMapGL.GeoJSONLayer('宝鸡市',geoJsonSetting)
                //     map.addGeoJSONLayer(geoJsonLayer)

                var colorBand = ['#CCFF99', '#FFFFFF', '#99CCFF', '#FFCC99', '#FFFFCC', '#99CCCC' ,'#CCFFFF' ,'#66CCFF', '#CC9999', '#FFFF00' ,'#CCCCCC'];

                bjRegionLayer = new BMapGL.GeoJSONLayer('bj-child', {
                    reference: 'GCJ02',
                    dataSource: data,         // 北京各区数据
                    level: -10,                // 显示层级，由于系统内部问题，GeoJSONLayer图层等级使用负数表达，负数越大层级越高，默认-99
                    minZoom: 7,               // 设置图层显示的地图最小等级
                    maxZoom: 19,                // 设置图层显示的地图最大等级

                    polygonStyle: function (properties) {
                        var index = properties.subFeatureIndex || 0;
                        return {
                            fillColor: colorBand[index]
                        }
                    },

                });
                map.addGeoJSONLayer(bjRegionLayer);
                map.centerAndZoom(new BMapGL.Point(107.2, 34.3), 10)

            }


        });
    }


    // 绑定wms图层
    function wmsBond(map) {


        var wms
        var addWms = false
        $('#wmsLayer input:radio[name="wmsData"]').click(function () {
    
            if (addWms) {
    
            $('#wmsLayer input:radio[name="wmsData"]').attr("checked", false);
            addWms = false

            
            wms && map.removeTileLayer(wms);
            map.removeOverlay(label);



            return
            }
    
            if ($('#wmsLayer input:radio[name="wmsData"]').prop("checked")) {
    

                addWms = true
                map.setTilt(0); 


                 wms = new BMapGL.XYZLayer({
                    useThumbData: true,
                    tileUrlTemplate: 'https://ows.mundialis.de/services/service?&service=WMS&' +
                        'request=GetMap&layers=TOPO-WMS%2COSM-Overlay-WMS&styles=&format=image%2Fjpeg&' +
                        'transparent=false&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=[b]',
                });
                map.addTileLayer(wms);
                var bd = new BMapGL.Boundary();
                bd.get('陕西', function (rs) {
                    wms.addBoundary(rs.boundaries);
                });

                map.centerAndZoom( new BMapGL.Point(107, 34),6); 

        
    
            }
    
        });

    }


    // // 绑定tms图层
    // function wmtsBond(map) {


    //     var wms
    //     var addWms = false
    //     $('#wmtsLayer input:radio[name="wmtsData"]').click(function () {
    
    //         if (addWms) {
    
    //         $('#wmtsLayer input:radio[name="wmtsData"]').attr("checked", false);
    //         addWms = false

            
    //         // wms && map.removeTileLayer(wms);
    //         // map.removeOverlay(label);



    //         return
    //         }
    
    //         if ($('#wmtsLayer input:radio[name="wmtsData"]').prop("checked")) {
    

    //             addWms = true
    //             map.setTilt(0); 


    //              wms = new BMapGL.XYZLayer({
    //                 useThumbData: true,
    //                 tileUrlTemplate: 'https://localhost:6443/arcgis/rest/services/MapService_busi/MapServer/WMTS?/tile/1.0.0/MapService_busi/default/EPSG:4326/EPSG:4326:1/1/1.png',
                  

    //                 extentCRSIsWGS84: true,
    //             });
    //             map.addTileLayer(wms);


    //             map.centerAndZoom( new BMapGL.Point(107, 34),6); 

        
    
    //         }
    
    //     });

    // }

}