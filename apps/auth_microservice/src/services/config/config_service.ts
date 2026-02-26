import dotenv from "dotenv";
import fs from "fs";
export class ConfigService {
  // private readonly envConfig: { [key: string]: string };

  // constructor(filePath: string) {
  //   this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  // }
  get(key: string) {
    return process.env[key];
  }
}
