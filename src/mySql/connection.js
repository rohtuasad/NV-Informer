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
      `select g.id, g.name, g.group_id, (s.health + s.agility + s.charisma + s.accuracy + s.damage) as bm, s.dzen from states s, gangster g, (SELECT
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

exports.getRaidTop = function(callback) {
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
      `select name, SUM(if(placed = true, 1, 0)) as placed, SUM(if(participation = true, 1, 0)) as raids from (select g.name, f.placed, f.participation from raidFact f, raid r, gangster g where 
        f.raidId = r.id and f.gangsterId = g.id and r.id > ((select max(raidid) from raidFact) - 42)) as w group by name`,
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

exports.updateGroups = function(groups, callback) {
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

    var updateQuery = "";

    for (var i = 0; i < groups.length; i++) {
      if (groups[i].length > 0) {
        var ids = [];
        groups[i].forEach(function(item, index, array) {
          ids.push(item.id);
        });
        var query = `update gangster g set g.group_id = ? where g.id in (?); `;
        updateQuery += mysql.format(query, [+i + 1, ids]);
      }
    }

    connection.query(updateQuery, function(err, rows) {
      connection.release();
      if (err) {
        console.error(err);
        rows = {};
      }
      callback({ success: true });
    });

    connection.on("error", function(err) {
      callback({});
      return;
    });
  });
};

exports.getGroupIds = function(num, callback) {
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

    var query = mysql.format(
      `select g.name, g.tlgid from gangster g where g.group_id = ? and g.gangid in (3, 4, 5, 6)`,
      num
    );
    console.log(query);
    connection.query(query, function(err, rows) {
      connection.release();
      if (err) {
        console.error(err);
        rows = {};
      }
      callback(rows);
    });

    connection.on("error", function(err) {
      callback({});
      return;
    });
  });
};
