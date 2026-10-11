import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-5 px-4 py-24 text-center">
      <span className="text-7xl">🧭</span>
      <h1 className="text-4xl font-extrabold text-base-content">৪০৪</h1>
      <p className="max-w-md text-base-content/60">
        দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি। হয়তো লিংকটি ভুল অথবা পেজটি সরিয়ে ফেলা হয়েছে।
      </p>
      <Link to="/" className="btn btn-primary">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
