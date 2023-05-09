import { Request, Response } from "express";
import { AccountIn, AccountOut } from "dtos/AccountDTO";
import AccountModel from "models/AccountModel";
import { createAccountNumber } from "functions/functions";
import { DateTime } from "luxon";

const accountModel = new AccountModel();

export default class AccountController {
  create = async (req: Request, res: Response) => {
    try {
      const account: AccountIn = req.body;
      account.account_number = await createAccountNumber();
      const newAccount: AccountOut = await accountModel.create(account);
      res.status(201).json(account.account_number);
    } catch (e) {
      console.log("Failed to create Account", e);
      res.status(500).send({
        error: "USR-01",
        message: "Failed to create Account"+e
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const newAccount: AccountOut | null = await accountModel.get(id);

      if (newAccount) {
        res.status(200).json(newAccount);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Account not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get Account", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get Account",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const Accounts: AccountOut[] | null = await accountModel.getAll();
      res.status(200).json(Accounts);
    } catch (e) {
      console.log("Failed to get all Accounts", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all Accounts",
      });
    }
  };

  getUserAccounts = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.idUser);
      const accounts: AccountOut[] | null = await accountModel.getUserAccounts(id);
      res.status(200).json(accounts);
    } catch (e) {
      console.log("Failed to get all Accounts", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all Accounts",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const updateAccount: AccountIn = req.body;

      updateAccount.updated_at = new Date();

      const AccountUpdated: AccountOut | null = await accountModel.update(
        id,
        updateAccount
      );

      if (AccountUpdated) {
        res.status(200).json(AccountUpdated);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Account not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update Account", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update Account" + e
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const AccountDeleted = await accountModel.delete(id);
      res.status(204).json(AccountDeleted);
    } catch (e) {
      console.log("Failed to delete Account", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete Account" + e,
      });
    }
  };

  activate = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const accountActivated = await accountModel.activate(id);
      res.status(204).json(accountActivated);
    } catch (e) {
      console.log("Failed to delete Account", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete Account" + e,
      });
    }
  };

}
