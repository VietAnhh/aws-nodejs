/// <reference path="../typings/index.d.ts" />
import * as express from "express";
import { join } from "path";
import * as favicon from "serve-favicon";
import { json, urlencoded } from "body-parser";

//CONFIGS
import * as env from "./config/env.config";
import * as AWS from "./config/aws.config";


//Initialize the configs
env, AWS;

//Importing moduls without the typings number
let morgan = require('morgan');


//ROUTES
import { awsrouter } from "./routes/protected";
import { UserRoute } from "./routes/user";
import { loginRoute } from "./routes/login";

//EXPRESS CONFIGS
const app: express.Application = express();


app.disable("x-powered-by");
app.use(favicon(join(__dirname, "../public", "favicon.ico")));
app.use(express.static(join(__dirname, '../public')));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));


// ROUTES
app.use("/aws-api", awsrouter);
app.use("/user-api", UserRoute);
app.use("/login", loginRoute);



app.use('/client', express.static(join(__dirname, '../client')));



// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {

    app.use(express.static(join(__dirname, '../node_modules')));

    app.use(function(err, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(err.status || 500);
        res.json({
            error: err,
            message: err.message
        });
    });
}

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next) {
    let err = new Error("Not Found");
    next(err);
});

// production error handler
// no stacktrace leaked to user
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.json({
        error: {},
        message: err.message
    });
});

export { app }
