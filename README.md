# nd125

This project creates and serves a website for the 125 year anniversary of North
Dakota. This website is programmed using NodeJS, a JavaScript server library, and
connects with ArcGIS servers housed by the University of North Dakota (UND) to
show different maps representing different data throughout North Dakota's
history.

## Preinstallation

This project should run on any machine. However, it has only been thoroughly
tested on Linux and Mac OS X.

- Install [NodeJS](https://nodejs.org/en/)
- Clone the [nd125 repository](https://github.com/UND-CSCI491/nd125)
- Enter the nd125 repository
- Run `npm install` to install all dependencies
- Run `node database.js` to populate the local database

## Running the development server

A local instance of the server can be ran to see all changes made to the code.
Simply run `node server.js` and you're up and running! To see the website, open a browser and go to [http://localhost:8005](http://localhost:8005).

## Installing on Ubuntu for automatic server

A script has been supplied to allow the server to automatically start on an
Ubuntu server. This file is `ndatlas.dev.conf`. See the script for more
information.

- Copy `ndatlas.dev.conf` to `/etc/init/ndatlas.dev.conf`
- Run `service ndatlas.dev start/stop/restart`
