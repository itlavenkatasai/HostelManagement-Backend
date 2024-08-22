import Jwt  from "jsonwebtoken";
export const checkAndVerify = async (req,res,next)=>{
    const {authorization} = req.headers;
    try{
        if(!authorization){
            return res.status(400).json({
                message:"authorization token is missing"
            })
        }
        const authorizationData = authorization.split(" ");
        if(authorizationData.length != 2){
            return res.status(400).json({
                message:"Invalid token"
            })
        }
        const [format,token] = authorizationData;
        if(format != 'Bearer'){
            return res.status(400).json({
                message:"invalid token format"
            })
        }
        const {TOKEN_SECRET} = process.env;
        const payload = Jwt.verify(token,TOKEN_SECRET);
        const {PhoneNumber,ClientId} = payload;
        console.log("clientId",ClientId);
        req.locals = {
            PhoneNumber,ClientId
        }
        console.log("payload",payload);
        return next();

    }catch(error){
        console.log(error.message);
        const errorMessage = error.message;
        if (errorMessage == "jwt expired") {
            return res.status(500).json({
                message: "jwt token is expired ,please login again. "
            });
        };
        if (errorMessage == "invalid signature") {
            console.log(errorMessage);
            return res.status(500).json({
                message: "wrong token is given"
            });
        };
        return res.status(500).json({
            message: "failed to verify token"
        });
    }
}