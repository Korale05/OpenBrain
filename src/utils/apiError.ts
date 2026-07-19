

class ApiError extends Error {
    statusCode : number;
    success : boolean;
    data : null;
    errors : any[]
    constructor(
        statusCode : number,
        message : string = "Something went wrong!",
        errors : any[]= [],
        stack : string= ""
    )
    {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.data = null;
        this.errors = errors;
    }
}

export {ApiError};