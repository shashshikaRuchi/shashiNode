var express=require("express");
var app=express();
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    next();
});
const port=2410;
app.listen(port,()=>console.log("Listening on port : ",port));
const MongoClient=require("mongodb").MongoClient;
const url="mongodb://localhost:27017";
const dbName="excellence";
const client = new MongoClient(url, {useUnifiedTopology: true});

// registering new candidate
app.post("/register", function(req, res)
    {
    let body={ ...req.body};
    client.connect(function(err,client){
        if(err) 
        {
           console.log(err);
           res.send({"status":"error","msg":""+err+""});
        }
        else
        {
            const db=client.db(dbName);
            db.collection("candidates").findOne({email:req.body.email},function(err,result){
            if(err) 
            {
                console.log(err);
                res.send({"status":"error","msg":""+err+""});
            }
            else
            {
                if(result)
                {
                    console.log(""+req.body.email+" email already exist.Enter a new one.");
                    res.send({"status":"error","msg":""+req.body.email+" email already exist.Enter a new one."});
                }
                else
                {
                    db.collection("candidates").insertOne({"name":req.body.name,"email":req.body.email,"first_round":0,"second_round":0,"third_round":0},function(err,result2){
                        if(err) 
                        {
                            console.log(err);
                            res.send({"status":"error","msg":""+err+""});
                        }
                        else
                        {
                            console.log(""+req.body.email+"  is successfully registerd.");
                            console.log("result2",result2);
                            res.send({"code":"success","msg":""+req.body.email+" is successfully registered.","result":result2});
                        }
                    });
                }
            }
            });
        }
        });
    });

// displaying candidates list
app.get("/candidatesList", function(req, res)
    {
    
    client.connect(function(err,client){
        if(err) 
        {
           console.log(err);
           res.send({"status":"error","msg":""+err+""});
        }
        else
        {
            const db=client.db(dbName);
            db.collection("candidates").find().toArray(function(err,result){
            if(err) 
            {
                console.log(err);
                res.send({"status":"error","msg":""+err+""});
            }
            else
            {
                if(result.length>0)
                {
                    console.log("Displaying candidates list.",result);
                    res.send({"status":"success","msg":"Displaying candidates list.","result":result});
                }
                else
                {
                    console.log("no candidate present in database.Please add candidates.");
                    res.send({"status":"error","msg":"no candidate present in database.Please add candidates."});
                }
            }
            });
        }
        });
    });

//storing candidate test score
app.post("/testScore", function(req, res)
    {

    client.connect(function(err,client){
        if(err) 
        {
           console.log(err);
           res.send({"status":"error","msg":""+err+""});
        }
        else
        {
            const db=client.db(dbName);
            
            //before updating test score, checking whether candidate exist in database or not
            db.collection("candidates").findOne({email:req.body.email},function(err,result){
                if(err) 
                {
                    console.log(err);
                    res.send({"status":"error","msg":""+err+""});
                }
                else
                {
                    if(result)
                    {
                        //updating first_round score
                        if(req.body.test_round==="first_round")
                        {
                            db.collection("candidates").updateOne({email:req.body.email},{$set:{first_round:req.body.test_score}},function(err,result){
                                if(err) 
                                {
                                    console.log(err);
                                    res.send({"status":"error","msg":""+err+""});
                                }
                                else
                                {
                                    if(result)
                                    {
                                        console.log("test score updated for "+req.body.test_round+".");
                                        console.log(result);
                                        res.send({"status":"success","msg":"test score updated for "+req.body.test_round+".","result":result});
                                    }
                                    else
                                    {
                                        console.log("unable to update test score due to some reason.")
                                        res.send({"status":"error","msg":"unable to update test score due to some reason."});
                                    }
                                }
                            }); 
                        }

                        //updating second_round score
                        if(req.body.test_round==="second_round")
                        {
                            db.collection("candidates").updateOne({email:req.body.email},{$set:{second_round:req.body.test_score}},function(err,result){
                                if(err) 
                                {
                                    console.log(err);
                                    res.send({"status":"error","msg":""+err+""});
                                }
                                else
                                {
                                    if(result)
                                    {
                                        console.log("test score updated for "+req.body.test_round+".");
                                        console.log(result);
                                        res.send({"status":"success","msg":"test score updated for "+req.body.test_round+".","result":result});
                                    }
                                    else
                                    {
                                        console.log("unable to update test score due to some reason.")
                                        res.send({"status":"error","msg":"unable to update test score due to some reason."});
                                    }
                                }
                            }); 
                        }

                        //updating third_round score
                        if(req.body.test_round==="third_round")
                        {
                            db.collection("candidates").updateOne({email:req.body.email},{$set:{third_round:req.body.test_score}},function(err,result){
                                if(err) 
                                {
                                    console.log(err);
                                    res.send({"status":"error","msg":""+err+""});
                                }
                                else
                                {
                                    if(result)
                                    {
                                        console.log("test score updated for "+req.body.test_round+".");
                                        console.log(result);
                                        res.send({"status":"success","msg":"test score updated for "+req.body.test_round+".","result":result});
                                    }
                                    else
                                    {
                                        console.log("unable to update test score due to some reason.")
                                        res.send({"status":"error","msg":"unable to update test score due to some reason."});
                                    }
                                }
                            }); 
                        }
                    }
                    else
                    {
                        console.log("no candidate found with this email id.")
                        res.send({"status":"error","msg":"no candidate found with this email id."});
                    }
                }
            });

        }
    });
    });

// calculating average score in all three rounds
app.get("/average", function(req, res)
{

client.connect(function(err,client){
    if(err) 
    {
       console.log(err);
       res.send({"status":"error","msg":""+err+""});
    }
    else
    {
        const db=client.db(dbName);
        db.collection("candidates").find().toArray(function(err,result){
            if(err) 
            {
                console.log(err);
                res.send({"status":"error","msg":""+err+""});
            }
            else
            {
                if(result.length>0)
                {
                let x=result;
                x.map(n=>n.avg_score=((n.first_round+n.second_round+n.third_round)/3));
                console.log("x",x);
                res.send({"status":"success","msg":"displaying details of all candidates along with their average marks.","result":x});
                }
                else
                {
                    console.log("no candidate present in database.Please add candidates.");
                    res.send({"status":"error","msg":"no candidate present in database.Please add candidates."});
                }
            }
        });
    }
    });
});

// searching highest scoring candidate
app.get("/highestScore", function(req, res)
{

client.connect(function(err,client){
    if(err) 
    {
       console.log(err);
       res.send({"status":"error","msg":""+err+""});
    }
    else
    {
        const db=client.db(dbName);
        db.collection("candidates").find().toArray(function(err,result){
            if(err) 
            {
                console.log(err);
                res.send({"status":"error","msg":""+err+""});
            }
            else
            {
                if(result.length>0)
                {
                let x=result;
                x.map(n=>n.avg_score=((n.first_round+n.second_round+n.third_round)/3));
                let y=x.reduce((acc,curr)=>findMaxScoringCandidate(acc,curr));
                console.log("y",y);
                res.send({"status":"success","msg":"displaying details of highest scoring candidate.","result":y});
                }
                else
                {
                    console.log("no candidate present in database.Please add candidates.");
                    res.send({"status":"error","msg":"no candidate present in database.Please add candidates."});
                }
            }
        });
    }
    });
});

function findMaxScoringCandidate(acc,curr){
    if(curr.avg_score>acc.avg_score)
    return curr;
    else 
    return acc;
}