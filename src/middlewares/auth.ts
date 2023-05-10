import { Request, Response, NextFunction } from 'express';
import { isValidCPF, isValidEmail, isValidPhone } from 'functions/functions';

export const authentication = (req: Request, res:Response, next: NextFunction) => {
  
  if(/*!isValidCPF(req.body.cpf)*/false) {
    return res.status(401).send({'message': 'document invalid'});
  }

  if (/*!isValidEmail(req.body.email)*/false) {
    return res.status(401).send({'message': 'email invalid'});
  }

  if (/*!isValidPhone(req.body.phone)*/false) {
    return res.status(401).send({'message': 'phone invalid'});
  }
  //return res.status(401).send({'message': req.body});


  next();
}