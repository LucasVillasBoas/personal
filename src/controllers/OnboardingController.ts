import { Request, Response } from "express";
import { UserIn, UserOut } from "dtos/UsersDTO";
import { AddressIn, AddressOut } from "dtos/AddressDTO";
import { AccountIn, AccountOut } from "dtos/AccountDTO";
import UserModel from "models/UserModel";
import AddressModel from "models/AddressModel";
import { DateTime } from "luxon";
import AccountModel from "models/AccountModel";
import { hash } from "bcrypt";
import { num } from "functions/functions";

export default class OnboardingController {

  create = async (req: Request, res: Response) => {
    const userModel = new UserModel();

    try {
      const address: AddressIn = req.body.user.address;
      const account: AccountIn = req.body.user.account;
      const user: UserIn = req.body.user;

      /* format data - removing special character */
      user.cpf = num(user.cpf);
      user.phone = num(user.phone);
      address.zip_code = num(address.zip_code); 

      /* search user */
      if (await userModel.searchUser(user.cpf) == null) {
        
        /* user format data */
        user.date_birth = new Date(user.date_birth.toString() + "T00:00:00.000Z");
        user.password_login = await hash(user.password_login, 8);
        user.is_active = true;

        /* account format data */
        account.account_branch = "0001";
        account.type = "TED ou DOC";
        account.is_active = true;
        account.balance = 0;

        /* address format data */
        address.is_active = true;

        /* hashing password */
        account.password_transaction = await hash(account.password_transaction, 8);

        /* get next account number */
        account.account_number = await this.nextAccountNumber();

        await userModel.onboarding(user, address, account);

        res.status(201).json({
          message: "Account created successfully",
          url: "http://www.homerubapp.com.br"
        });
      }
      else {
        res.status(500).json({
          error: "ONB-02",
          message: "User already exists"
        });
      }
    } catch (e) {
      console.log("Failed to create user", e);
      res.status(500).send({
        error: "ONB-03",
        message: "Failed to create user: invalid data"
      });
    }


  };





  ///////////////////////////////////////
  //           FUNCTIONS AUX           //
  ///////////////////////////////////////

  async nextAccountNumber() {
    try {
      const accountModel = new AccountModel();
      const accounts: AccountOut[] | null = await accountModel.getAll();
      let lastAccNum: number = parseInt(accounts[accounts.length - 1].account_number);
      if (accounts.length == 0 || accounts == null) return "000000";
      lastAccNum += 1;
      let str: string = "000000";
      str = str.slice(0, -lastAccNum.toString().length);
      str += lastAccNum.toString();
      if (lastAccNum <= 999999)
        return str;
      return "000000";
    }
    catch (e) {
      return "000000";
    }
  }

}
