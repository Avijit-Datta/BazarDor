import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-extrabold text-base-content sm:text-3xl">আমার প্রোফাইল</h1>
        <p className="mt-1 text-sm text-base-content/60">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>

      <div className="flex flex-col items-start gap-4 rounded-2xl border border-base-content/10 bg-base-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
          <div>
            <p className="text-lg font-bold text-base-content">{user.name}</p>
            <p className="text-sm text-base-content/55">{user.email}</p>
          </div>
        </div>
        <button onClick={signOut} className="btn btn-outline btn-error btn-sm sm:btn-md">
          ↩ সাইন আউট
        </button>
      </div>

      <Link to="/profile/update" className="btn btn-primary btn-sm sm:btn-md">
        ✏️ তথ্য আপডেট করুন
      </Link>
    </div>
  );
}
