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
{'type':'YouTube','size':'-mb','op':'streaming'},
{'type':'YouTube','size':'-mb','op':'streaming'},
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
	$(".progress").hide();
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
	function trigger_action(ty){
		longpollerWorker.terminate();
		longpollerWorker=undefined;
		startWorker();
		switch(ty){
			case 'ppt1' : 
			return 0;
			break;
			case 'ppt2' : 
			return 1;
			break;
			case 'image1' : return 2;break;
			case 'image2' : return 3;break;
			case 'video1' : return 4;break;
			case 'video2' : return 5;break;
			case 'app1' : return 6;break;
			case 'app2' : return 7;break;
			case 'app3' : return 8;break;
			case 'app4' : return 9;break;
			case 'youtube1' : return 10;break;
			case 'youtube2' : return 11;break;
		}
	};
	function longPoller(){
		if (typeof (Worker) !== "undefined") {
                 //Creating Worker Object
                 longpollerWorker = new Worker("js/longpolling.js");
                 //Call Back Function for Success
                 longpollerWorker.onmessage = workerResultReceiver;
                 //Call Back function if some error occurred
                 longpollerWorker.onerror = workerErrorReceiver;    
                 function workerResultReceiver(e) {
                     var data=JSON.parse(e.data);
						if(data.device1==0&&data.device2==0){
							$(".centralizer>h1").hide();
							$(".top>h1").hide();
							$("#op").show();
							var op=trigger_action(data.operation);
							$("#op").html('Test Performed<br/>'+MasterData[op].type+" "+MasterData[op].op+"<br/>"+"File Size : "+MasterData[op].size);
							$(".progress").show();
						}
                 }
				 // send message to web worker
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
	function stopTimer(){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
				longPoller();	
				$(".centralizer>h1").show();
				$(".top>h1").show();
				$("#op").hide();				
				$(".progress").hide();
			}
		};
		var d;
		if(con_type=="3G"){d=1;}else{d=0;}
		xhttp.open("GET", "http://testapi.moinwebdev.com/rest/api.php?request=updateTime&d="+d+"&id="+id, true);
		xhttp.send();
	}
	var w;
	function startWorker() {
    if(typeof(Worker) !== "undefined") {
			if(typeof(w) == "undefined") {
				w = new Worker("js/demo_workers.js");
			}
			w.onmessage = function(event) {
				$(".progress>h1").html(event.data+"%");
				if(event.data==100){
					stopWorker();
				}
			};
		}
	}
	function stopWorker() { 
		w.terminate();
		w = undefined;
		stopTimer();
	}
});