var longpollerWorker;
$(document).on("pagecreate","#mainpage",function(){
  if(typeof(longpollerWorker)!="undefined"){
		longpollerWorker.terminate();
		longpollerWorker=undefined;
	}
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
							$(".centralizer>.progress").show();
						}
						else{
							$(".centralizer>h1").show();
							$(".centralizer>.progress").hide();
						}
                 }
                 function workerErrorReceiver(e) {
                     console.log("there was a problem with the WebWorker within " + e);
                 }
              }
              else {
                  alert("Sorry!!! Worker Not Supported in Your Browser");
              }
});