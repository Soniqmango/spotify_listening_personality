import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center gap-4">
        {session.user?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name ?? "User"}
            className="h-14 w-14 rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hey, {session.user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-white/50">Your personality analysis is coming soon.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
        <div className="mb-4 text-5xl">🎧</div>
        <h2 className="mb-2 text-xl font-semibold text-white">
          Analysis coming in Phase 2
        </h2>
        <p className="text-white/50">
          The data pipeline and personality breakdown will be built next.
        </p>
      </div>
    </div>
  );
}
