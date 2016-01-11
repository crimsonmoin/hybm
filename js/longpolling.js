function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
postMessage(xhttp.responseText);
    }
  };
  xhttp.open("GET", "http://testapi.moinwebdev.com/rest/api.php?request=GetTime", true);
  xhttp.send();
}
setInterval(function(){ loadDoc(); }, 1500);