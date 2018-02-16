//import express package
var express = require("express");

// import mongodb package
var mongodb = require("mongodb");


var dbHost = "mongodb://localhost:27017/fusion_demo";
var dbObject;

var MongoClient = mongodb.MongoClient;

MongoClient.connect(dbHost, function(err, db){
  if( err ) throw err;
  dbObject = db;
});

function getData(){

  dbObject.collection("fuel_price").find({}).toArray(function(err, docs){
         if ( err ) throw err;
         var monthArray = [];
         var petrolPrices = [];
         var dieselPrices = [];

         for ( index in docs){
           var doc = docs[index];
           //category array
           var month = doc['month'];
           //series 1 values array
           var petrol = doc['petrol'];
           //series 2 values array
           var diesel = doc['diesel'];
           monthArray.push({"label": month});
           petrolPrices.push({"value" : petrol});
           dieselPrices.push({"value" : diesel});
         }

         var dataset = [
           {
             "seriesname" : "Petrol Price",
             "data" : petrolPrices
           },
           {
             "seriesname" : "Diesel Price",
             "data": dieselPrices
           }
         ];

         var response = {
           "dataset" : dataset,
           "categories" : monthArray
         };
       });
     }

     var app = express();
app.get("/fuelPrices", function(req, res){
  getData(res);
});

app.listen("3300", function(){
  console.log('Server up: localhost:3300');
});
