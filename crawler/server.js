var express=require('express');
var regex=require('regex');
var promise=require('bluebird');
const request = require('request');
var regexp=require('regexp');
var exp1=/<a href=\".*\">/g;
var exp2=/beke/;
var sub="a";
var pagedata=[],pgcount=0;
var pageresult;
var app=express();
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({}));
var s,i=9,j=0,k=0,promcount=0;
var links=[];
var test;
var neededlinks=[];
var promises=[];
var jsonresult={}
var output={},outputcount=0;
const baseUrl = 'http://marijnhaverbeke.nl/';
app.get('/front',function(req,res){
    res.sendFile(__dirname+'/front.html');
      });
function promfunction(input){
    return new promise(function(resolve,reject){
     request(input, (err, data ,res)=>{
            if(data){
               test=res;
              pageresult=exp2.exec(test);
              if(pageresult!==null){
              output[outputcount]=input;
             console.log(pageresult[0]+" "+input);
             outputcount++;
              }
             pgcount++;
                resolve(data);
            }
            else if(err){
                //console.log("err at"+input);
                resolve(err);
            }
     });
    });
}

app.post('/send',function(req,response){

s=req.body.srh;

request(baseUrl , (err, res, data) => {
var result,link="",searchresult;
while((result=exp1.exec(data))!==null){
    if(result[0][i]!='h')
    link=link+baseUrl;
    while(result[0][i]!='"')
    {
        
link+=result[0][i];
i++;
    }
    i=9;
    neededlinks[j]=link;
    console.log(link);
promises.push(promfunction(neededlinks[j]));

    j++;
    //console.log("link "+link);
    link="";
    
    //console.log(exp1.lastIndex);
};
//console.log(neededlinks);
var allpromise=promise.all(promises).then(function sol(){
    console.log(allpromise);
    console.log(output);
    response.json(output);
    output={};
    outputcount=0;
    i=9;j=0;k=0;
});

    if (err) {
      console.log(err);

    }
    
}
)
});
output=[];
app.listen(4000);
console.log("listening");