// routes/index.js
module.exports = function(app, HSL)
{

    // GET HSLS BY URL_FROM
    app.get('/api/url_from_trigger', function(req, res){
        HSL.find({url_to : "yet"}, function(err, hsl){
            if(err) return res.status(500).json({error: err});
            if(!hsl) return res.status(404).json({error: 'hsl not found'});
            res.json(hsl);
        })
    });

    // GET HSLS BY URL_FROM
    app.get('/api/url_from_ready/:url_from(*)', function(req, res){
        HSL.find({$and:[{url_from : req.params.url_from},{url_to : {$ne : "yet"}} ]}, function(err, hsl){
            if(err) return res.status(500).json({error: err});
            if(!hsl) return res.status(404).json({error: 'hsl not found'});
            res.json(hsl);
        })
    });

    // GET HSLS BY URL_FROM
    app.get('/api/url_from/:url_from(*)', function(req, res){
        HSL.find({url_from : req.params.url_from}).sort({'published_date' : 1}).exec(
            function(err, hsl){
            if(err) return res.status(500).json({error: err});
            if(!hsl) return res.status(404).json({error: 'hsl not found'});
            res.json(hsl);
        });
    });

    app.get('/api/url_from_XPath/:XPath:url_from(*)', function(req, res){
        HSL.find({XPath : req.params.XPath, url_from : req.params.url_from}).sort({'published_date' : 1}).exec(
            function(err, hsl){
            if(err) return res.status(500).json({error: err});
            if(!hsl) return res.status(404).json({error: 'hsl not found'});
            res.json(hsl);
        });
    });




    // CREATE HSL
    app.post('/api/createHSL', function(req, res){
        var hsl = new HSL();

        hsl.url_from = req.body.url_from;
        hsl.XPath = req.body.XPath;
        hsl.parentStrIndex = req.body.parentStrIndex;
        hsl.childStrIndex = req.body.childStrIndex;
        hsl.textLength = req.body.textLength;
        hsl.published_date = req.body.published_date;
        hsl.text = req.body.text;
    
        hsl.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }
    
            res.json({result: 1});
            console.log(hsl);
        });
    });

    // UPDATE THE HSL
    app.put('/api/updateHSL/:hsl_id', function(req, res){
        HSL.findById(req.params.hsl_id, function(err, hsl){
            if(err) return res.status(500).json({ error: 'database failure' });
            if(!hsl) return res.status(404).json({ error: 'hsl not found' });
    
            if(req.body.url_to){
                hsl.url_to = req.body.url_to;
                let url_gap_length = hsl.url_to.length - hsl.url_from.length + 2;
                HSL.find({XPath : hsl.XPath, url_from : hsl.url_from,
                    published_date :{$gt : hsl.published_date},
                    parentStrIndex : {$gt : hsl.parentStrIndex}})
                .sort({'published_date' : 1}).exec(function(err, hsls){
                    for(let h in hsls){
                        hsls[h].parentStrIndex += url_gap_length;
                        hsls[h].save(function(err){
                            if(err) console.log(err);
                            else console.log("modify complete");
                        });
                    }
                    // hsls.save(function(err){
                    //     if(err) console.log(err);
                    //     else console.log("modify complete")
                    // });
                });
            } 
    
            hsl.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'hsl updated'});
            });
    
        });
    
    });
}