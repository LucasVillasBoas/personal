import { DecodedToken } from 'dtos/Token';
import { Request, Response, NextFunction } from 'express';
import { isValidCPF, isValidEmail, isValidPhone, isValidPassword, isValidPasswordTransaction, isValidDateBirth, num } from 'functions/functions';
import jwt from "jsonwebtoken";

export async function authOnboarding(req: Request, res: Response, next: NextFunction) {

  let arrError = [];


  //cpf
  if (num(req.body.user.cpf).length != 11)
    arrError.push({ error: "DTA-01", message: "cpf must have 11 digits", type: "length" });

  if (!isValidCPF(req.body.user.cpf))
    arrError.push({ error: "DTA-01", message: "cpf needs to be valid", type: "invalid" });

  //email
  if (!isValidEmail(req.body.user.email))
    arrError.push({ error: "DTA-02", message: "email needs to be valid", type: "invalid" });

  //phone
  if (num(req.body.user.phone).length != 11)
    arrError.push({ error: "DTA-03", message: "phone must have 11 digits", type: "length" });

  if (!isValidPhone(req.body.user.phone))
    arrError.push({ error: "DTA-03", message: "phone needs to be valid", type: "invalid" });

  //date_birth
  if (!isValidDateBirth(req.body.user.date_birth))
    arrError.push({ error: "DTA-04", message: "date must be in the format: yyyy/mm/dd", type: "invalid" });

  //password
  if (!isValidPasswordTransaction(req.body.user.account.password_transaction))
    arrError.push({ error: "DTA-05", message: "transaction password must be 4 digits", type: "invalid" });

  if (!isValidPassword(req.body.user.password_login)) {
    arrError.push({
      error: "DTA-06",
      message: 'The password to enter the application ' +
        'can contain alphanumeric and special characters and must contain: At least 8 characters ' +
        '1 capital letter ' +
        '1 lowercase letter ' +
        '1 special character ' +
        '1 number',
      type: "invalid"
    });
  }

  //zip code
  if (num(req.body.user.address.zip_code).length != 8) {
    arrError.push({ error: "DTA-07", message: "zip code must have 8 digits", type: "length" });
  }

  if (arrError.length > 0) {
    return res.status(401).send({
      error: "ONB-01",
      status: "failed",
      errors: arrError
    });
  }


  next();
}

export async function authLogin(req: Request, res: Response, next: NextFunction) {

  next();
}

export function verifyJwtToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('Token JWT ausente na requisição.');
    console.log(token);
    return res.status(401).send({ 'message': 'token invalid' })
    return null;
  }

  try {
    const secret = process.env.SECRET?.toString();
    if (secret) {
      const decodedToken = jwt.verify(token, secret) as DecodedToken;
      if (req.params.id == decodedToken.id) {
        console.log(req.params.id + " AAAA " + decodedToken.id);
        next();
        return decodedToken;
      }
      return res.status(401).send({ 'erro': 'ACS-01', 'message': 'access denied' })
    } else {
      return res.status(401).send({ 'erro': 'ACS-01', 'message': 'access denied' })
    }
  } catch (error) {
    console.error('Erro ao verificar o token JWT:', error);
    return res.status(401).send({ 'message': 'Token expired' });
  }
}

export function verifyJwtTokenMaster(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('Token JWT ausente na requisição.');
    console.log(token);
    return res.status(401).send({ 'message': 'token invalid' })
  }

  try {
    const secret = process.env.SECRET?.toString();
    if (secret) {
      const decodedToken = jwt.verify(token, secret) as DecodedToken;
      if (decodedToken.position == 'MST') {
        console.log(req.params.id + " AAAA " + decodedToken.id);
        next();
        return decodedToken;
      }
      return res.status(401).send({ 'erro': 'ACS-01', 'message': 'access denied' })
    }
    return null;
  } catch (error) {
    console.error('Erro ao verificar o token JWT:', error);
    return null;
  }
}