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

    // UPDATE THE BOOK (ALTERNATIVE)
    app.put('/api/updateHSL/:hsl_id', function(req, res){
        HSL.update({ _id: req.params.hsl_id }, { $set: req.body }, function(err, output){
        if(err) res.status(500).json({ error: 'database failure' });
        console.log(output);
        if(!output.n) return res.status(404).json({ error: 'hsl not found' });
        res.json( { message: 'hsl updated' } );
    })
});
}