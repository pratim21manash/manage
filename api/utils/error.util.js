class AppError extends Error{
    constructor(message, statusCode = 500){
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}


const TryError = (message, statusCode = 500) => {
    return new AppError(message, statusCode)
}


const CatchError = (err, res, prodMessage = "Internal server error") => {
    if(err.code === 11000){
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            message: `${field} already exists`,
        });
    }

    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map((e) => e.message)
        return res.status(400).json({
            message: message[0]
        })
    }

    if(err.name === "CastError"){
        return res.status(400).json({
            message: "Invalid ID format"
        })
    }

    if(err instanceof AppError){
        const message = process.env.NODE.ENV === "dev" ? err.message : prodMessage;
        return res.status(err.statusCode).json({message})
    }

    console.log("Unhandled error:", err);
    return res.status(500).json({message: prodMessage})
}


export {
    AppError,
    TryError,
    CatchError
}
