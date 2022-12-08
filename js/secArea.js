import { map } from "./index.js";

// 绑定图层事件
bondLayers(map)





// ————————————————————————————————————函数
// 绑定图层事件
function bondLayers(map) {


    //绑定交通页面
    var addJiaotong = false

    $('#jiaotongLayer input:radio[name="jiaotong"]').click(function () {

        
        if(addJiaotong) {
            map.setTrafficOff(); 
            $('#jiaotongLayer input:radio[name="jiaotong"]').attr("checked",false);
            addJiaotong = false
            return
        }
        
        if ($('#jiaotongLayer input:radio[name="jiaotong"]').prop("checked")) {

            addJiaotong = true
            map.setTrafficOn();
        } 

    });
}
