import { Account, Transfer, User } from "@prisma/client";
import UserController from "controllers/UserController";
import { UserIn, UserOut } from "dtos/UsersDTO";
import { sign } from 'jsonwebtoken';



//////////////////////////////////////////////////////
//                                                  //
//              VALIDATIONS FUNCTIONS               //
//                                                  //
//////////////////////////////////////////////////////



export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

  if (cpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  let digitoVerificador = (resto < 2) ? 0 : 11 - resto;
  if (digitoVerificador !== parseInt(cpf.charAt(9))) {
    return false;
  }

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  digitoVerificador = (resto < 2) ? 0 : 11 - resto;
  if (digitoVerificador !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

export function isValidEmail(email: string) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function isValidPhone(telefone: string) {
  telefone = telefone.replace(/\D/g, '');
  if (!(telefone.length >= 10 && telefone.length <= 11)) return false;
  if (telefone.length == 11 && parseInt(telefone.substring(2, 3)) != 9) return false;
  for (var n = 0; n < 10; n++) {
    if (telefone == new Array(11).join(n.toString()) || telefone == new Array(12).join(n.toString())) return false;
  }
  var codigosDDD = [11, 12, 13, 14, 15, 16, 17, 18, 19,
    21, 22, 24, 27, 28, 31, 32, 33, 34,
    35, 37, 38, 41, 42, 43, 44, 45, 46,
    47, 48, 49, 51, 53, 54, 55, 61, 62,
    64, 63, 65, 66, 67, 68, 69, 71, 73,
    74, 75, 77, 79, 81, 82, 83, 84, 85,
    86, 87, 88, 89, 91, 92, 93, 94, 95,
    96, 97, 98, 99];
  if (codigosDDD.indexOf(parseInt(telefone.substring(0, 2))) == -1) return false;
  if (new Date().getFullYear() < 2017) return true;
  if (telefone.length == 10 && [2, 3, 4, 5, 7].indexOf(parseInt(telefone.substring(2, 3))) == -1) return false;
  return true;
}

export function isValidPassword(p: string) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return regex.test(p);
}

export function isValidPasswordTransaction(pass: string) {
  var regex = /^\d{4}$/;
  return regex.test(pass);
}

export function num(texto: string) {
  return texto.replace(/\D/g, '');
}

export function isValidDateBirth(data: string): boolean {
  const regexData = /^\d{4}-\d{2}-\d{2}$/;
  return regexData.test(data);
}

export function typeDataToTransfer(data: string): string {
  if (num(data).length == 6)
    return "number";
  if (num(data).length == 11)
    if (isValidCPF(data))
      return "cpf"
  return "err";
}

export function isValidDate(dateString: string) {
  let date = new Date(dateString);
  return !isNaN(date.getTime());
}







//////////////////////////////////////////////////////
//                                                  //
//                  TOKEN FUNCTIONS                 //
//                                                  //
//////////////////////////////////////////////////////

export function generateUserToken(id: number, position: string) {

  const jwt = {
    expiresIn: '1d'
  }

  return process.env.SECRET ? sign({ id: id, position: position }, process.env.SECRET, {
    //subject: id.toString(),
    expiresIn: jwt.expiresIn
  }) : false;
}






//////////////////////////////////////////////////////
//                                                  //
//              STATEMENT FUNCTIONS                 //
//                                                  //
//////////////////////////////////////////////////////

export function typeOperationStatement(first: string | undefined, last: string | undefined) {
  if (first == "" && last == "")
    return 'a'; // -> ALL
  else if (first == undefined && last == undefined)
    return 'a';
  else if (first != "" && last != "" && last != undefined && first != undefined)
    return 'p'; // -> PERIOD
  else
    return 't'  // -> FIRST DAY UNTIL TODAY
}


export function showFormatStatement(statement: Transfer[], idAccount: number) {
  let newStatement = [];
  for (let reg in statement) {
    let operation;

    if (statement[reg].id_account_destiny == idAccount)
      operation = "in";
    else
      operation = "out";

    newStatement.push({
      id_transfer: statement[reg].id_transfer,
      id_account_origin: statement[reg].id_account_origin,
      id_account_destiny: statement[reg].id_account_destiny,
      date: statement[reg].date,
      status: statement[reg].status,
      operation: operation,
      description: statement[reg].description,
      created_at: statement[reg].created_at,
      updated_at: statement[reg].updated_at
    });
  }
  return newStatement;

}


export function showDetailTransaction(statement: Transfer, idUser: number | undefined, userOri: User | undefined, userDes: User | undefined, account: Account, idAccount : number) {
  let operation;
  let userFrom;
  let userTo;

  if (statement.id_account_origin == idAccount) {
    operation = "Out";
    userFrom = userOri?.name;
    userTo = userDes?.name;

  }
  else {
    operation = "In";
    userFrom = userDes?.name;
    userTo = userOri?.name;
  }

  return {
    User_origin: userFrom,
    User_destiny: userTo,
    Type: account.type,
    Status: statement.status,
    Operation: operation,
    Id_account_origin: statement.id_account_origin,
    Id_account_destiny: statement.id_account_destiny,
    Amount: statement.amount,
    created_at: statement.created_at,
    updated_at: statement.updated_at
  };
}