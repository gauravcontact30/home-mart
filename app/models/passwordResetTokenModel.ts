import { Document, Model, model, models, ObjectId, Schema } from "mongoose";
import { compare, genSalt, hash } from "bcrypt";

interface PasswordResetTokenDocument extends Document {
  user: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const passwordResetTokenSchema = new Schema<PasswordResetTokenDocument, {}, Methods>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Replace with your actual user model reference
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
    expires: "24h",
  },
});

// Pre-save hook to hash the token before saving
passwordResetTokenSchema.pre("save", async function (next) {
  try {
    // Only hash the token if it's modified or new
    if (!this.isModified("token")) return next();

    // Generate a salt
    const salt = await genSalt(10);

    // Hash the token using bcrypt
    const hashedToken = await hash(this.token, salt);

    // Replace the plain token with the hashed token
    this.token = hashedToken;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare token with hashed token
passwordResetTokenSchema.methods.compareToken = async function (candidateToken) {
  try {
    // Use bcrypt to compare candidateToken with the hashed token
    return await compare(candidateToken, this.token);
  } catch (error) {
    throw new Error(error);
  }
};

const PasswordResetTokenModel = models.PasswordResetToken || model("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetTokenModel as Model<PasswordResetTokenDocument, {}, Methods>;
