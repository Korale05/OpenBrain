

import { z } from "zod";


export const registerSchema = z.object({
    username : z
        .string()
        .min(3,"Username should be at least 3 character !")
        .max(10, "User name at most 10 character !"),
    
    password : z
        .string()
        .min(8,"Password should be minimum 8 character !")
        .max(20,"Password shoud be at most 20 character !")   
})
