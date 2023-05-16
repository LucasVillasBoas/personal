import { Account, PrismaClient } from '@prisma/client';
import { group, groupCollapsed } from 'console';
import { AddressIn } from 'dtos/AddressDTO';
import { AccountIn } from 'dtos/AccountDTO';
import { UserIn, UserOut } from 'dtos/UsersDTO';

const prisma = new PrismaClient();

export default class UserModel {

  create = async (user: UserIn) => {
    return await prisma.user.create({
      data: user
    });
  }

  getAll = async () => {
    return await prisma.user.findMany({
      where: {
        is_active: true
      }
    });
  }
  get = async (id: number) => {
    return await prisma.user.findUnique({
      where: {
        id_user: id
      }
    });
  }

  delete = async (id: number) => {
    await prisma.address.updateMany({
      where: {
        user_id_user: id
      },
      data: {
        is_active: false,
        updated_at: new Date()
      }
    });
    await prisma.account.updateMany({
      where: {
        user_id_user: id
      },
      data: {
        is_active: false,
        updated_at: new Date()
      }
    });
    await prisma.user.update({
      where: {
        id_user: id
      },
      data: {
        is_active: false,
        updated_at: new Date()
      }
    });
  }

  activate = async (id: number) => {
    return await prisma.user.update({
      where: {
        id_user: id
      },
      data: {
        is_active: true,
        updated_at: new Date()
      }
    })
  }

  update = async (id: number, user: UserIn) => {
    return await prisma.user.update({
      where: {
        id_user: id
      },
      data: {
        ...user
      }
    })
  }

  deactivateUser = async (id: number, user: UserIn) => {
    return await prisma.user.update({
      where: {
        id_user: id
      },
      data: {
        ...user
      }
    })
  }
  

  ////////////////////////////
  //       ONBOARDING       //
  ////////////////////////////

  onboarding = async function (user: UserIn, address : AddressIn, account : AccountIn) {
    const userOut : UserOut = await prisma.user.create({
      data: {
        ...user,
        address: {
          create: {
            ...address
          }
        },
        account: {
          create: {
            ...account
          }
        }
      }
    });
  }
  


  ////////////////////////////
  //          LOGIN         //
  ////////////////////////////

  getLogin = async (cpf: string) => {
    return await prisma.user.findUnique({
      where: {
        cpf: cpf
      }
    })
  }


  searchUser = async (cpf: string) => {
    return await prisma.user.findUnique({
      where: {
        cpf: cpf
      }
    });
  }

};

