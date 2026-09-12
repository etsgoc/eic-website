import JoinForm from "@/components/JoinForm";

export default function JoinPage() {
  return (
    <div className="container-content py-16 md:py-20">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="text-sm font-medium text-ink-500">Join EIC</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink-900 md:text-4xl">
            Membership is free and open to every WSEI student
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-500">
            You do not need an idea to join. Some members come with a
            venture already in motion, others come to find a team, learn, or
            just see what gets built.
          </p>
          <div className="mt-8 flex flex-col gap-4 border-t border-ink-100 pt-8 text-[15px] text-ink-500">
            <p>Applications are reviewed on a rolling basis.</p>
            <p>There is no cost to join and no equity is ever taken.</p>
            <p>You can stand for any leadership position once elections open.</p>
          </div>
        </div>

        <JoinForm />
      </div>
    </div>
  );
}
