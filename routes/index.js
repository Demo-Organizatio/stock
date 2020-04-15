var express = require('express');
var router = express.Router();
var monk = require('monk');
var moment = require('moment');
var db = monk('localhost:27017/stock');
var transferstock = db.get('transferstock');
var newstock = db.get('newstock');
var totaldata = db.get('totaldata');
var condomedstock = db.get('condomedstock');
var recievestock = db.get('recievestock');
var stocklogins = db.get('stocklogins');

/* GET home page. */
router.get('/', function(req, res){
  res.redirect('login');
});
router.get('/login', function(req, res){
  res.render('login');
});
//admin

//home
router.get('/home', function(req, res) {
  if (req.session && req.session.user) {
    var branch = req.session.user.branch;
    var college = req.session.user.college;
    console.log(branch);
    console.log(college);
    totaldata.find({"college":college,"branch":branch}, function(err,totdata){
    newstock.find({"college":req.session.user.college,"branch":req.session.user.branch},function(err,docs){
    transferstock.find({"college":req.session.user.college,"branch":req.session.user.branch}, function(err, dta) {
    transferstock.find({"TransferCollege":req.session.user.college,"TransferBranch":req.session.user.branch,"status":"transfer"}, function(err, dt) {
    condomedstock.find({"college":req.session.user.college,"branch":req.session.user.branch}, function(err, data) {
    recievestock.find({"college":req.session.user.college,"branch":req.session.user.branch}, function(err, da) {
        //console.log(docs);
      res.locals.branch = JSON.stringify(branch);
      res.locals.college = JSON.stringify(college);
      res.locals.get = dt;
      //console.log(dt);
      res.locals.totdata = totdata;
      console.log(totdata);
      res.locals.newdata = docs;
      res.locals.transferstock = dta;
      res.locals.condomedstock = data;
      res.locals.recievestock = da;
      res.render('index');
  });
  });
  });
  });
  });
  });
}
});
// post login form 
router.post('/login', function(req, res){
    var username = req.body.username;
    req.session.user=username;
    var password = req.body.password;
  stocklogins.findOne({username:username, password:password}, function(err, doc){
    if (!doc) {
      res.render('login');
    }
    else{
        delete doc.password;
        req.session.user = doc;
        res.redirect('/home');
      }
  });
});
//user logout
router.get('/logout', function(req, res){
  if(req.session && req.session.user){
  req.session.reset();
  res.redirect('/login');
}
});

/* POST stock details */
router.post('/newentry', function(req, res) {
    var temp="01:30";
    var timestamp=req.body.date+" "+temp;
      dateTimeParts=timestamp.split(' '),
      timeParts=dateTimeParts[1].split(':'),
      dateParts=dateTimeParts[0].split('-');
    var date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
    var datet=date.getTime();
  console.log(datet)
  var data={
  sno        : req.body.sno,
  college    : req.body.college,
  branch     : req.body.branch,
  lab        : req.body.lab,
  date       : req.body.date,
  itemname   : req.body.itemname,
  specifications : req.body.specifications,
  supplier   : req.body.supplier,
  address    : req.body.address,
  invoice    : req.body.invoice,
  unit       : req.body.unit,
  quantity   : req.body.quantity,
  cost       : req.body.cost,
  pageno     : req.body.pageno,
  remarks    : req.body.remarks,
  Timestamp  : datet,
  status     : "new",
  }
newstock.insert(data,function(err,docs){
totaldata.insert(data,function(err,data){
});
});
  res.redirect('/home');
});

//transfer find
router.post('/transfer_find', function(req, res){
  //console.log(req.body.id);
  newstock.find({"lab":req.body.id}, function(err, data1){
    //console.log(data1);
  res.send(data1);
  });
});

//Recieve find using ID.
router.post('/transfer_find_using_lab', function(req, res){
  //console.log(req.body.id);
  newstock.find({"_id":req.body.id}, function(err, data1){
    //console.log(data1);
  res.send(data1);
  });
});

