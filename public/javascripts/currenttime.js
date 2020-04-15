function display_ct() {
var strcount
var x = new Date()
var x1=x.getMonth() + "/" + x.getDate() + "/" + x.getYear(); 
x1 = x1 + " - " + x.getHours( )+ ":" + x.getMinutes() + ":" + x.getSeconds();
document.getElementById('ct').innerHTML = x1;

tt=display_c();
}