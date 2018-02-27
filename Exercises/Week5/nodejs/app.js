var fs = require('fs');

var csv = require('fast-csv');

var fileName = "NYPD_Complaint_Data_Historic.csv";
var stream = fs.createReadStream("../" + fileName);

var myDic = {};

var csvStream = csv()
    .on("data", function(data){
        if(data[13] != "") {
            if(!myDic[data[13]]) {
                myDic[data[13]] = 1;
            } else {
                myDic[data[13]]++;
            }
        }
        
    })
    .on("end", function(){

        var propertyNames = Object.keys(myDic); 
        var ws = fs.createWriteStream("my.csv");

        var dataToBeSaved = [];
        for(var i = 0; i < propertyNames.length; i++) {
            dataToBeSaved.push([propertyNames[i],myDic[propertyNames[i]]]);
        }
        csv.write(dataToBeSaved, {headers: ["Borough","CRIME_NUM"]})
        .pipe(ws);
    });

stream.pipe(csvStream);