/* POST transfer stock details */
router.post('/transfer', function(req, res) {
  var updateqtny = (req.body.transfer_quantity_hide-req.body.transfer_quantity);
  var updatetotalcost = (req.body.transfer_cost_hide-req.body.transfer_cost);

  var data={
  sno        : req.body.transfer_sno,
  college    : req.body.transfer_college,
  branch     : req.body.transfer_branch,
  TransferBranch: req.body.transfer_branch1,
  TransferCollege: req.body.transfer_college1,
  lab        : req.body.transfer_lab,
  date       : req.body.transfer_date,
  itemname   : req.body.transfer_itemname,
  specifications : req.body.transfer_specifications,
  supplier   : req.body.transfer_supplier,
  address    : req.body.transfer_address,
  invoice    : req.body.transfer_invoice,
  unit       : req.body.transfer_unit,
  quantity   : updateqtny,
  cost       : updatetotalcost,
  transferQuantity : req.body.transfer_quantity,
  transferCost : req.body.transfer_cost,
  totalstockQuantity : req.body.transfer_quantity_hide,
  totalstockCost : req.body.transfer_cost_hide,
  pageno     : req.body.transfer_pageno,
  remarks    : req.body.transfer_remarks,
  transferLab : req.body.transfer_lab1,
  transferDate: req.body.transfer_date1,
  status     : "transfer",
  }
newstock.update({"invoice":req.body.transfer_invoice, "lab":req.body.transfer_lab, "date":req.body.transfer_date,  "unit":req.body.transfer_unit, "branch":req.body.transfer_branch, "college":req.body.transfer_college},{$set:data},function(err,docs){
transferstock.insert(data,function(err,docs1){
});
});
  res.redirect('/home');
});
//RECIEVE DETAILS
router.post('/recieve_details', function(req, res){
  transferstock.find({"_id":req.body.id}, function(err, data){
  res.send(data);
  });

});

/* POST recieve stock details */
router.post('/recieve', function(req, res) {

   newstock.find({"sno":req.body.recieve_sno}, function(err, res){
     console.log(parseInt(res[0].quantity))
     console.log(parseInt(req.body.recieve_quantity))
     console.log(parseInt(res[0].quantity)+parseInt(req.body.recieve_quantity))
     var upddata = {
       quantity   : parseInt(res[0].quantity)+parseInt(req.body.recieve_quantity),
       cost       : parseInt(res[0].cost)+parseInt(req.body.recieve_cost),
     }
     newstock.update({"_id":req.body.recieve_id},{$set:upddata}, function(err, resdocs){
       //console.log('newstock Updated');
     });
   });

   transferstock.remove({"_id":req.body.recieve_id}, function(err, msg){
     console.log('Deleted Successfully');
   });

   var data={
   sno        : req.body.recieve_sno,
   college    : req.body.recieve_college,
   branch     : req.body.recieve_branch,
   transferdLab: req.body.recieve_lab,
   lab        : req.body.recieve_lab1,
   date       : req.body.recieve_date,
   recievedDate: req.body.recieve_date,
   itemname   : req.body.recieve_itemname,
   specifications : req.body.recieve_specifications,
   supplier   : req.body.recieve_supplier,
   address    : req.body.recieve_address,
   invoice    : req.body.recieve_invoice,
   unit       : req.body.recieve_unit,
   quantity   : req.body.recieve_quantity,
   cost       : req.body.recieve_cost,
   pageno     : req.body.recieve_pageno,
   remarks    : req.body.recieve_remarks,
   status     : "recieve",
   }
  var data1={
   sno        : req.body.recieve_sno,
   college    : req.body.recieve_college,
   branch     : req.body.recieve_branch,
   lab        : req.body.recieve_lab1,
   date       : req.body.recieve_date,
   itemname   : req.body.recieve_itemname,
   specifications : req.body.recieve_specifications,
   supplier   : req.body.recieve_supplier,
   address    : req.body.recieve_address,
   invoice    : req.body.recieve_invoice,
   unit       : req.body.recieve_unit,
   quantity   : req.body.recieve_quantity,
   cost       : req.body.recieve_cost,
   pageno     : req.body.recieve_pageno,
   remarks    : req.body.recieve_remarks,
   status     : "new",
   }
 recievestock.insert(data,function(err,docs1){
 transferstock.update({"sno":req.body.recieve_sno},{$set:{"status":"recieved"}},function(err,docs2){
 newstock.insert(data1,function(err,docs3){
  console.log(docs3)
 });
});
});
  res.redirect('/home');
});




