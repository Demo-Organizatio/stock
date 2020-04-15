$('document').ready(function(){
  $("#gen").click(function(){
  var fdate = $("#fdate").val();
  var tdate = $("#tdate").val();
          var coll = $("#College").val()
  // alert(tdate);
            // alert(fdate)
  var listtable = $('#dataTables-example').DataTable();
           listtable.clear();
  $.post('/datewise',{"fromdate":fdate,"todate":tdate,"college":coll},function(data1,textStatus,jqXHR){
              // alert("working")
             var jsondata1=JSON.stringify(data1);
             $.each($.parseJSON(jsondata1),function(i,v){
              listtable.row.add( [
                  v.college,
                  v.branch,
                  v.lab,
                  v.date,
                  v.itemname,
                  v.specifications,
                  v.supplier,
                  v.address,
                  v.invoice,
                  v.unit,
                  v.quantity,
                  v.cost,
                  v.pageno,
                  v.status
                ] ).draw(false);            
              });
        });
     });
})