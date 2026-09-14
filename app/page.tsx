import {redirect} from "next/navigation";
import {ROUTES} from "@/app/_constants";

export default function page() {
  redirect(ROUTES.home);
}
