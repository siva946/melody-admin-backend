import bcrypt from "bcrypt";
import User from "../Models/User.js";

const SeedingUser = async () => {
  const email = "sivasu@gmail.com";
  const password = "12345678";

  const existing = await User.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, passwordHash });
    console.log(`✅ Default user created:
Email: ${email}
Password: ${password}`);
  } else {
    console.log("ℹ️ Default user already exists");
  }
};

export default SeedingUser;
