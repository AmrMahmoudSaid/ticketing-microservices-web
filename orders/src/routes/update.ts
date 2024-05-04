import express, {Request, Response} from "express";

const router = express.Router();

router.put('/api/orders/:order.ts', async (req: Request, res:Response)=>{
    res.send({});
});

export {router as updateOrderRouter};