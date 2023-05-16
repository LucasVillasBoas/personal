import { Request, Response } from "express";
import { AddressIn, AddressOut } from "dtos/AddressDTO";
import AddressModel from "models/AddressModel";
import { DateTime } from "luxon";
import UserModel from "models/UserModel";
import { UserOut } from "dtos/UsersDTO";

const addressModel = new AddressModel();

export default class AddressController {
  create = async (req: Request, res: Response) => {
    const userModel = new UserModel();
    try {
      const address: AddressIn = req.body;
      const user : UserOut | null = await userModel.get(address.user_id_user);
      
      /* check if user is active */
      if(user != null && user?.is_active != false) {
        this.changeLastAddressToDesable(address.user_id_user);

        const newAddress: AddressOut = await addressModel.create(address);
        res.status(201).json(newAddress);
      }
      else
        res.status(500).json({message: "User does not exist"});
    } catch (e) {
      console.log("Failed to create Address", e);
      res.status(500).send({
        error: "USR-01",
        message: "Failed to create Address"+e
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const newAddress: AddressOut | null = await addressModel.get(id);

      if (newAddress) {
        res.status(200).json(newAddress);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Address not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get Address", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get Address",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const Addresss: AddressOut[] | null = await addressModel.getAll();
      res.status(200).json(Addresss);
    } catch (e) {
      console.log("Failed to get all Addresss", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all Addresss",
      });
    }
  };

  getUserAddress = async (req: Request, res: Response) => {
    try {
      const Addresss: AddressOut[] | null = await addressModel.getAll();
      res.status(200).json(Addresss);
    } catch (e) {
      console.log("Failed to get all Addresss", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all Addresss",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const updateAddress: AddressIn = req.body;

      updateAddress.updated_at = new Date();

      const AddressUpdated: AddressOut | null = await addressModel.update(
        id,
        updateAddress
      );

      if (AddressUpdated) {
        res.status(200).json(AddressUpdated);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Address not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update Address", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update Address" + e
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const AddressDeleted = await addressModel.delete(id);
      res.status(204).json(AddressDeleted);
    } catch (e) {
      console.log("Failed to delete Address", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete Address" + e,
      });
    }
  };

  activate = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const AddressActivated = await addressModel.activate(id);
      res.status(204).json(AddressActivated);
    } catch (e) {
      console.log("Failed to delete Address", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete Address" + e,
      });
    }
  };





  ///////////////////////////////////////
  //           FUNCTIONS AUX           //
  ///////////////////////////////////////

  
  changeLastAddressToDesable = async function (id_user: number) {
    const addressModel = new AddressModel();
    const addresses : AddressOut[] = await addressModel.getUserAddress(id_user);
    console.log(">>>>"+ addresses.length);
    if(addresses.length == 0)
      return;
    return await addressModel.deactivateAddress(addresses[addresses.length-1].id_address);
  }

}
