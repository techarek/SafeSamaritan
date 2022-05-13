
# [The Safe Samaritan](https://the-safe-samaritan.herokuapp.com/)
## Built by SAUS
### Purpose and Functionality
Our team built The Safe Samaritan, a quick and easy to use web application to provide accurate information about businesses in the Cambridge/Boston area. With The Safe Samaritan, users can view and filter businesses by their safety and health preferences as well as using the platform for accountability; users can make quicker and better-informed decisions. 

### Instructions to Run Locally:
In command line:
```console
$ npm run build
$ npm run serve
```
In a separate shell:
```console
$ npm run awesome
```
then you will find the application at `localhost:8080` in the browser

# API Documentation
## `users.js` routes 
```
/**
 * Create a new user account 
 * 
 * @name POST /api/users/createAccount 
 * 
 * @status 409 upon reading existing credentials (i.e. username or email) 
 * @status 201 when account successfully created 
 * @status 500 for any unforeseen errors 
 */

/**
 * Sign in and create an authentication session
 * 
 * @name POST /api/users/signin
 * 
 * @status 404 if unable to match username 
 * @status 400 if incorrect credentials
 * @status 201 when successfully signed in 
 * @status 500 for any unforeseen errors 
 */

/**
 * Sign the user out
 *
 * @name DELETE /api/users/signout
 * 
 * @status 200 when successfully signed out 
 * @status 500 for any unforeseen errors 
 */

/**
 * Delete a user account
 *
 * @name DELETE /api/users/deleteAccount
 *
 * @status 200 when successfully deleted
 * @status 500 if unsuccessfully deleted or for any unforeseen errors 
 */

/**
 * Change a user's password
 *
 * @name PUT /api/users/change-password
 *
 * @status 200 when successfully changed
 * @status 401 if non-matching password verification 
 * @status 500 for any unforeseen errors 
 */

/**
 * Change a user's username
 *
 * @name PUT /api/users/change-username
 *
 * @status 200 when successfully changed
 * @status 500 for any unforeseen errors 
 */
```

## `messages.js` routes 
```
**
 * Resolve a report
 * 
 * @name POST /api/messages/report/resolve
 *
 * @status 201 if report successfully resolved
 * @status 500 for any unforeseen errors
 */

**
 * Resolve a request
 * 
 * @name POST /api/messages/request/resolve
 *
 * @status 201 if report successfully resolved
 * @status 500 for any unforeseen errors
 */

/**
 * Create a new notification post 
 * 
 * @name POST /api/messages/notification 
 * 
 * @status 400 if missing necessary information 
 * @status 401 if no authorization 
 * @status 201 if successfully created notification 
 * @status 500 for any unforeseen errors
 */ 

/**
 * Check current user’s notification settings aka if they are subscribed to receiving notifications from a business
 * 
 * @name POST /api/messages/notification/settings
 * 
 * @status 404 if business from which the notification comes from does not exist 
 * @status 200 if notifications are successfully checked and retrieved 
 * @status 500 for any unforeseen errors
 */ 

/**
 * Update current user’s notification settings
 * 
 * @name POST /api/messages/notification/update
 * 
 * @status 404 when business from which a notification is received does not exist 
 * @status 200 if notification settings successfully updated 
 * @status 500 for any unforeseen errors
 */ 

/** 
 * Create a new request 
 * 
 * @name POST /api/messages/request 
 *
 * @status 400 if missing necessary information or no authorization or if unsuccessfully creates request
 * @status 403 if unauthorized to make a request 
 * @status 201 if successfully created request
 * @status 500 for any unforeseen errors
 */

/** 
 * Create a new report
 * 
 * @name POST /api/messages/report  
 * 
 * @status 400 if missing necessary information or no authorization or if invalid account type 
 * @status 403 if unauthorized to send a report 
 * @status 404 if cannot find business the user wants to report 
 * @status 201 if successfully created report
 * @status 500 for any unforeseen errors
 */

/** 
 * Get all messages sent to user 
 * 
 * @name GET /api/messages/ 
 * 
 * @status 201 if successfully gets messages
 * @status 500 for any unforeseen errors
 */
```

