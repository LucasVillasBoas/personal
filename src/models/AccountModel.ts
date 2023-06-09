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

  getUserAccount = async (id: number, id_account: number) => {
    return await prisma.account.findFirst({
      where: {
        is_active: true,
        id_account: id_account,
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

  getProfileAccount = async (id: number) => {
    return await prisma.account.findUnique({
      where: {
        id_account: id
      },
      select: {
        user_id_user: true, 
        id_account: true,
        account_branch:true,
        account_number:true,
        balance:true,
        type:true,
        created_at:true,
        updated_at:true
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

  ///////////////////////////////////
  //     FUNCTIONS TO TRANSFER     //
  ///////////////////////////////////

  searchNumberAccount = async (number: string) => {
    return await prisma.account.findUnique({
      where: {
        account_number: number
      }
    });
  }

  searchCpf = async (cpf: string) => {
    return await prisma.account.findUnique({
      where: {
        account_number: cpf
      }
    });
  }

  getByAccountNumber = async (AccountNumber: string) => {
    return await prisma.account.findFirst({
      where: {
        account_number: AccountNumber,
        is_active: true
      }
    });
  }



  



};