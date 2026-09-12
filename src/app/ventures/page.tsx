import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { listVentures } from "@/lib/ventures";
import VentureBoard from "@/components/VentureBoard";

export default async function VenturesPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const currentUser = token ? await verifySessionToken(token) : null;
  const ventures = await listVentures();

  return (
    <div className="container-content py-16 md:py-20">
      <p className="text-sm font-medium text-ink-500">Ventures</p>
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink-900 md:text-4xl">
        What members are building, and who they need
      </h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        This is the Team stage made real. Post what you are working on and
        what kind of teammate you need, or browse what other members are
        building and reach out.
      </p>

      <div className="mt-12">
        <VentureBoard initialVentures={ventures} currentUser={currentUser} />
      </div>
    </div>
  );
}
