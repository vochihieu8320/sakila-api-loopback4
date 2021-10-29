import bcrypt from "bcrypt";




export class hashPassword {
  constructor() {

  }

  async comparepass(password: string, hasspass: string): Promise<boolean> {
    if (await bcrypt.compare(password, hasspass)) {
      return true;
    }
    return false;
  }

  async hashpass(password: string) {
    const password_hash = await bcrypt.hash(password, 10);
    return password_hash;
  }
}
