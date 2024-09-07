import { compare, genSalt, hash } from "bcrypt";
import { Document, Schema, models, model, Model } from "mongoose";

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  avater: { url: string; id: string };
  verified: boolean;
}

interface Method {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument, {}, Method>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avater: { type: Object, url: String, id: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);

    next();
  } catch (err) {
    throw err;
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await compare(password, this.password);
  } catch (err) {
    throw err;
  }
};

const UserModel = models.User || model("User", userSchema);

export default UserModel as Model<UserDocument, {}, Method>;
