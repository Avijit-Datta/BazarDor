import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function UpdateProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নাম খালি রাখা যাবে না।");
      return;
    }
    setBusy(true);
    try {
      await updateUser({ name: name.trim() });
      toast.success("তথ্য সফলভাবে আপডেট হয়েছে!");
      navigate("/profile");
    } catch {
      toast.error("তথ্য আপডেট করতে সমস্যা হয়েছে।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-extrabold text-base-content sm:text-3xl">আমার প্রোফাইল</h1>
        <p className="mt-1 text-sm text-base-content/60">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-base-content/10 bg-base-100 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
          <div>
            <p className="text-lg font-bold text-base-content">{user.name}</p>
            <p className="text-sm text-base-content/55">{user.email}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-base-content/10 bg-base-100 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-base-content">তথ্য</h2>
        <div className="form-control">
          <label className="label pb-1 text-sm font-medium">নাম</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" disabled={busy} className="btn btn-primary w-full">
          {busy ? <span className="loading loading-spinner loading-sm" /> : "আপডেট"}
        </button>
      </form>
    </div>
  );
}
