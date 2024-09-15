import jwt from 'jsonwebtoken'
import { env } from '../../../env'
import TokenPayloadType from '../../../types/token-payload-type'

interface IGenerateTokenRequest {
  id: string
  email: string
}

interface IGenerateTokenResponse {
  token: string
  expiredAt: Date
}

interface JwtTokenPayload {
  id: string
  email: string
}

class JwtUtils {
  public generateToken({id, email}: IGenerateTokenRequest): IGenerateTokenResponse {
    const expiresIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30d
    
    const token = jwt.sign({ id, email }, env.JWT_SECRET, {
      expiresIn: '30d'
    })

    return {
      token,
      expiredAt: expiresIn
    }
  }

  public verifyToken(token: string) {
    const decoded = jwt.verify(token, env.JWT_SECRET)

    return decoded as TokenPayloadType
  }
}

export default new JwtUtils()