import { Request, Response } from "express";
import { UserIn, UserOut } from "dtos/UsersDTO";
import { AddressIn, AddressOut } from "dtos/AddressDTO";
import { AccountIn } from "dtos/AccountDTO";
import UserModel from "models/UserModel";
import AddressModel from "models/AddressModel";
import { DateTime } from "luxon";

export default class UserController {

  create = async (req: Request, res: Response) => {
    const userModel = new UserModel();
    try {
      console.log("AQQQ");
      const user: UserIn = req.body;
      const address: AddressIn = req.body;
      const account: AccountIn = req.body;
      res.status(201).json(await userModel.onboarding(user, address, account));
    } catch (e) {
      console.log("Failed to create user", e);
      res.status(500).send({
        error: "USR-01",
        message: "Failed to create user"+e
      });
    }
  };

}
