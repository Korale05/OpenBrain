

import type { JwtPayload } from "jsonwebtoken";


export interface RefreshTokenPayload extends JwtPayload{
    _id : string
}

