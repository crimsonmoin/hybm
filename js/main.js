var clearWorker;
var longpollerWorker;
var operation="";
var id=0;
var con_type="";
var MasterData=[
{'type':'PPT','size':'4mb','op':'upload'},
{'type':'PPT','size':'2mb','op':'upload'},
{'type':'Image','size':'21mb','op':'download'},
{'type':'Image','size':'12mb','op':'download'},
{'type':'Video','size':'17mb','op':'download'},
{'type':'Video','size':'2mb','op':'download'},
{'type':'App','size':'12mb','op':'download'},
{'type':'App','size':'45mb','op':'download'},
{'type':'App','size':'20mb','op':'download'},
{'type':'App','size':'11mb','op':'download'},
{'type':'YouTube','size':'0mb','op':'streaming'},
{'type':'YouTube','size':'0mb','op':'streaming'},
];
var op=0;
$(document).on("pagecreate","#connectpage",function(){
  $("button").on("click",function(){
	  id=$("#txtid").val();
	  con_type=$("input[type='radio']:checked").val();
	  if(id==""){alert('Please enter store id.');}
	  else{
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					window.location.href="#mainpage";
				}
				if(xhttp.status == 204){alert('Store id is invalid');}
			}
		xhttp.open("GET", "http://testapi.moinwebdev.com/rest/api.php?request=GetTime&id="+id, true);
		xhttp.send();
		}
  });    
});
$(document).on("pageshow","#mainpage",function(){
	if(con_type=="3G"){
		$("#other_op").show();
		$("#vodafone_logo").hide();
		$("#logo_4g").hide();
	}
	else{
	$("#vodafone_logo").show();
	$("#logo_4g").show();
	$("#other_op").hide();
	}
	if(typeof(longpollerWorker)!="undefined"){
		longpollerWorker.terminate();
		longpollerWorker=undefined;
	}
	function longPoller(){
		if (typeof (Worker) !== "undefined") {
                 //Creating Worker Object
                 longpollerWorker = new Worker("js/longpolling.js");
                 //Call Back Function for Success
                 longpollerWorker.onmessage = workerResultReceiver;
				 // send message to web worker
                 //Call Back function if some error occurred
                 longpollerWorker.onerror = workerErrorReceiver;    
                 function workerResultReceiver(e) {
                     var data=JSON.parse(e.data);
						if(con_type=="3G"){
							if(data.device1==0){
								
							}
						}
						else{
							if(data.device2==0){
								
							}
						}
                 }
				 longpollerWorker.postMessage(id);
                 function workerErrorReceiver(e) {
                     console.log("there was a problem with the WebWorker within " + e);
                 }
              }
              else {
                  alert("Sorry!!! could not connect");
              }
	};
	longPoller();
});