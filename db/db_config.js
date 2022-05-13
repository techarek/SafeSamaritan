const sqlite3 = require('sqlite3');
const axios = require('axios');
let sqlDb;

// name the columns of our tables for localization
const userColumnNames = {
  userId: "userId",
  username: "username",
  userType: "userType",
  businessAccount: 1,
  generalAccount: 0, 
  governmentAccount: 2,
  email: "email",
  password: "password",
  accountPending: "accountPending",
  userFavorite: "userFavorite", 
  userNotifiedBy: "userNotifiedBy"
};

const businessColumnNames = {
  businessId: "businessId",
  businessName: "businessName",
  businessAddress: "businessAddress",
  businessPhone: "businessPhone",
  businessOpenStatus: "businessOpen",
  businessSalesOptions: "salesOptions",
  businessWebsite: "website",
  businessFacebook: "facebook",
  businessTwitter: "twitter",
  businessInstagram: "instagram", 
  businessType: "businessType",
  businessOwner: "owner",
};

const businessFiltersColumnNames = {
  masksRequired: "masksRequired", 
  sociallyDistanced: "sociallyDistanced",
  handWashingAvailable: "handWashing",
  handSanitizerAvailable: "handSanitizer",
  sneezeGuardsUsed: "sneezeGuards",
  indoorDining: "indoorDining",
  outdoorDining: "outdoorDining",
  takeout: "takeout",
  delivery: "delivery",
  seniorHours: "seniorHours",
}
  
const messageColumnNames = {
  notificationId: "notificationId",
  authorId: "authorId", 
  recipients: "recipients", 
  messageContent: "messageContent", 
  messageDate: "date", 
  requestId: "requestId", 
  requesterId: "requester",
  requesterBusiness: "requesterBusiness",
  reportId: "reportId",
  reportedBusinessId: "reportedBusinessId",
  reporterType: "reporterType", 
  reportAttachedFile: "reportAttachedFile",
  reportMaskInfraction: "maskInfraction",
  reportSocialDistancing: "socialDistancingInfraction",
  reportOtherInfraction: "otherInfraction",
};

Object.freeze(userColumnNames);
Object.freeze(businessColumnNames);
Object.freeze(messageColumnNames);
Object.freeze(businessFiltersColumnNames);

function createDb() {
  sqlDb = new sqlite3.Database('samaritan.db', function() {
    sqlDb.exec('PRAGMA foreign_keys = ON;', function(error)  {
      if (error){
          console.error("Pragma statement didn't work.")
      } else {
          console.log("Foreign Key Enforcement is on.")
      }
    });
    createUserTable();
    createNotificationsTable();
    createReportsTable();
    createRequestsTable();
    createUserNotifiedByTable();
    createUserFavoritesTable();
    createBusinessTable();
    createBusinessOwnerTable();
    createBusinessPropertiesTable();
  });
  console.log("created our db!");
};

function createUserTable(){
  sqlDb.run(`CREATE TABLE IF NOT EXISTS users (
    ${userColumnNames.userId} INTEGER PRIMARY KEY AUTOINCREMENT,
    ${userColumnNames.username} TEXT NOT NULL UNIQUE,
    ${userColumnNames.email} TEXT NOT NULL UNIQUE,
    ${userColumnNames.password} TEXT NOT NULL,
    ${userColumnNames.accountPending} BOOLEAN NOT NULL,
    ${userColumnNames.userType} INTEGER NOT NULL
  )`);
}

function createBusinessTable(){
  sqlDb.run(`CREATE TABLE IF NOT EXISTS businesses (
    ${businessColumnNames.businessId} INTEGER PRIMARY KEY AUTOINCREMENT,
    ${businessColumnNames.businessAddress} TEXT NOT NULL,
    ${businessColumnNames.businessName} TEXT NOT NULL,
    ${businessColumnNames.businessOpenStatus} BOOLEAN NOT NULL,
    ${businessColumnNames.businessPhone} TEXT,
    ${businessColumnNames.businessSalesOptions} TEXT,
    ${businessColumnNames.businessWebsite} TEXT,
    ${businessColumnNames.businessFacebook} TEXT,
    ${businessColumnNames.businessTwitter} TEXT,
    ${businessColumnNames.businessInstagram} TEXT,
    ${businessColumnNames.businessType} TEXT
  )`);
}

