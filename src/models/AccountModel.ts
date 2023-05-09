import { PrismaClient } from '@prisma/client';
import { group, groupCollapsed } from 'console';
import { AccountIn } from 'dtos/AccountDTO';

const prisma = new PrismaClient();

export default class AccountModel {

  create = async (account: AccountIn) => {
    return await prisma.account.create({
      data: account
    });
  }

  getAll = async () => {
    return await prisma.account.findMany({
      where: {
        is_active: true
      },
      orderBy: {
        created_at: 'asc'
      }
    });
  }

  getUserAccounts = async (id: number) => {
    return await prisma.account.findMany({
      where: {
        is_active: true,
        user_id_user: id
      }
    });
  }

  get = async (id: number) => {
    return await prisma.account.findUnique({
      where: {
        id_account: id
      }
    });
  }

  delete = async (id: number) => {
    return await prisma.account.update({
      where: {
        id_account:id
      },
      data: {
        is_active: false,
        updated_at: new Date()
      }
    })
  }

  activate = async (id: number) => {
    return await prisma.account.update({
      where: {
        id_account:id
      },
      data: {
        is_active: true,
        updated_at: new Date()
      }
    })
  }

  update = async (id: number, account: AccountIn) => {
    return await prisma.account.update({
      where: {
        id_account:id
      },
      data: {
        ...account
      }
    })
  }

  deactivateAccount = async (id: number, account: AccountIn) => {
    return await prisma.account.update({
      where: {
        id_account:id
      },
      data: {
        ...account
      }
    })
  }

};