## `map.js` routes
```
/*
 * Call upon the Google geocoding API to get coordinates from addresses
 *
 * @name GET /api/map/:formattedAddress
 * 
 * @status 201 if coordinates successfully retrieved
 * @status 500 if coordinates are not retrieved
 */
```

## `businesses.js` routes 
```
/*
 * Have current user claim business
 *
 * @name PUT /api/businesses/claim 
 * 
 * @status 401 when invalid account type 
 * @status 409 if business is already claimed 
 * @status 201 if business successfully claimed 
 * @status 500 for any unforeseen errors 
 */

/*
 * Retrieve a filtered list of businesses 
 * Retrieves all businesses if query is empty 
 *
 * @name GET /api/businesses
 * 
 * @status 200 when business are successfully retrieved 
 * @status 500 for any unforeseen errors 
 */

/*
 * Retrieve a list of claimed businesses
 *
 * @name GET /api/businesses/claimed
 * 
 * @status 200 if successfully fetches the claimed businesses 
 * @status 503 for any unforeseen errors
 */

/*
 * Retrieve a filtered list of businesses based on a set of criteria/queries
 *
 * @name GET /api/businesses/applyFilters 
 * 
 * @status 200 if successfully fetches the matching businesses 
 * @status 500 for any unforeseen errors
 */

/*
 * Have current user star business 
 *
 * @name PUT /api/businesses/star
 * 
 * @status 404 if business the user wants to star does not exist 
 * @status 201 if successfully stars the business 
 * @status 500 for any unforeseen errors
 */

/*
 * Retrieves current user’s starred businesses
 *
 * @name GET /api/businesses/starred
 * 
 * @status 200 if successfully fetches starred businesses 
 * @status 500 for any unforeseen errors 
 */

/**
 * Check if a business is in a user's starred businesses
 * 
 * @name POST /api/businesses/isStarred
 * @status 200 if successfully checks if a business is starred by a user
 * @status 500 for any unforseen errors
 */


/*
 * Update general business information
 *
 * @name GET /api/businesses/updateGeneral/:id
 * 
 * @status 200 if successfully updated general business information
 * @status 503 for any unforeseen errors
 */

/*
 * Update business safety information
 *
 * @name GET /api/businesses/updateSafety/:id
 * 
 * @status 200 if successfully updated safety information for a business
 * @status 503 for any unforeseen errors
 */

/*
 * Retrieves the aggregate data of business reports, separated by report type
 * Used for data visualization
 *
 * @name POST /api/businesses/reportData
 * 
 * @status 200 if successfully retrieved
 * @status 500 for any unforeseen errors
 */
```


### Authorship:
* **Sarah Vu**:
  * src
    * components/Business/*
    * components/Home/*
    * components/Login/*
    * components/Profile/*
    * components/Map.vue (adding leaflet to project)
    * Login.vue
    * Main.vue
    * Profile.vue
    * NavBar.vue
  * db
    * db_config.js (original, + refactoring) 
  * models:
    * refactoring for enums/constants across files
  * routes: 
    * refactoring for enums/constants across files
    * added to messages.js and businesses.js for favorite and subscribe
* **Arkadiusz Balata**:
  * src 
    * components/Profile/*
  * app.js
  * models:
    * Businesses.js
    * Messages.js
  * routes:
    * businesses.js
    * messages.js
    * validators.js
  * Random things in Components/ that have to do with messages
* **Uriel Guajardo**:
  * src
    * components/Skeleton.vue
    * components/Visualization/*
    * components/Business/BusinessModal.vue
  * models:
    * Users.js
  * routes:
    * users.js
    * validators.js
    * businesses.js
      * /api/businesses/reportData
* **Summer Vo**:
  * src
    * components/Skeleton.vue
    * handlers.js
    * components/Home/FilterSettings.vue
    * components/Home/Search.vue
    * components/Business/*
    * components/Profile/UserSettings.vue
  * models:
    * Messages.js
    * Businesses.js
  * routes:
    * messages.js
    * businesses.js 

