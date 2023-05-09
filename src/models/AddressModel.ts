import { PrismaClient } from '@prisma/client';
import { group, groupCollapsed } from 'console';
import { AddressIn } from 'dtos/AddressDTO';

const prisma = new PrismaClient();

export default class AddressModel {

  create = async (address: AddressIn) => {
    return await prisma.address.create({
      data: address
    });
  }

  getAll = async () => {
    return await prisma.address.findMany({
      where: {
        is_active: true
      },
      orderBy: {
        created_at: 'asc'
      }
    });
  }

  getUserAddress = async (id_user: number) => {
    return await prisma.address.findMany({
      where: {
        user_id_user: id_user
      },
      orderBy: {
        id_address: 'asc'
      }
    });
  }

  get = async (id: number) => {
    return await prisma.address.findUnique({
      where: {
        id_address: id
      }
    });
  }

  delete = async (id: number) => {
    return await prisma.address.update({
      where: {
        id_address:id
      },
      data: {
        is_active: false,
        updated_at: new Date()
      }
    })
  }

  activate = async (id: number) => {
    return await prisma.address.update({
      where: {
        id_address:id
      },
      data: {
        is_active: true,
        updated_at: new Date()
      }
    })
  }

  update = async (id: number, Address: AddressIn) => {
    return await prisma.address.update({
      where: {
        id_address:id
      },
      data: {
        ...Address
      }
    })
  }

  deactivateAddress = async (id: number) => {
    return await prisma.address.update({
      where: {
        id_address:id
      },
      data: {
        is_active: false
      }
    })
  }

};