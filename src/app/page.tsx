"use client";

import authService from "@/services/auth.api";
import Router from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = Router.useRouter();


  useEffect(() => {

    ; (async () => {
      await authService.getCurrentUser()
        .then((res) => {
          if (res.success) {
            console.log("Current user:", res.data);
            setUser(res.data);
            setIsAuthenticated(true);
            router.push("/dashboard");
          } else {
            setError(res.message || "Unknown error");
          }
        })
        .catch((err) => {
          console.error("Error fetching current user:", err);
          setError(err.message || "Unknown error");
        })
        .finally(() => {
          setLoading(false);
        });
    })();


  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loading && !isAuthenticated) {
    router.push("/login");
    return <div>Redirecting to login...</div>;
  }



}
