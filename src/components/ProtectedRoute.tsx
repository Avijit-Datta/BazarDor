import { useEffect, useRef, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const toasted = useRef(false);

  useEffect(() => {
    if (!loading && !user && !toasted.current) {
      toasted.current = true;
      toast.error("এই পেজ দেখতে প্রথমে সাইন ইন করুন।");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-6xl justify-center px-4 py-24">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