function importCambridgeDB() {
  axios
    .get("https://data.cambridgema.gov/resource/9q33-qjp4.json", {})
    .then((res) => {
      // handle success
      for (let business of res.data) {
        let name = business.name.replace("'", "''");
        let status = business.status === "Open" ? true : false;
        let address = business.phone.replace("'", "''");
        let facebook = business.facebook ? business.facebook.url.replace("'", "''") : '';
        let twitter = business.twitter ? business.twitter.url.replace("'", "''") : '';
        let instagram = business.instagram ? business.instagram.url.replace("'", "''") : '';

        let masksRequired = Math.floor(Math.random() * 2);
        let sociallyDistanced = Math.floor(Math.random() * 2);
        let handWashing = Math.floor(Math.random() * 2);
        let handSanitizer = Math.floor(Math.random() * 2);
        let sneezeGuard = Math.floor(Math.random() * 2);
        let indoorDining = Math.floor(Math.random() * 2);
        let outdoorDining = Math.floor(Math.random() * 2);
        let takeout = Math.floor(Math.random() * 2);
        let delivery = Math.floor(Math.random() * 2);
        let seniorHours = Math.floor(Math.random() * 2);

        sqlDb.run(`INSERT INTO businesses 
          (${businessColumnNames.businessAddress}, ${businessColumnNames.businessName}, 
          ${businessColumnNames.businessOpenStatus}, ${businessColumnNames.businessFacebook}, 
          ${businessColumnNames.businessTwitter}, ${businessColumnNames.businessInstagram} ) VALUES 
          ('${address}', '${name}', ${status}, '${facebook}', '${twitter}', '${instagram}');`, () => {
        sqlDb.run(`INSERT INTO businessProperties 
          (${businessColumnNames.businessId}, ${businessFiltersColumnNames.masksRequired}, ${businessFiltersColumnNames.sociallyDistanced}, ${businessFiltersColumnNames.handWashingAvailable}, 
          ${businessFiltersColumnNames.handSanitizerAvailable}, ${businessFiltersColumnNames.sneezeGuardsUsed} ) VALUES 
          ((SELECT ${businessColumnNames.businessId} FROM businesses WHERE ${businessColumnNames.businessAddress} == '${address}' 
          AND ${businessColumnNames.businessName} == '${name}'),
          ${masksRequired}, ${sociallyDistanced}, ${handWashing}, ${handSanitizer}, ${sneezeGuard});`, () => {
        for (i = 0; i < Math.floor(Math.random() * 100); i++) {
          let maskInfraction = Math.floor(Math.random() * 2);
          let socialDistancing = Math.floor(Math.random() * 2);
          let otherInfraction = Math.floor(Math.random() * 2);
          let daysPrior = Math.floor(Math.random() * 7);
          sqlDb.run(`INSERT INTO reports (${messageColumnNames.messageDate}, ${messageColumnNames.messageContent},
            ${messageColumnNames.reportedBusinessId},${messageColumnNames.reporterType},${messageColumnNames.reportAttachedFile},
            ${messageColumnNames.reportMaskInfraction},${messageColumnNames.reportSocialDistancing},
            ${messageColumnNames.reportOtherInfraction}) VALUES 
            (date('now','-${daysPrior} day'), 'Random message content', 
            (SELECT ${businessColumnNames.businessId} FROM businesses WHERE ${businessColumnNames.businessAddress} == '${address}' AND ${businessColumnNames.businessName} == '${name}'), 
            'Why is reporterType not an enum? Shouldn''t this be == to account type (integer)?', 
            '', ${maskInfraction}, ${socialDistancing}, ${otherInfraction});`);
        }
        });});
      }
    })
    .catch((err) => {
      console.log("ERROR. Cambridge DB was not able to be imported: " +  err);
    });
}


function createBusinessPropertiesTable(){
  let createTable = () => sqlDb.run(`CREATE TABLE IF NOT EXISTS businessProperties (
    ${businessColumnNames.businessId} INTEGER NOT NULL,
    ${businessFiltersColumnNames.masksRequired} BOOLEAN,
    ${businessFiltersColumnNames.sociallyDistanced} BOOLEAN,
    ${businessFiltersColumnNames.handWashingAvailable} BOOLEAN,
    ${businessFiltersColumnNames.handSanitizerAvailable} BOOLEAN,
    ${businessFiltersColumnNames.sneezeGuardsUsed} BOOLEAN,
    ${businessFiltersColumnNames.indoorDining} BOOLEAN,
    ${businessFiltersColumnNames.outdoorDining} BOOLEAN,
    ${businessFiltersColumnNames.takeout} BOOLEAN,
    ${businessFiltersColumnNames.delivery} BOOLEAN,
    ${businessFiltersColumnNames.seniorHours} BOOLEAN,
    CONSTRAINT fk_${businessColumnNames.businessId}
            FOREIGN KEY(${businessColumnNames.businessId})
            REFERENCES businesses(${businessColumnNames.businessId}) ON DELETE CASCADE
  )`);
  sqlDb.run('SELECT COUNT(*) FROM businessProperties', (err) => {
    if (err) {
      createTable();
      importCambridgeDB();
    }
  });
}
function createBusinessOwnerTable(){
  sqlDb.run(`CREATE TABLE IF NOT EXISTS businessOwners (
    ${businessColumnNames.businessOwner} INTEGER NOT NULL,
    ${businessColumnNames.businessId} INTEGER NOT NULL,
    CONSTRAINT fk_${businessColumnNames.businessOwner}
            FOREIGN KEY(${businessColumnNames.businessOwner})
            REFERENCES users(${userColumnNames.userId}) ON DELETE CASCADE,
    CONSTRAINT fk_${businessColumnNames.businessId}
            FOREIGN KEY(${businessColumnNames.businessId})
            REFERENCES businesses(${businessColumnNames.businessId}) ON DELETE CASCADE  
  )`);
}

