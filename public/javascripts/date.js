$(document).ready(function(){
  $('#generate').on('click', function(){
    var from = new Date($('#from').val());
    day = from.getDate();
    month = from.getMonth() + 1;
    year = from.getFullYear();
    var fromdata=(day<10 ? '0' : '') + day + "-" + (month<10 ? '0' : '') + month + '-'+ year;
    var to = new Date($('#to').val());
    day=to.getDate();
    month=to.getMonth()+1;
    year=to.getFullYear();
    var todata=(day<10 ? '0' : '') + day + "-" + (month<10 ? '0' : '') + month + '-'+ year;
        var listtable = $('.totdata').DataTable();
        listtable.clear()
    $.post('/report',{fromdate:fromdata,todate:todata},function(data){
        var stringified = JSON.stringify(data);
        $.each(JSON.parse(stringified), function(idx, obj) {
        listtable.row.add([
            obj.college,
            obj.branch,
            obj.lab,
            obj.date,
            obj.itemname,
            obj.specifications,
            obj.supplier,
            obj.address,
            obj.invoice,
            obj.unit,
            obj.quantity,
            obj.cost,
            obj.pageno,
            obj.remarks
        ]).draw(false);
      }); 
    });
  });
});