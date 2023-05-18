import { Request, Response } from "express";
import { UserIn, UserOut } from "dtos/UsersDTO";
import { AddressIn, AddressOut } from "dtos/AddressDTO";
import { AccountIn, AccountOut } from "dtos/AccountDTO";
import UserModel from "models/UserModel";
import { hash } from "bcrypt";
import { num, typeDataToTransfer } from "functions/functions";
import { TransferIn } from "dtos/TransferDTO";
import AccountModel from "models/AccountModel";
import TransferModel from "models/TransferModel";
import bcrypt from "bcrypt";

export default class OnboardingController {


    ///////////////////////////////////////
    //             TRANSFER              //
    ///////////////////////////////////////  

    transfer = async (req: Request, res: Response) => {
        const transferModel = new TransferModel();
        const userModel = new UserModel();
        const accountModel = new AccountModel();

        try {
            let account: AccountOut | null = null;

            const idAccountOrigin = parseInt(req.body.id_account_origin);
            const tryTransfer: TransferIn = req.body;
            const idUserOrigin = parseInt(req.params.id);

            /* format transfer data */
            tryTransfer.date = new Date();
            tryTransfer.updated_at = new Date();

            /* find origin account */
            const accountOrigin: AccountOut | null = await accountModel.getUserAccount(idUserOrigin, idAccountOrigin);

            if (accountOrigin) {
                /* check balance */
                if (accountOrigin?.balance >= tryTransfer.amount && accountOrigin?.balance != 0) {

                    try {
                        const flagPassword = bcrypt.compare(req.body.password_transaction, accountOrigin.password_transaction);

                        /* check password */
                        if (await flagPassword) {

                            /* find destiny account */
                            const destinyAccount: AccountOut | null = await accountModel.getByAccountNumber(req.body.destiny);

                            /* account found */
                            if (destinyAccount) {

                                /* check destiny account */
                                if (destinyAccount.account_number != accountOrigin.account_number) {

                                    /* update origin account balance */
                                    tryTransfer.id_account_destiny = destinyAccount.user_id_user;
                                    tryTransfer.status = "TRUE";

                                    const newTransfer = await transferModel.transfer(tryTransfer, accountOrigin, destinyAccount);
                                    res.status(201).json(newTransfer);
                                }
                                else
                                    res.status(500).send({ error: "TRF-04", message: "Transfer Failed: invalid destiny account" });
                            }
                            else
                                res.status(500).send({ error: "TRF-03", message: "Transfer Failed: destiny account invalid" });
                        }
                        else
                            res.status(500).send({ error: "TRF-02", message: "Transfer Failed: invalid password 2" });
                    }
                    catch (e) {
                        console.log("Senha invalida: " + e);
                        res.status(500).send({ error: "TRF-02", message: "Transfer Failed: invalid password" });
                    }
                }
                else
                    res.status(500).send({ error: "TRF-01", message: "Transfer Failed: balance insufficient" });
            }
            else
                res.status(500).send({ error: "TRF-01", message: "Transfer Failed: account desativated or not exist" });


        } catch (e) {
            console.log("Transfer Failed", e);
            res.status(500).send({
                error: "USR-01",
                message: "Transfer Failed" + e
            });
        }
    };

}
