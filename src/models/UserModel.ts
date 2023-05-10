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
    return await prisma.user.update({
      where: {
        id_user: id
      },
      data: {
        is_active: false,
        updated_at: new Date()
      }
    })
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
        cpf: user.cpf,
        name: user.name,
        email: user.email,
        phone: user.phone,
        date_birth: new Date(user.date_birth.toString() + "T00:00:00.000Z"),
        password_login: user.password_login,
        is_active: true
      }
    });

    await prisma.address.create({
      data: {
        zip_code: address.zip_code,
        street: address.street,
        number: address.number,
        complement: address.complement,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        is_active: true,
        user_id_user: userOut.id_user
      }
    });

    return await prisma.account.create({
      data: {
        user_id_user: userOut.id_user,
        account_branch: "0001",
        account_number: (Math.floor(Math.random() * 6)).toString(),
        balance: 0,
        type: "TED ou DOC",
        password_transaction: account.password_transaction,
        is_active: true
      }
    });
    
  }

};

