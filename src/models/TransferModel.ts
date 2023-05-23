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

  get = async (idTransfer: number) => {
    return await prisma.transfer.findUnique({
      where: {
        id_transfer: idTransfer
      }
    });
  }

  getStatementByPeriod = async (idAccount: number, firstDate: Date, lastDate: Date, ord: string | undefined, take: string, skip: string) => {
    lastDate.setDate(lastDate.getDate() + 1);

    try {
      if (ord == 'desc' || ord == 'asc' || ord == undefined) {
        const [totalRegister, recordsQuery] = await prisma.$transaction([
          prisma.transfer.count({
            where: {
              OR: [
                { id_account_destiny: idAccount },
                { id_account_origin: idAccount },
              ],
              AND: [
                { date: { gte: firstDate } },
                { date: { lte: lastDate } }
              ]
            }
          }),
  
          prisma.transfer.findMany({
            orderBy: {
              created_at: ord
            },
            where: {
              OR: [
                { id_account_destiny: idAccount },
                { id_account_origin: idAccount },
              ],
              AND: [
                { date: { gte: firstDate } },
                { date: { lte: lastDate } }
              ]
            },
            take: Number(take),
            skip: Number(skip)
          })
  
        ]);
  
        return {
          navigation: {
            skip: skip,
            take: take,
            total: totalRegister
          },
          statemenet: recordsQuery
        };
      }
    }
    catch (e) {
      console.log("erro transaction: " + e);
    }
  }

  

  getStatementByPeriodIn = async (idAccount: number, firstDate: Date, lastDate: Date, ord: string | undefined, take: string, skip: string) => {
    lastDate.setDate(lastDate.getDate() + 1);

    try {
      if (ord == 'desc' || ord == 'asc' || ord == undefined) {
        const [totalRegister, recordsQuery] = await prisma.$transaction([
          prisma.transfer.count({
            where: {
              AND: [
                { date: { gte: firstDate } },
                { date: { lte: lastDate } },
                { id_account_destiny: idAccount },
              ]
            }
          }),

          prisma.transfer.findMany({
            orderBy: {
              created_at: ord
            },
            where: {
              AND: [
                { date: { gte: firstDate } },
                { date: { lte: lastDate } },
                { id_account_destiny: idAccount },
              ]
            },
            take: Number(take),
            skip: Number(skip)
          })

        ]);

        return {
          navigation: {
            skip: skip,
            take: take,
            total: totalRegister
          },
          statemenet: recordsQuery
        };
      }
    }
    catch (e) {
      console.log("erro transaction: " + e);
    }
  }

  getStatementByPeriodOut = async (idAccount: number, firstDate: Date, lastDate: Date, ord: string | undefined, take: string, skip: string) => {
    lastDate.setDate(lastDate.getDate() + 1);
    try {
      if (ord == 'desc' || ord == 'asc' || ord == undefined) {
        const [totalRegister, recordsQuery] = await prisma.$transaction([
          prisma.transfer.count({
            where: {
              AND: [
                { date: { gte: firstDate } },
                { date: { lte: lastDate } },
                { id_account_origin: idAccount },
              ]
            }
          }),

          prisma.transfer.findMany({
            orderBy: {
              created_at: ord
            },
            where: {
              AND: [
                { date: { gte: firstDate } },
                { date: { lte: lastDate } },
                { id_account_origin: idAccount },
              ]
            },
            take: Number(take),
            skip: Number(skip)
          })

        ]);

        return {
          navigation: {
            skip: skip,
            take: take,
            total: totalRegister
          },
          statemenet: recordsQuery
        };
      }
    }
    catch (e) {
      console.log("erro transaction: " + e);
    }
  }


  getStatementAll = async (idAccount: number, ord: string | undefined, take: string, skip: string) => {
    try {
      if (ord == 'desc' || ord == 'asc' || ord == undefined) {
        const [totalRegister, recordsQuery] = await prisma.$transaction([
          prisma.transfer.count({
            where: {
              AND: [
                { id_account_destiny: idAccount },
                { id_account_origin: idAccount },
              ]
            }
          }),

          prisma.transfer.findMany({
            orderBy: {
              created_at: ord
            },
            where: {
              AND: [
                { id_account_destiny: idAccount },
                { id_account_origin: idAccount },
              ]
            },
            take: Number(take),
            skip: Number(skip)
          })

        ]);

        return {
          navigation: {
            skip: skip,
            take: take,
            total: totalRegister
          },
          statemenet: recordsQuery
        };
      }
    }
    catch (e) {
      console.log("erro transaction: " + e);
    }
  }




  getStatementAllIn = async (idAccount: number, ord: string | undefined, take: string, skip: string) => {
    try {
      if (ord == 'desc' || ord == 'asc' || ord == undefined) {
        const [totalRegister, recordsQuery] = await prisma.$transaction([
          prisma.transfer.count({
            where: {
              AND: [
                { id_account_destiny: idAccount },
              ]
            }
          }),

          prisma.transfer.findMany({
            orderBy: {
              created_at: ord
            },
            where: {
              AND: [
                { id_account_destiny: idAccount },
              ]
            },
            take: Number(take),
            skip: Number(skip)
          })

        ]);

        return {
          navigation: {
            skip: skip,
            take: take,
            total: totalRegister
          },
          statemenet: recordsQuery
        };
      }
    }
    catch (e) {
      console.log("erro transaction: " + e);
    }
  }


  getStatementAllOut = async (idAccount: number, ord: string | undefined, take: string, skip: string) => {
    try {
      if (ord == 'desc' || ord == 'asc' || ord == undefined) {
        const [totalRegister, recordsQuery] = await prisma.$transaction([
          prisma.transfer.count({
            where: {
              AND: [
                { id_account_origin: idAccount },
              ]
            }
          }),

          prisma.transfer.findMany({
            orderBy: {
              created_at: ord
            },
            where: {
              AND: [
                { id_account_origin: idAccount },
              ]
            },
            take: Number(take),
            skip: Number(skip)
          })

        ]);

        return {
          navigation: {
            skip: skip,
            take: take,
            total: totalRegister
          },
          statemenet: recordsQuery
        };
      }
    }
    catch (e) {
      console.log("erro transaction: " + e);
    }
  }
};