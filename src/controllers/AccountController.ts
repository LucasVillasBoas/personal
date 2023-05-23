import { Request, Response } from "express";
import { AccountIn, AccountOut } from "dtos/AccountDTO";
import AccountModel from "models/AccountModel";
import { isValidDate, showDetailTransaction, showFormatStatement, typeOperationStatement } from "functions/functions";
import TransferModel from "models/TransferModel";
import UserModel from "models/UserModel";

const accountModel = new AccountModel();

export default class AccountController {
  create = async (req: Request, res: Response) => {
    try {
      const account: AccountIn = req.body;
      account.account_number = (Math.floor(Math.random() * 6)).toString();
      const newAccount: AccountOut = await accountModel.create(account);
      res.status(201).json(newAccount);
    } catch (e) {
      console.log("Failed to create Account", e);
      res.status(500).send({
        error: "USR-01",
        message: "Failed to create Account" + e
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





  ///////////////////////////////////////
  //       GET DEFAULT STATEMENT       //
  ///////////////////////////////////////

  getDefaultStatement = async (req: Request, res: Response) => {
    try {
      const dataParams = req.query;
      const firstDate = dataParams.firstDate?.toString();
      const lastDate = dataParams.lastDate?.toString();
      const ord = dataParams.ord?.toString();
      const take = String(dataParams.take);
      const skip = String(dataParams.skip);

      let idAccount;
      let returnStatement;
      let totTransfer;
      let typeOperation = typeOperationStatement(firstDate, lastDate);

      if (dataParams.id_account?.toString())
        idAccount = parseInt(dataParams.id_account?.toString());

      if (req.params.id && idAccount) {
        const account = await accountModel.get(idAccount);

        if (account && account.user_id_user == parseInt(req.params.id)) {
          switch (typeOperation) {
            case 'a':
              returnStatement = await this.getStatementAll(req, res, idAccount, parseInt(req.params.id), ord, take, skip);
              break;
            case 'p':
              returnStatement = await this.getStatementByPeriod(req, res, firstDate, lastDate, idAccount, parseInt(req.params.id), ord, take, skip);
              break;
            case 't':
              returnStatement = await this.getStatementToday(req, res, firstDate, idAccount, parseInt(req.params.id), ord, take, skip);
              break;
          }
          if (returnStatement) {
            res.status(200).json({ navegation:returnStatement.navigation, transfer: showFormatStatement(returnStatement.statemenet, idAccount) });
          } else
            res.status(200).json({ message: "nao possui transações" });

        }
        else
          res.status(404).json({ error: "STT-02", message: "Operation invalid.", });
      }
      else
        res.status(404).send({ error: "STT-01", message: "Fields can not be empty.", });
    } catch (e) {
      console.log("Failed to get account", e);
      res.status(500).send({ error: "STT-02", message: "Failed to get account" + e });
    }
  };




  getDetailStatement = async (req: Request, res: Response) => {
    try {
      const transferModel = new TransferModel();
      const accountModel = new AccountModel();
      const userModel = new UserModel();
      const dataParams = req.query;

      let idAccount;
      let idTransfer;

      if (dataParams.id_account?.toString())
        idAccount = parseInt(dataParams.id_account?.toString());

      if (dataParams.id_transfer?.toString())
        idTransfer = parseInt(dataParams.id_transfer?.toString());

      if (req.params.id && idAccount && idTransfer) {
        const transfer = await transferModel.get(idTransfer);

        if (transfer) {

          if (transfer.id_account_destiny == idAccount || transfer.id_account_origin) {

            const account = await accountModel.get(idAccount);
            let auxAccount
            let userOrigin;
            let userDestiny;

            if (idAccount == transfer.id_account_destiny) {
              auxAccount = await accountModel.get(transfer.id_account_origin);
              if (auxAccount)
                userOrigin = await userModel.get(auxAccount?.user_id_user);
              userDestiny = await userModel.get(parseInt(req.params.id));
            }
            else {
              auxAccount = await accountModel.get(transfer.id_account_destiny);
              userDestiny = await userModel.get(parseInt(req.params.id));
              if (auxAccount)
                userOrigin = await userModel.get(auxAccount.user_id_user);
            }

            if (account && userOrigin && userDestiny)
              res.status(200).send({ transfer_detail: showDetailTransaction(transfer, account?.user_id_user, userOrigin, userDestiny, account, idAccount) });

          }
          else
            res.status(404).json({ error: "STT-02", message: "Operation invalid.", });

        }
        else
          res.status(404).json({ error: "STT-02", message: "Operation invalid.", });
      }
      else
        res.status(404).json({ error: "STT-01", message: "Fields can not be empty.", });
    } catch (e) {
      console.log("Failed to get account", e);
      res.status(500).send({ error: "STT-02", message: "Failed to get account" + e });
    }
  };




  ///////////////////////////////////////
  //         GET STATEMENT ALL         //
  ///////////////////////////////////////


  getStatementAll = async (req: Request, res: Response, id: number, idUser: number, ord: string | undefined, take : string, skip : string) => {
    try {
      const filterInOut = req.query.filter?.toString();
      const transferModel = new TransferModel();
      let statemenet;

      if (filterInOut) {
        if (filterInOut == 'in')
          statemenet = await transferModel.getStatementAllIn(id, ord, take, skip);
        else
          statemenet = await transferModel.getStatementAllOut(id, ord, take, skip);
      }
      else
        statemenet = await transferModel.getStatementAll(id, ord, take, skip);

      if (statemenet)
        return statemenet;
      else
        return;
    } catch (e) {
      console.log("Failed to get account", e);
      return;
    }
  };


















  ///////////////////////////////////////
  //       GET STATEMENT PERIOD        //
  ///////////////////////////////////////

  getStatementByPeriod = async (req: Request, res: Response, first: string | undefined, last: string | undefined, id: number, idUser: number, ord: string | undefined, take : string, skip : string) => {
    try {
      const filterInOut = req.query.filter?.toString();
      const transferModel = new TransferModel();
      let statemenet;

      if (filterInOut && first && last) {
        if (filterInOut == 'in')
          statemenet = await transferModel.getStatementByPeriodIn(id, new Date(first), new Date(last), ord, take, skip);
        else
          statemenet = await transferModel.getStatementByPeriodOut(id, new Date(first), new Date(last), ord, take, skip);
      }
      else if (first && last)
        statemenet = await transferModel.getStatementByPeriod(id, new Date(first), new Date(last), ord, take, skip);

      if (statemenet)
        return statemenet;
      else
        return;

    } catch (e) {
      console.log("Failed to get account", e);
      return;
    }
  };















  ///////////////////////////////////////
  //        GET STATEMENT TODAY        //
  ///////////////////////////////////////

  getStatementToday = async (req: Request, res: Response, first: string | undefined, id: number, idUser: number, ord: string | undefined, take : string, skip : string) => {
    try {
      const transferModel = new TransferModel();
      let statemenet;
      if (first)
        statemenet = await transferModel.getStatementByPeriod(id, new Date(first), new Date(), ord, take, skip);

      if (statemenet)
        return statemenet;
      else
        res.status(404).json({ error: "STT-03", message: "Operation has been canceled.", });

    } catch (e) {
      console.log("Failed to get account", e);
      res.status(500).send({ error: "USR-02", message: "Failed to get account" + e });
    }
  };






}


// if (idUser && idAccount) {

//   /* check if account and user exist */
//   const account = await accountModel.get(idAccount);

//   if (account) {

//     /* check if user account and user */
//     if (account.user_id_user == idUser) {

//       /* make operation */
//       if (isValidDate(lasDate)) {

//         /* FIRST DATE AND LAST DATE VALID TO FILTER */
//         const statemenet = await transferModel.getDefaultStatement(idAccount, firDate, new Date(lasDate));

//         if (statemenet)
//           res.status(404).json(statemenet);
//         else
//           res.status(404).json({ error: "STT-03", message: "Operation has been canceled.", });
//       }
//       else {
//         /* JUST FIRST DATE VALID TO FILTER */
//         const statemenet = await transferModel.getDefaultStatementByFirstDate(idAccount, firDate, lasDate);

//         if (statemenet)
//           res.status(404).json(statemenet);
//         else
//           res.status(404).json({ error: "STT-03", message: "Operation has been canceled.", });
//       }
//     }
//     else
//       res.status(404).json({ error: "STT-03", message: "Operation has been canceled.", });
//   }
//   else
//     res.status(404).json({ error: "STT-02", message: "Account invalid.", });

// } else
//   res.status(404).json({ error: "STT-01", message: "Fields can not be empty.", });