import { Request, Response, NextFunction } from 'express';
import { isValidCPF, isValidEmail, isValidPhone, isValidPassword, isValidPasswordTransaction, isValidDateBirth, num, isValidDate } from 'functions/functions';

export async function authStatement(req: Request, res: Response, next: NextFunction) {

  let arrError = [];


  next();
}