var express = require('express');
var router = express.Router();

const app = express();
var cors = require('cors');
router.use(cors())

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const dbPath = path.resolve(__dirname, 'data.db')
let db1 = new sqlite3.Database(dbPath);



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/databack", (req, res, next) => {
  var sql = "select * from langs"
  var params = []
  db1.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
  });

});
 router.post('/send', (req, res, next) => {
    db1.run('DROP TABLE IF EXISTS langs;');
    db1.run('CREATE TABLE IF NOT EXISTS langs(name text)');
    console.log(req.body)
    var ar = req.body.name.split(', ');
    console.log(ar);
  var errors=[]
  if (!req.body.name){
    errors.push("No Words specified");
}
if (errors.length){
  res.status(400).json({"error":errors.join(",")});
  return;
}
  var data = {
    name: req.body.name
    }
    console.log(data.name);
    var sortedArray = ar.sort();
    console.log(sortedArray);
    var sortedString = sortedArray.toString();
   
    console.log(sortedString);
     db1.run(`INSERT INTO langs(name) VALUES(?)`, [sortedString], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
   
    

})

module.exports = router;
