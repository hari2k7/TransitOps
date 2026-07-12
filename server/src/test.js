import { hashPassword, comparePassword } from "./utils/password.js";

const test = async () => {
    const password = "Password@123";

    const hash = await hashPassword(password);

    console.log(hash);

    console.log(await comparePassword(password, hash));
};

test();