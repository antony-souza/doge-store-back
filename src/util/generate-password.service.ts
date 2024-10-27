import * as bcrypt from "bcryptjs";

export default class GeneratePasswordService {
  async createHash(password: string) {
    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }
}