function createNotificationsTable(){
  sqlDb.run(`CREATE TABLE IF NOT EXISTS notifications (
    ${messageColumnNames.notificationId} INTEGER PRIMARY KEY AUTOINCREMENT,
    ${messageColumnNames.recipients} TEXT NOT NULL,
    ${messageColumnNames.messageContent} TEXT NOT NULL,
    ${messageColumnNames.messageDate} DEFAULT CURRENT_TIMESTAMP,
    ${messageColumnNames.authorId} INTEGER NOT NULL,
    CONSTRAINT fk_${messageColumnNames.authorId}
            FOREIGN KEY(${messageColumnNames.authorId})
            REFERENCES users(${userColumnNames.userId}) ON DELETE CASCADE    
  )`);
}

function createReportsTable(){
  sqlDb.run(`CREATE TABLE IF NOT EXISTS reports (
    ${messageColumnNames.reportId} INTEGER PRIMARY KEY AUTOINCREMENT,
    ${messageColumnNames.messageContent} TEXT NOT NULL,
    ${messageColumnNames.messageDate} DEFAULT CURRENT_TIMESTAMP,
    ${messageColumnNames.reportedBusinessId} INTEGER NOT NULL,
    ${messageColumnNames.reporterType} TEXT NOT NULL,
    ${messageColumnNames.reportAttachedFile} TEXT,
    ${messageColumnNames.reportMaskInfraction} BOOLEAN NOT NULL,
    ${messageColumnNames.reportSocialDistancing} BOOLEAN NOT NULL,
    ${messageColumnNames.reportOtherInfraction} BOOLEAN NOT NULL,
    CONSTRAINT fk_${messageColumnNames.reportedBusinessId}
            FOREIGN KEY(${messageColumnNames.reportedBusinessId})
            REFERENCES businesses(${businessColumnNames.businessId}) ON DELETE CASCADE    
  )`);
}

function createRequestsTable(){
  sqlDb.run(`CREATE TABLE IF NOT EXISTS requests (
    ${messageColumnNames.requestId} INTEGER PRIMARY KEY AUTOINCREMENT,
    ${messageColumnNames.requesterId} INTEGER NOT NULL,
    ${messageColumnNames.messageContent} TEXT NOT NULL,
    ${messageColumnNames.messageDate} DEFAULT CURRENT_TIMESTAMP,
    ${messageColumnNames.requesterBusiness} TEXT NOT NULL,
    CONSTRAINT fk_${messageColumnNames.requesterId}
            FOREIGN KEY(${messageColumnNames.requesterId})
            REFERENCES users(${userColumnNames.userId}) ON DELETE CASCADE,
    CONSTRAINT fk_${messageColumnNames.requesterBusiness}
            FOREIGN KEY(${messageColumnNames.requesterBusiness})
            REFERENCES businesses(${businessColumnNames.businessId}) ON DELETE CASCADE        
  )`);
}

function createUserFavoritesTable(){
  sqlDb.run(`CREATE TABLE IF NOT EXISTS favorites (
    ${userColumnNames.userId} INTEGER NOT NULL,
    ${userColumnNames.userFavorite} INTEGER NOT NULL,
    CONSTRAINT fk_${userColumnNames.userId}
            FOREIGN KEY(${userColumnNames.userId})
            REFERENCES users(${userColumnNames.userId}) ON DELETE CASCADE,
    CONSTRAINT fk_${userColumnNames.userFavorite}
            FOREIGN KEY(${userColumnNames.userFavorite})
            REFERENCES businesses(${businessColumnNames.businessId }) ON DELETE CASCADE     
  )`);
}

function createUserNotifiedByTable(){
  sqlDb.run(`CREATE TABLE IF NOT EXISTS userNotifications (
    ${userColumnNames.userId} INTEGER NOT NULL,
    ${userColumnNames.userNotifiedBy} INTEGER NOT NULL,
    CONSTRAINT fk_${userColumnNames.userId}
            FOREIGN KEY(${userColumnNames.userId})
            REFERENCES users(${userColumnNames.userId}) ON DELETE CASCADE,
    CONSTRAINT fk_${userColumnNames.userNotifiedBy}
            FOREIGN KEY(${userColumnNames.userNotifiedBy})
            REFERENCES businesses(${businessColumnNames.businessId }) ON DELETE CASCADE     
  )`);
}

// Helper wrapper functions that return promises that resolve when sql queries are complete.

function run(sqlQuery) {
  return new Promise((resolve, reject) => {
    sqlDb.run(sqlQuery, (err) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve();
      }
    })
  });
};

function get(sqlQuery) {
  return new Promise((resolve, reject) => {
    sqlDb.get(sqlQuery, (err, row) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(row);
      }
    })
  });
};

function all(sqlQuery) {
  return new Promise((resolve, reject) => {
    sqlDb.all(sqlQuery, (err, rows) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  });
};

createDb();

module.exports = {
  userColumnNames,
  businessColumnNames, 
  businessFiltersColumnNames, 
  messageColumnNames,
  get,
  all,
  run,
};