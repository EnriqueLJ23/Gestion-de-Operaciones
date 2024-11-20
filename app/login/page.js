import { SignupForm } from "@/components/AuthForm";
import Image from "next/image";
import wolf from "../../public/moonwolf.jpg"


export default function Home() {
  return (
    <div    style={{
      backgroundImage: `url(${wolf.src})`,
      backgroundPosition: 'center',
      backgroundRepeat: "repeat"
    }}
    className="flex h-screen w-full items-center justify-center px-4">
    <SignupForm />
</div>
  );
}