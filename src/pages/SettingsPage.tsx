import { useState, type FormEvent } from "react";
import { trackEvent } from "../analytics/trackEvent";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export function SettingsPage() {
  const { account } = useAuth();
  const [inviteEmail, setInviteEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const invite = async (event: FormEvent) => {
    event.preventDefault();
    await api.post("/api/account/invitations", { email: inviteEmail });
    // The API created the invitation; the page confirms it was sent.
    trackEvent("Invitation sent", {
      account_plan: account?.plan ?? "unknown",
      account_seats: account?.seats ?? 0,
    });
    setMessage(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
  };

  const upgrade = async () => {
    await api.post("/api/account/upgrade", { plan: "team" });
    // The API confirmed the upgrade to the Team plan.
    trackEvent("Plan upgraded", {
      previous_plan: account?.plan ?? "unknown",
      new_plan: "team",
      account_seats: account?.seats ?? 0,
    });
    setMessage("Upgraded to the Team plan");
  };

  return (
    <section>
      <h1>Settings</h1>
      <h2>Plan</h2>
      <p>
        {account?.name} is on the <strong>{account?.plan}</strong> plan with {account?.seats} seats.
      </p>
      {account?.plan === "free" && (
        <button id="upgrade-plan-button" type="button" onClick={() => void upgrade()}>
          Upgrade to Team
        </button>
      )}
      <h2>Invite a teammate</h2>
      <form className="inline-form" onSubmit={(event) => void invite(event)}>
        <input
          id="invite-email-input"
          type="email"
          value={inviteEmail}
          onChange={(event) => setInviteEmail(event.target.value)}
          placeholder="teammate@company.com"
        />
        <button id="send-invite-button" type="submit">
          Send invite
        </button>
      </form>
      {message && <p className="notice">{message}</p>}
    </section>
  );
}
