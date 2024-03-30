import express from 'express';
import 'express-async-errors'
import cookieSession from "cookie-session";
import {json} from "body-parser";
import {errorHandler,NotFound, currentUser} from "@amtickets377/common"
import {createTicketRouter} from "./routes/new";
import {showTicketRouter} from "./routes/show";
import {indexTicketRouter} from "./routes";
import {updateTicketRouter} from "./routes/update";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false
    // secure: true
}));

app.use(currentUser);
app.use(indexTicketRouter);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);
app.all('*', () => {
    throw new NotFound();
})
app.use(errorHandler);

export {app};