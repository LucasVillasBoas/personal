import AccountModel from "models/AccountModel";
import { AccountIn, AccountOut } from "dtos/AccountDTO";

// This functions analise the last insertion in the database
// and generates the next account number

function numOfDigits(value: number): number {
    let digits : number = 0;
    do {
        digits = digits + 1;
        value = value / 10;
    } while (value != 0);
    return digits;
}

export async function createAccountNumber(): Promise<string> {
    const accountModel = new AccountModel();
    const accounts : AccountOut[] = await accountModel.getAll();
    let numberAccount : string = accounts[accounts.length-1].account_number;
    const nextNumberAccount : number = parseInt(numberAccount)+1;
    const dig: number = numOfDigits(nextNumberAccount);
    return numberAccount.slice(0, -dig).concat((parseInt(accounts[accounts.length-1].account_number)+1).toString());
}