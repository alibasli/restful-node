//Dependencies
var express    = require('express');
var monk = require("monk"); 
var bodyParser = require('body-parser'); 
var morgan     = require('morgan');
var should = require("should"); 

// configurations

var app        = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var db = monk('localhost/InformatonOfStudents');
should.exists(db);
var collection = db.get("Students");
should.exists(collection);

var router = express.Router();
app.use('/RestAPI', router);

var port=8080;
app.listen(port);
console.log('Listening ' + port);

// Routes
router.use(function(req, res, next) {
	console.log('came a request to Rest api...');
	next();
});



//for GET http://localhost:8080/RestAPI requests

router.get('/', function(req, res) {
	res.json({ message: 'Rest API Working... ' });
});

router.route('/Ogrenciler')

	.post(function(req, res) {

        var kayit= {
            "studentNo": req.body.ogrenciNo,
            "name": req.body.adi,
            "lastName": "stemford",
            "phone": {
                "cell": "12345678",
                "home": "87654321"
            }
        }
        collection.insert(kayit, function(err, doc){
            if(err)
            {
                console.log("Error");
            }
            else
            {
                console.log("added - ");
            }
        });
		
	})

    // select  operation (all rows)
	.get(function(req, res) {
        collection.find({}, { limit : 10 }, function (err, docs){
            /*for(i=0;i<docs.length;i++)
                console.log(docs[i]);
            });*/
		    res.json(docs);
		});
	});
router.route('/Ogrenciler/:ogrenciNo')
    // select  operation (ogrenciNo)
	.get(function(req, res) {
        console.log(req.params.ogrenciNo);
        collection.find({ogrenciNo:req.params.ogrenciNo},{ }, function (err, doc){
			if (err)
				res.send(err);
			res.json(doc);
		});
	})

    // update  operation (ogrenciNo)
	.put(function(req, res) {
        console.log(req.body.adi+' '+req.params.ogrenciNo);
        var yeniKayit= {
            "ogrenciNo": req.params.ogrenciNo,
            "adi": req.body.adi,
            "soyadi": "Sam",
            "telefon": {
                "ev": "12345678",
                "is": "87654321"
            }
        }

        collection.update({ogrenciNo:req.params.ogrenciNo}, yeniKayit);

            res.json({ message: 'updated!' });
    })

    // delete  operation (ogrenciNo)
	.delete(function(req, res) {
        collection.remove({ogrenciNo:req.params.ogrenciNo}, function (err){
            if (err) throw err;

        res.json({ message: 'deleted!' });
        })

});