//condomend find
router.post('/condomend_find', function(req, res){
  //console.log(req.body.id);
  newstock.find({"lab":req.body.id}, function(err, data1){
    //console.log(data1);
  res.send(data1);
  });
});

//Recieve find using ID.
router.post('/condomend_find_using_lab', function(req, res){
  //console.log(req.body.id);
  newstock.find({"_id":req.body.id}, function(err, data1){
    //console.log(data1);
  res.send(data1);
  });
});


/* POST condomendRemove */
router.post('/condomendRemove', function(req, res) {

  //console.log(req.body.condomend_row_id);
  var data={
    college:req.body.condomend_college,
    branch:req.body.condomend_branch,
    lab:req.body.condomend_lab,
    date:req.body.condomend_date,
    condomendDate:req.body.condomend_date1,
    itemname:req.body.condomend_itemname,
    supplier:req.body.condomend_supplier,
    address:req.body.condomend_address,
    invoice:req.body.condomend_invoice,
    unit:req.body.condomend_unit,
    quantity:req.body.condomend_quantity,
    cost:parseInt(req.body.condomend_cost),
    pageno:req.body.condomend_pageno,
    remarks:req.body.condomend_remarks,
    specifications:req.body.condomend_specifications,
    sno:req.body.condomend_sno,
    status:"condomed",
  }

  condomedstock.insert(data);

  newstock.find({"_id":req.body.condomend_row_id}, function(err, data){
    //console.log(data[0].quantity);
    // if (data[0].quantity==req.body.condomend_quantity) {
    //   newstock.remove({"_id":req.body.condomend_row_id}, function(err, msg){
    //     console.log('Deleted Successfully');
    //   });
    // }
    // else {
      var upddata = {
        quantity   : parseInt(data[0].quantity)-parseInt(req.body.condomend_quantity),
        cost       : parseInt(data[0].cost)-parseInt(req.body.condomend_cost),
      }
      //console.log(upddata);
      newstock.update({"_id":req.body.condomend_row_id},{$set:upddata}, function(err, resdocs){
        //console.log(resdocs);
      });
    // }
  });
  res.redirect('/home');
});








//edit stock data
router.post('/stockupdate', function(req, res){
  var data = {
    sno        : req.body.edit_sno,
    college    : req.body.edit_college,
    branch     : req.body.edit_branch,
    lab        : req.body.edit_lab,
    date       : req.body.edit_date,
    itemname   : req.body.edit_itemname,
    specifications : req.body.edit_specifications,
    supplier   : req.body.edit_supplier,
    address    : req.body.edit_address,
    invoice    : req.body.edit_invoice,
    unit       : req.body.edit_unit,
    quantity   : req.body.edit_quantity,
    cost       : req.body.edit_cost,
    pageno     : req.body.edit_pageno,
    remarks    : req.body.edit_remarks,
  };
  newstock.update({"sno":req.body.edit_sno},{$set:data}, function(err, docs){
});
  res.redirect('/home');
});

//edit box filling
router.post('/edit_details', function(req, res){
  newstock.find({"_id":req.body.id}, function(err, data){
  res.send(data);
  });

});
//delete
router.post('/delete_details', function(req, res){
  //console.log(req.body.id);
  newstock.remove({"_id":req.body.id}, function(err, data1){
  res.send(data1);
  });
});


