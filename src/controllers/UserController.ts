import { generateUserToken } from "functions/functions";
import { Request, Response, response } from "express";
import { UserIn, UserOut } from "dtos/UsersDTO";
import { DateTime } from "luxon";
import { hash } from "bcrypt";
import UserModel from "models/UserModel";
import bcrypt from "bcrypt";
import AddressModel from "models/AddressModel";
import AccountModel from "models/AccountModel";
import { AccountOut } from "dtos/AccountDTO";

const userModel = new UserModel();

export default class UserController {
  // create = async (req: Request, res: Response) => {
  //   try {
  //     const user: UserIn = req.body;

  //     // set default values
  //     user.date_birth = new Date(user.date_birth.toString() + "T00:00:00.000Z");
  //     user.is_active = true;

  //     const newUser: UserOut = await userModel.create(user);
  //     res.status(201).json(newUser);
  //   } catch (e) {
  //     console.log("Failed to create user", e);
  //     res.status(500).send({
  //       error: "USR-01",
  //       message: "Failed to create user" + e
  //     });
  //   }
  // };

  get = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const newUser: UserOut | null = await userModel.get(id);

      if (newUser) {
        res.status(200).json(newUser);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get user", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get user",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const users: UserOut[] | null = await userModel.getAll();
      res.status(200).json(users);
    } catch (e) {
      console.log("Failed to get all users", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all users",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const updateUser: UserIn = req.body;

      updateUser.updated_at = new Date();

      const userUpdated: UserOut | null = await userModel.update(
        id,
        updateUser
      );

      if (userUpdated) {
        res.status(200).json(userUpdated);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update user", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update user" + e
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const addressModel = new AddressModel();
      const id: number = parseInt(req.params.id);
      const userDeleted = await userModel.delete(id);
      res.status(204).json(userDeleted);

    } catch (e) {
      console.log("Failed to delete user", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete user" + e,
      });
    }
  };

  activate = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const userActivated = await userModel.activate(id);
      res.status(204).json(userActivated);
    } catch (e) {
      console.log("Failed to delete user", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete user" + e,
      });
    }
  };


  ///////////////////////////////////////
  //            GET BALANCE            //
  ///////////////////////////////////////

  getBalance = async (req: Request, res: Response) => {
    const accountModel = new AccountModel();

    try {
      const id: number = parseInt(req.params.id);
      const id_account = req.body.id_account;
      if (id_account) {
        const account = await accountModel.getUserAccount(id, id_account);
        if(account) {
          res.status(200).json({
            saldo: account.balance
          });
        }
        else {
          res.status(404).json({
            error: "ACC-01",
            message: "Account not exist.",
          });
        }
      } else {
        res.status(404).json({
          error: "ACC-01",
          message: "Account can not be empty.",
        });
      }
    } catch (e) {
      console.log("Failed to get account", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get account",
      });
    }
  };



  ///////////////////////////////////////
  //          LOGIN FUNCTION           //
  ///////////////////////////////////////

  login = async (req: Request, res: Response) => {
    try {
      /* get request */
      const cpf = req.body.cpf;
      let password = req.body.password;

      const user: UserOut | null = await userModel.getLogin(cpf);
      if (user) {
        bcrypt.compare(password, user.password_login)
          .then(response => {
            if (response == true) {
              res.status(201).json({
                message: "successfully logged in",
                token: generateUserToken(user.id_user, user.position)
              });
            }
            else
              res.status(500).json({
                message: "invalid fields"
              });
          })
          .catch(err => console.error(err.message));
      }
      else {
        res.status(500).json({
          message: "invalid fields"
        });
      }

    } catch (e) {
      console.log("Failed to to login", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to login" + e,
      });
    }
  };



  ///////////////////////////////////////
  //            SEARCH USER            //
  ///////////////////////////////////////

  searchUser = async (cpf : string) => {
    try {
      const newUser: UserOut | null = await userModel.searchUser(cpf);
      console.log(newUser?.id_user + "<><><><>><><><><><><><<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<>>>>>>>>>>>>>>" + cpf);
      if (newUser)
        return true;
    } catch (e) {
      console.log("Failed to get user", e);
      return false;
    }
  };



  
}
