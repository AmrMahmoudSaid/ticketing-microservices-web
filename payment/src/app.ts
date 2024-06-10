import express from 'express';
import 'express-async-errors'
import cookieSession from "cookie-session";
import {json} from "body-parser";
import {errorHandler,NotFound, currentUser} from "@amtickets377/common"
import {createChargeRouter} from "./routes/new";


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false
    // secure: true
}));

app.use(currentUser);
app.use(createChargeRouter);
app.all('*', () => {
    throw new NotFound();
})
app.use(errorHandler);

export {app};