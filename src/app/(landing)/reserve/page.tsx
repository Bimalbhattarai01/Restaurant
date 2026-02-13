import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reserve",
};

export default function ReservePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Reserve</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Reservation page is under construction.
      </p>
    </main>
  );
}
