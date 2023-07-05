const sql = require("mssql");

const User = {
    createUser: async function(user) {
      const request = new sql.Request();
      const query = `INSERT INTO Users (uid, type, name, surname, password, longitude, latitude, fullAddress, phoneNumber, email, referedBy, hasRefered)
                    VALUES ('${user.uid}', '${user.type}', '${user.name}', '${user.surname}', '${user.password}', '${user.longitude}', '${user.latitude}', '${user.fullAddress}', '${user.phoneNumber}', '${user.email}', '${user.referedBy}', '${user.hasRefered}')`;
      const result = await request.query(query);
      return result;
    },
    getUserByEmail: async function(email) {
      const request = new sql.Request();
      const query = `SELECT * FROM Users WHERE email = '${email}'`;
      const result = await request.query(query);
      return result.recordset[0]; 
    },
    getAllUsers: async function() {
      const request = new sql.Request();
      const result = await request.query('SELECT * FROM Users');
      return result.recordset;
    },

    getUserByUid: async function(uid) {
      const request = new sql.Request();
      request.input('Uid', sql.NVarChar, uid);
      const result = await request.query('SELECT * FROM Users WHERE uid = @Uid');
      return result.recordset[0];
    },

    updateUserByUid: async function(uid, updatedUser) {
      const request = new sql.Request();

      const setClause = [];
      for (const key in updatedUser) {
        if (updatedUser[key] !== undefined) {
          setClause.push(`${key} = '${updatedUser[key]}'`);
        }
      }

      if (setClause.length === 0) {
        throw new Error('No valid fields in updatedUser');
      }

      const query = `UPDATE Users SET ${setClause.join(', ')} WHERE uid = '${uid}'`;
      const result = await request.query(query);
      return result;
    },

    deleteUserByUid: async function(uid) {
      const request = new sql.Request();
      request.input('Uid', sql.NVarChar, uid);
      const result = await request.query('DELETE FROM Users WHERE uid = @Uid');
      return result.rowsAffected[0];
    },

    getUserByLocation: async function(lat, lng) {
      const request = new sql.Request();
      request.input('Lat', sql.Float, lat);
      request.input('Lng', sql.Float, lng);

      const query = `
        SELECT TOP 1 *, GEOGRAPHY::Point(Lat, Lng, 4326).STDistance(GEOGRAPHY::Point(@Lat, @Lng, 4326)) AS Distance 
        FROM Users 
        WHERE type = 'Driver' 
        ORDER BY Distance;
      `;

      const result = await request.query(query);
      return result.recordset[0];
    },

    getUserByEmail: async function(email) {
      const request = new sql.Request();
      request.input('Email', sql.NVarChar, email);
      const result = await request.query('SELECT * FROM Users WHERE email = @Email');
      return result.recordset[0];
    },

};

module.exports = User;