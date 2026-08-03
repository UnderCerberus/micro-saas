"use client";

import { useState } from "react";
import { anonymousId } from "@/lib/usage";

export default function CheckoutButton({
  plan,
  children,
  className = "",
}: {
  plan: "standard" | "pro";
  children: React.ReactNode;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, anonId: anonymousId() }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError(data?.error || "決済ページを開けませんでした。");
      }
    } catch {
      setError("決済ページを開けませんでした。時間をおいてお試しください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className}
      >
        {loading ? "決済ページを準備中..." : children}
      </button>
      {error && <p className="mt-2 text-center text-xs text-rose-600">{error}</p>}
    </>
  );
}
