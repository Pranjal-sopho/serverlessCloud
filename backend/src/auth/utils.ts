import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'
//import {JwtToken} from './JwtToken'
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  console.log("incoming jwt token:", jwtToken)
  const decodedJwt = decode(jwtToken) as JwtPayload
  console.log("decoded jwt:",decodedJwt)
  return decodedJwt.sub
}
