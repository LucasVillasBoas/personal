import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { group, groupCollapsed } from 'console';
import { AccountOut } from 'dtos/AccountDTO';
import { TransferIn } from 'dtos/TransferDTO';

const prisma = new PrismaClient();

export default class TransferModel {

  transfer = async (transfer: TransferIn, accountOrigin: AccountOut, accountDestiny: AccountOut) => {
    const balanceOriginUpdated: Decimal = Decimal.add(accountOrigin.balance, -transfer.amount);
    const balanceDestinyUpdated: Decimal = Decimal.add(accountDestiny.balance, transfer.amount);

    await prisma.account.update({
      /* origin account */
      where: {
        id_account: accountOrigin.id_account
      },
      data: {
        updated_at: new Date(),
        balance: balanceOriginUpdated
      }
    });

    await prisma.account.update({
      /* destiny account */
      where: {
        id_account: accountDestiny.id_account
      },
      data: {
        updated_at: new Date(),
        balance: balanceDestinyUpdated
      }
    });

    return await prisma.transfer.create({
      data: {
        id_account_origin: accountOrigin.id_account,
        id_account_destiny: accountDestiny.id_account,
        date: transfer.date,
        amount: transfer.amount,
        status: transfer.status,
        description: transfer.description,
        updated_at: new Date()
      }
    });
  }

};