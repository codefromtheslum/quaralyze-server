import { Request, Response } from "express";
import userModel from "../model/userModel";
import bcrypt from "bcryptjs";
import { streamUpload } from "../config/streamifier";

export const getAllAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await userModel.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: `${users?.length} user(s) in the platform`,
      data: users,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const createAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { emailAddress, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await userModel.create({ emailAddress, password: hashed });

    return res.status(201).json({
      message: "Account created successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const loginAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { emailAddress, password } = req.body;

    const user = await userModel.findOne({ emailAddress });

    if (!user) {
      return res.status(404).json({
        message: "Account does not exist",
      });
    }

    if (user) {
      const check = await bcrypt.compare(password, user?.password || "");
      if (check) {
        return res.status(200).json({
          message: "Login successfull",
          data: user,
        });
      } else {
        return res.status(403).json({
          message: "Incorrect password",
        });
      }
    } else {
      return res.status(404).json({
        message: "Account does not exist",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const updateAccountDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.params;
    const {
      firstName,
      lastName,
      userName,
      facebookURL,
      instagramURL,
      twitterURL,
      linkedinURL,
      phoneNumber,
      gender,
      country,
      state,
      occupation,
    } = req.body;
    const { secure_url, public_url }: any = await streamUpload(req);
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        userName,
        image: secure_url,
        imageId: public_url,
        facebookURL,
        instagramURL,
        twitterURL,
        linkedinURL,
        phoneNumber,
        gender,
        country,
        state,
        occupation,
      },
      { new: true }
    );

    return res.status(201).json({
      message: "Account updated successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const getOneAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    return res.status(200).json({
      message: "Account gotten successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};


export const deleteAccount = async (req: Request, res: Response): Promise<any> => {
  try{
    const {userId} = req.params;

    const user = await userModel.findByIdAndDelete(userId);

    if(!user){
      return res.status(404).json({
        message: "Account not found"
      })
    }

    return res.status(201).json({
      message: "Account deleted successfully",
    })
  }catch(error: any){
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message
    })
  }
}