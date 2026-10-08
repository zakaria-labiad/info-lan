import { Suspense } from "react";
import { PasswordRecoveryForm } from "@/components/admin/auth";
export default function ResetPasswordPage() { return <Suspense><PasswordRecoveryForm mode="reset" /></Suspense>; }
