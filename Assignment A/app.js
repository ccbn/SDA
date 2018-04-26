var fs = require('fs');
var csv = require('fast-csv');
var delay = require('delay');

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDvNaGnd4wYzSXjX3jtEC0s9qpIB0gY_KQ'
  });

/*
googleMapsClient.geocode({
address: '3442 EAST TREMONT AVENUE'
}, function(err, response) {
if (!err) {
    console.log(response.json.results[0].geometry.location);
}
});
*/

var fileName = "data.csv";
var stream = fs.createReadStream(fileName);

var addresses = [];
var rows = [];

var count = 0;

var csvStream = csv()
    .on("data", function(data){
        
        
        /*
        var building = data[3];
        var street = data[4];
        var zipcode = data[5];
        var address = building + " " + street + " " + zipcode;
        if(!addresses.includes(address)) {
            addresses.push(address);
            console.log(address);
        } */
        
        if(count < 1700) {
            count++;
            rows.push(data);
        }
    })
    .on("end", function(){

        //var propertyNames = Object.keys(myDic); 
        var ws = fs.createWriteStream("my.csv");
        /*
        var dataToBeSaved = [];
        for(var i = 0; i < propertyNames.length; i++) {
            dataToBeSaved.push([propertyNames[i],myDic[propertyNames[i]]]);
        }
        
        
        //var headers = ["CAMIS","DBA","BORO","BUILDING","STREET","ZIPCODE","PHONE","CUISINE DESCRIPTION","INSPECTION DATE","ACTION","VIOLATION CODE","VIOLATION DESCRIPTION","CRITICAL FLAG","SCORE","GRADE","GRADE DATE,RECORD DATE","INSPECTION TYPE"];
        
        
        var addressesInsideArray = [];
        for (let index = 0; index < addresses.length; index++) {
            const element = addresses[index];
            addressesInsideArray.push([element]);
        }
        var headers = ["address"];
        */
        
       var dataToBeSaved = [];
       for (let index = 0; index < rows.length; index++) {
           const element = rows[index];
           var timeToDelay = index * 500;
           setTimeout(function() {
               googleMapsClient.geocode({
                   address: element[0]
                }, function(err, response) {
                    if (!err) {
                        var location = response.json.results[0].geometry.location;
                        dataToBeSaved.push([element[0],location.lat,location.lng]);
                        if(dataToBeSaved.length == rows.length) {
                            var headers = ["address", "lat", "lon"];
                            csv.write(dataToBeSaved, {headers: headers}).pipe(ws);
                            console.log("Data saved to file...");
                            
                        }
                        console.log("Data pushed into into array...");
                        
                    }
                });
           },timeToDelay);
        }
    });

stream.pipe(csvStream);