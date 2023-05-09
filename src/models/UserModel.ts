import { PrismaClient } from '@prisma/client';
import { group, groupCollapsed } from 'console';
import { UserIn } from 'dtos/UsersDTO';

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
        id_user:id
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
        id_user:id
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
        id_user:id
      },
      data: {
        ...user
      }
    })
  }

  deactivateUser = async (id: number, user: UserIn) => {
    return await prisma.user.update({
      where: {
        id_user:id
      },
      data: {
        ...user
      }
    })
  }

};