// router.post('/datewise', function(req,res){
//   var arr = [ ]
//   var fdate = req.body.fromdate;
//   var tdate = req.body.todate
//   var fromdate = moment(fdate).format("DD-MM-YYYY");
//   var todate = moment(tdate).format("DD-MM-YYYY");
//   var College = req.body.college;
//   newstock.find({"date":{$gte:fromdate, $lte:todate}, "college":College}, function(err,docs){
//     if(docs){
//         // console.log("working")
//         console.log(docs.length);
//         for(i=0;i<docs.length;i++){
//           arr.push(docs[i])
//         }

//       transferstock.find({"date":{$gte:fromdate, $lte:todate}, "college":College}, function(err,docs1){
//           // console.log(docs)
//         if(docs1){  
//           // console.log(fromdate);
//           // console.log(todate);
//           // console.log("working1")
//           console.log(docs1.length);
//           for(i=0;i<docs1.length;i++){
//             arr.push(docs1[i])
//           }
//             condomedstock.find({"date":{$gte:fromdate, $lte:todate}, "college":College}, function(err,docs2){
//             // console.log(docs)
//                  if(docs2){
//                    // console.log(fromdate);
//                    // console.log(todate);
//                    console.log(docs2.length);
//                    for(i=0;i<docs2.length;i++){
//                      arr.push(docs2[i])
//                    }
//                    recievestock.find({"date":{$gte:fromdate, $lte:todate}, "college":College}, function(err,docs3){
//                      // console.log(docs)
//                           if(docs3){
//                             // console.log(fromdate);
//                             // console.log(todate);
//                             console.log(docs3.length);
//                             for(i=0;i<docs3.length;i++){
//                               arr.push(docs3[i])
//                             }
//                             console.log(arr.length)
//                             res.send(arr)
//                           }
//                      });
//                  }
//             });
//         }
//       });

//    }
//   });
// });

function gettimestamp(currentdate,temp)
{
  var timestamp=currentdate+" "+temp;
      dateTimeParts=timestamp.split(' '),
      timeParts=dateTimeParts[1].split(':'),
      dateParts=dateTimeParts[0].split('-');
var date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
return date.getTime();
}


router.post('/report', function(req,res){
    if (req.session && req.session.user) {
      if(req.session.user =="CENTRALSTOCK"){
        var from = req.body.fromdate;
        console.log(from);
        var to = req.body.todate;
        console.log(to);
        var from_x="00:00";
        var to_x="23:59";
        var from_date=gettimestamp(from,from_x);
        console.log(from_date);
        var to_date=gettimestamp(to,to_x);
        console.log(to_date);
        totaldata.find({"Timestamp":{$gte:from_date,$lte:to_date}}, function(err,totdata){
          console.log(totdata)
          res.send(totdata)
        })
      }
      else{
        var branch = req.session.user.branch;
          var college = req.session.user.college;
         console.log(req.body)
        var from = req.body.fromdate;
        console.log(from);
        var to = req.body.todate;
        console.log(to);
        var from_x="00:00";
        var to_x="23:59";
        var from_date=gettimestamp(from,from_x);
        console.log(from_date);
        var to_date=gettimestamp(to,to_x);
        console.log(to_date);
         totaldata.find({"Timestamp":{$gte:from_date,$lte:to_date},"college":college,"branch":branch}, function(err,totdata){
           console.log(totdata)
           res.send(totdata)
         })

      } 
    
 }
});


router.post('/datewise', function(req,res){
  var fdate = req.body.fromdate;
  var tdate = req.body.todate;
  var college = req.body.college;
  // console.log(fdate)
  // console.log(tdate)
  var fromdate = moment(fdate).format("DD-MM-YYYY");
  var todate = moment(tdate).format("DD-MM-YYYY");
  var from_x="00:00";
  var to_x="23:59";
  var from_date=gettimestamp(fromdate,from_x);
  console.log(from_date);
  var to_date=gettimestamp(todate,to_x);
  totaldata.find({"Timestamp":{$gte:from_date,$lte:to_date},"college":college}, function(err,totdata){
    // console.log(totdata)
    res.send(totdata)
  })
});

module.exports = router;
