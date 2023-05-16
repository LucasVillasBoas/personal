import UserController from "controllers/UserController";
import { UserIn, UserOut } from "dtos/UsersDTO";
import { sign } from 'jsonwebtoken';

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

export function generateUserToken(id: number) {

    const jwt = {
        expiresIn: '1d'
    }

    return process.env.SECRET ? sign({}, process.env.SECRET, {
        subject: id.toString(),
        expiresIn: jwt.expiresIn
    }) : false;

}

export function isValidPasswordTransaction(pass: string) {
    var regex = /^\d{4}$/;
    return regex.test(pass);
}

export function num(texto : string) {
  return texto.replace(/\D/g, '');
}

export function isValidDateBirth(data: string): boolean {
  const regexData = /^\d{4}-\d{2}-\d{2}$/;
  return regexData.test(data);
}

// export function isValidName(str : string) {
//     var regex = /^(\w{3,}\s){1,}\w{3,}$/;
//     return regex.test(str);
// }