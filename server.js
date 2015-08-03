var express    = require('express');
var monk = require("monk"); // a framework that makes accessing MongoDb really easy
var bodyParser = require('body-parser'); //to get the parameters
var morgan     = require('morgan'); // log requests to the console
var should = require("should"); //  It keeps your test code clean, and your error messages helpful.

var app        = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var db = monk('localhost/OgrenciBilgiSistemi');
should.exists(db);
var collection = db.get("ogrenciler");
should.exists(collection);

var router = express.Router();
// root directory for all requests
app.use('/RestAPI', router);


// Start server on this port
var port=8080;
app.listen(port);
console.log('Listening ' + port);

// all requests are routed here firstly, then directed to the related route
router.use(function(req, res, next) {
	console.log('Web Servisine istek geldi...');
	next();
});

//for GET http://localhost:8080/RestAPI requests

router.get('/', function(req, res) {
	res.json({ message: 'Rest API çalışıyor... ' });
});

	//for  http://localhost:8080/RestAPI/Ogrenciler requests
	router.route('/Ogrenciler')

	// insert operation
	// curl --request POST http://localhost:8080/RestAPI/Ogrenciler --data 'ogrenciNo=00000002222&adi=Sena'
	.post(function(req, res) {

        var kayit= {
            "ogrenciNo": req.body.ogrenciNo,
            "adi": req.body.adi,
            "soyadi": "Yılmaz",
            "telefon": {
                "ev": "12345678",
                "is": "87654321"
            }
        }


        collection.insert(kayit, function(err, doc){
            if(err)
            {
                console.log("Hata");
            }
            else
            {
                console.log("eklendi - ");
            }
        });
		
	})

    // select  operation (all rows)
	// curl --request GET http://localhost:8080/RestAPI/Ogrenciler
	.get(function(req, res) {
        collection.find({}, { limit : 10 }, function (err, docs){
            /*for(i=0;i<docs.length;i++)
                console.log(docs[i]);
            });*/
		    res.json(docs);
		});
	});

	//for  http://localhost:8080/RestAPI/Ogrenciler/ogrenciNo requests
	// curl --request GET http://localhost:8080/RestAPI/Ogrenciler/00000000003

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
	//curl --request PUT http://localhost:8080/RestAPI/Ogrenciler --data 'ogrenciNo=00000002222&adi=Sena'
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

            res.json({ message: 'Güncelleme işlemi başarılı' });
    })


   	// delete  operation (ogrenciNo)
	// curl --request DELETE http://localhost:8080/RestAPI/Ogrenciler/00000000003
	.delete(function(req, res) {
        collection.remove({ogrenciNo:req.params.ogrenciNo}, function (err){
            if (err) throw err;

        res.json({ message: 'Silme işlemi başarılı' });
        })

});
