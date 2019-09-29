var mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 100,
  host: "",
  user: "",
  password: "%",
  database: "",
  debug: false
});

exports.getGangsters = function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      res.json({ code: 100, status: "Error in connection database" });
      return;
    }

    console.log("connected as id " + connection.threadId);

    connection.query("select * from gangster", function(err, rows) {
      connection.release();
      console.log("err " + err);
      if (!err) {
        console.log(rows);
        res.json(rows);
      } else {
        res.json({});
      }
    });

    connection.on("error", function(err) {
      res.json({ code: 100, status: "Error in connection database" });
      return;
    });
  });
};
