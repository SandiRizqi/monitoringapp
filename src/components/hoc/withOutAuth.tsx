'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";
import LoadingScreen from "../common/LoadingScreen";

export function withoutAuth<P>(Component: ComponentType<P>) {
  return function PublicComponent(props: P & React.Attributes) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;
      if (session) {
        router.replace("/dashboard");
      }
    }, [session, status, router]);

    if (status === "loading" || session) {
      return <LoadingScreen z={60}/>;
    }

    return <Component {...props} />;
  };
}
