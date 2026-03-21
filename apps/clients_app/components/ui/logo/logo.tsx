import logo from "../../../public/logo.png";
import Image from "next/image";

export default function Logo() {
  return <Image src={logo} alt="Logo" width={150} height={80} />;
}
