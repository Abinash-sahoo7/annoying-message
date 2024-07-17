import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request, response: Response) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const existingUserVerifiedByUserName = await UserModel.findOne({
      username,
      isVerifyed: true,
    });

    if (existingUserVerifiedByUserName) {
      return Response.json(
        {
          Success: false,
          message: "UserName is already Taken",
        },
        {
          status: 500,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      // to do
      if (existingUserByEmail.isVerifyed) {
        return Response.json(
          {
            Success: false,
            message: "User alredy exists with this email",
          },
          { status: 400 }
        );
      } else {
        const newHashedPasword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = newHashedPasword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPasword = await bcrypt.hash(password, 10);
      const expireDate = new Date();
      expireDate.setHours(expireDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPasword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expireDate,
        isVerifyed: false,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          Success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        Success: true,
        message: "User Created Successfully. Please verify your Account",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering User", error);
    return Response.json(
      {
        Success: false,
        message: "Error Registering User",
      },
      {
        status: 500,
      }
    );
  }
}
