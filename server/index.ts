import express = require('express');
import path = require('path');
import bodyParser = require("body-parser");

const DIST_DIR = path.join(__dirname, "../dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");
const FAVICON = path.join(__dirname, "..", "static", "img", "favicon.ico");
const DEFAULT_PORT = 3000;

const app = express();

const jsonParser = bodyParser.json();

app.set("port", process.env.PORT || DEFAULT_PORT);
app.set("json spaces", 2);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Pass to next layer of middleware
    next();
});

const server = app.listen(app.get("port"), () => {
    console.log("Server Started");
    server.keepAliveTimeout = 0;
});

/**
 * Production switcher
 */
if (process.env.NODE_ENV === "development") {
    /**
     * DEVELOPMENT
     */
    app.get("/", (req, res) => res.send("Development Mode!"));
    app.get("/favicon.ico", (req, res) => res.send());
} else {
    /**
     * PRODUCTION
     */
    app.use(express.static(DIST_DIR));
    app.get("/", (req, res) => res.sendFile(HTML_FILE));
    app.get("/favicon.ico", (req, res) => res.sendFile(FAVICON));
}



/**
 * Import and configure the ATP route.
 */
import {size, prepare} from "./database-operations/atp/atp";

app.get("/api/v1/prepare", prepare);
app.get("/api/v1/size", size);

/**
 * Import handlers separately
 */
import {
    generateSelectHandler
} from "./database-operations/atp/atp";

app.post("/api/v1/transfer-orders", jsonParser, generateSelectHandler("transferOrders"));
app.post("/api/v1/atp-on-date", jsonParser, generateSelectHandler("atpOnDate"));
app.post("/api/v1/tracking-inventory-as-timelines", jsonParser, generateSelectHandler("trackingInventoryAsTimelines"));
app.post("/api/v1/inventory-on-date", jsonParser, generateSelectHandler("inventoryOnDate"));
app.post("/api/v1/proposed-order", jsonParser, generateSelectHandler("proposedOrder"));
app.post("/api/v1/order-atp", jsonParser, generateSelectHandler("orderATP"));
app.post("/api/v1/line-item-atp", jsonParser, generateSelectHandler("lineItemATP"));

import {
    addQuickCheckLine,
    deleteTimelineDates,
    addResultDate,
    addResultDates,
} from "./database-operations/atp/atp";

app.post("/api/v1/add-quick-check-line", jsonParser, addQuickCheckLine);
app.post("/api/v1/delete-timeline-dates", jsonParser, deleteTimelineDates);


app.post("/api/v1/add-result-date", jsonParser, addResultDate);
app.post("/api/v1/add-result-dates", jsonParser, addResultDates);
