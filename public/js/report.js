$(document).ready(function(){
$("#count").text(0);
$("#id").focus(); 
$("#clickid").click(function(){
$("#id").focus();
});
$("#id").keypress(function(){
var myLength = $("#id").val().length; 
if(myLength==10){
var val=$("#id").val();

$.post("/check",{"id":$("#id").val()}).done(function(data, textStatus, jqXHR){
if(data.error){
    
$("#count").text(data.count);

  display(val)
$("#information").text(data.error);
}
else if(data.err)
{
  $("#status").text(data.err);
}
else
{
display(val);
$("#information").text(data.docs);
}
});
}
});
   
$("#datereport").click(function(){
    var from=$("#registration_date1").val();
     var to=$("#registration_date2").val();
  var selected = [];
  

$('#checkboxes input:checked').each(function() {
    selected.push($(this).attr('value'));
});
selected.push('date');

var obj = {};

for(i in selected){
  var newNum = selected[i];
  var newVal = 1;
  obj[newNum] = newVal;
}

var x=JSON.stringify(obj);
var dataset=[];
for(i=0;i<selected.length;i++)
{
dataset[i]={title:selected[i],dataKey:selected[i]};
}
$.post("/datereport",{"selectedarray":x,"selected":selected,"from":from,"to":to}).done(function(data, textStatus, jqXHR){

var columns = dataset;
    var rows = data;
    var pdfsize = 'a2';
   var doc = new jsPDF('p', 'pt' , pdfsize);
    doc.setFontSize(20);
    doc.setFontStyle('bolditalic');
    doc.setFontType('sans-serif');
    doc.setTextColor('');
    doc.text(500,40,"Technical Hub");
    doc.text(750,60,"Date-to-Date Report");
    doc.text(800,100,from+" - "+to);
    doc.setLineWidth(1.5);
    doc.line(40,80,1165,80);
    // doc.text(500,30,"From:"+from+"  to:"+to);
    doc.autoTable(columns, rows,{theme:'grid',startY:120,showHeader: 'everyPage',headerstyles:{fillColor:20},columnStyles: {fontSize: 5},alternateRowStyles: {fillColor:200}});
    doc.save(from+'-'+to+'-VisitorReport.pdf');

});


});


function display(val)
{

$.post("/dbdata").done(function(data, textStatus, jqXHR) {
var obj=JSON.stringify(data);
var da=jQuery.parseJSON(obj);

if(da.error){
$("#id1").text("");
$("#vname").text("");
$("#number").text("");
$("#place").text("");
$("#phone").text("");
$("#vehicle").text("");
$("#material").text("");
$("#search").text("");
$("#college").text("");
$("#vfdate").text("");
$("#imgpath").attr("src","user-icon.png");
$("#status").text(da.error);
}
else
{
$("#id1").text(da.id1);
$("#vname").text(da.vname);
$("#number").text(da.number);
$("#place").text(da.place);
$("#phone").text(da.phone);
$("#vehicle").text(da.vehicle);
$("#material").text(da.material);
$("#search").text(da.search);
$("#college").text(da.college);
$("#vfdate").text(da.vfdate);
$("#imgpath").attr("src","images/"+da.id+".jpg");
$("#status").text("details  found");
}
}).fail(function(jqXHR, textStatus, errorThrown) 
{

    alert('failed');
});

}
