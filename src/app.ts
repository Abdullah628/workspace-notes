import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { envVars } from "./config/env";
import notFound from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { requestPerformanceLogger, slowQueryAlert } from "./middleware/queryPerformance";

import { router } from "./routes/index";


const app = express()

// Performance monitoring middleware
app.use(requestPerformanceLogger)
app.use(slowQueryAlert(1000)) // Alert if request takes more than 1000ms

app.use(cookieParser())
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))


app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: `Welcome to buddy script System Backend`
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app