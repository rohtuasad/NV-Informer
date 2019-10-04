var mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 100,
  host: "",
  user: "",
  password: "%",
  database: "",
  debug: false
});

exports.getGangsters = function(callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      callback({});
      return;
    }

    console.log("connected as id " + connection.threadId);

    connection.query("SET NAMES 'utf8mb4'", (err, response) => {
      if (err) {
        console.error(err);
      }
    });

    connection.query(
      `select g.name, s.health, s.strength, s.agility, s.charisma, s.accuracy, s.damage, s.dzen, g.tlgname from states s, gangster g, (SELECT
        gangsterid, MAX(time) as time
      FROM
        states 
      GROUP BY
        gangsterid) as ls where g.gangid in (3, 4, 5, 6) and s.time = ls.time and s.gangsterid = ls.gangsterid and s.gangsterid = g.id order by dzen desc`,
      function(err, rows) {
        connection.release();
        if (err) {
          rows = {};
        }
        callback(rows);
      }
    );

    connection.on("error", function(err) {
      callback({});
      return;
    });
  });
};

exports.getGangstersShort = function(callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      callback({});
      return;
    }

    console.log("connected as id " + connection.threadId);

    connection.query("SET NAMES 'utf8mb4'", (err, response) => {
      if (err) {
        console.error(err);
      }
    });

    connection.query(
      `select g.name, g.group_id, (s.health + s.agility + s.charisma + s.accuracy + s.damage) as bm, s.dzen from states s, gangster g, (SELECT
        gangsterid, MAX(time) as time
      FROM
        states 
      GROUP BY
        gangsterid) as ls where g.gangid in (3, 4, 5, 6) and s.time = ls.time and s.gangsterid = ls.gangsterid and s.gangsterid = g.id order by dzen desc`,
      function(err, rows) {
        connection.release();
        if (err) {
          rows = {};
        }
        callback(rows);
      }
    );

    connection.on("error", function(err) {
      callback({});
      return;
    });
  });
};
