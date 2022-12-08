import { map } from "./index.js";

// 绑定图层事件
bondLayers(map)





// ————————————————————————————————————函数
// 绑定图层事件
function bondLayers(map) {
    // $('#jiaotongLayer input:radio[name="jiaotong"]').click(function(){
    //     if($('#jiaotongLayer input:radio[name="jiaotong"]').prop("checked")){
    //         map.setTrafficOn();  
    // 		// $('#jiaotongLayer input:radio[name="jiaotong"]').attr("checked",false);
    //         // $('#jiaotongLayer input:radio[name="jiaotong"]').removeAttr('checked')

    //     }else{

    //         map.setTrafficOff();  
    //         $('#jiaotongLayer input:radio[name="jiaotong"]').attr('checked','checked')
    //     }

    // });
    var addJiaotong = false

    $('#jiaotongLayer input:radio[name="jiaotong"]').click(function () {
        console.log(2);

        
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
