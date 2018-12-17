# Project Onboard
Project Onboard is an experimental web application that allows you to create, view, modify and delete user information via an administration portal.
You can onboard these users on your platform using Email and SMS available via some platform integrations

## Screenshots
Admin Portal
![Alt text](/screenshots/Portal.png?raw=true "Admin Portal")

Add a User
![Alt text](/screenshots/AddUser.png?raw=true "Add a User")

View User Info
![Alt text](/screenshots/UserInfo.png?raw=true "View User Info")

SMS Integration
![Alt text](/screenshots/SMSGateways.png?raw=true "SMS Integration")

Email Integration
![Alt text](/screenshots/EmailSMTP.png?raw=true "Email Integration")

## Prerequisites
You will need to setup a Mongo DB instance as a backend database. You can deploy one for free with [mlab](https://mlab.com).
Create a .env file in the root folder with the following parameters:
```
PORT=<Your Web Server Port>
DATABASEURI=<Your Mongo DB instance>
SHARED_SECRET=<Shared Secret for Node Express Session>
```

## Installation
Install the application
```
npm install
```
Start the application
```
npm start
```

## Built With
* [Express Node.js](https://expressjs.com)
* [React](https://reactjs.org)
* [Redux](https://redux.js.org)
* [Semantic-UI](https://semantic-ui.com)


