import { Router } from "express";
import multer from "multer";
import {
  getAllAccount,
  createAccount,
  loginAccount,
  updateAccountDetails,
  getOneAccount,
  deleteAccount,
} from "../controller/userController";

const upload = multer().single("image");
const router = Router();
router.route("/get-account").get(getAllAccount);
router.route("/create-account").post(createAccount);
router.route("/login-account").post(loginAccount);
router.route("/:userId/update-account").patch(upload, updateAccountDetails);
router.route("/:userId/get-account").get(getOneAccount);
router.route("/:userId/delete-account").delete(deleteAccount);

export default router;
