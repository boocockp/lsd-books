LSD Books
=========

A simple but complete and usable bookkeeping application built with the [Lightweight Software Development](https://github.com/lightweight-software-development/lsd-overview) approach.  

It is intended as an example of how to build applications in this way, and it could be copied and used as a starting template for a new application.

## Project structure

The contents of the various directories are:

### `main`
The JavaScript code for the model (shared with the Promoter - see below) and the views (only used in the browser app).

The single html page to load the app and the application-specific CSS files also live here.
 
### `test`
Unit tests for the model classes, and browser-based functional tests for the whole application

### `lambda`
The promoter function to promote the user updates to the shared area (see [Data Storage](#Data_storage) below).
This uses a standard function from [LSD Storage](https://github.com/lightweight-software-development/lsd-storage), 
but it needs to pass in the model for this application.

### `deploy`
The code to define and deploy the application to a website in S3 with the associated roles, Cognito pool and Lambda functions.
This uses the [LSD AWS](https://github.com/lightweight-software-development/lsd-aws) module, and the documentation
for that explains more about what the files in this directory do.

## Data storage
Data updates are stored in browser storage and S3 - see [LSD Storage](https://github.com/lightweight-software-development/lsd-storage). 
The application is intended for multi-user use, so it uses the dual data area approach to share updates between users.  This
needs the Lambda function defined in the `lambda` directory.

##Building the application
There are separate builds for the browser application and the promoter Lambda function, both using [Webpack](http://webpack.github.io/).

They can be run with the scripts defined in `package.json`.