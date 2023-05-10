import { Request, Response } from "express";
import { UserIn, UserOut } from "dtos/UsersDTO";
import UserModel from "models/UserModel";
import { DateTime } from "luxon";

const userModel = new UserModel();

export default class UserController {
  create = async (req: Request, res: Response) => {
    try {
      const user: UserIn = req.body;

      // set default values
      user.date_birth = new Date(user.date_birth.toString() + "T00:00:00.000Z");
      user.is_active = true;

      const newUser: UserOut = await userModel.create(user);
      res.status(201).json(newUser);
    } catch (e) {
      console.log("Failed to create user", e);
      res.status(500).send({
        error: "USR-01",
        message: "Failed to create user"+e
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const newUser: UserOut | null = await userModel.get(id);

      if (newUser) {
        res.status(200).json(newUser);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to get user", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get user",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const users: UserOut[] | null = await userModel.getAll();
      res.status(200).json(users);
    } catch (e) {
      console.log("Failed to get all users", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all users",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const updateUser: UserIn = req.body;

      updateUser.updated_at = new Date();

      const userUpdated: UserOut | null = await userModel.update(
        id,
        updateUser
      );

      if (userUpdated) {
        res.status(200).json(userUpdated);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "User not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update user", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update user" + e
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const userDeleted = await userModel.delete(id);
      res.status(204).json(userDeleted);
    } catch (e) {
      console.log("Failed to delete user", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete user" + e,
      });
    }
  };

  activate = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const userActivated = await userModel.activate(id);
      res.status(204).json(userActivated);
    } catch (e) {
      console.log("Failed to delete user", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete user" + e,
      });
    }
  };

}
