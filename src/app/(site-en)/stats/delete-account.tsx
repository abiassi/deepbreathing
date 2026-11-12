"use client";

import { useMemo, useState } from "react";

import { createRuntimePhraseResolver } from "@/components/resonance/runtime-phrases";
import { authClient } from "@/lib/auth-client";

import styles from "./stats.module.css";

type DeletionState =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "sent" }
  | { kind: "failed"; message: string };

/**
 * Starts account deletion from the bottom of the practice page. The account is
 * removed only after the user follows the link in the confirmation email.
 */
export function DeleteAccount({
  callbackURL,
  locale,
}: {
  callbackURL: string;
  locale: string;
}) {
  const phrases = useMemo(() => createRuntimePhraseResolver(locale), [locale]);
  const [state, setState] = useState<DeletionState>({ kind: "idle" });

  async function requestDeletion() {
    if (!window.confirm(phrases.resolve("ui.delete_account_confirm").text)) {
      return;
    }
    const startError = phrases.resolve("ui.delete_account_start_error").text;
    setState({ kind: "pending" });
    try {
      const result = await authClient.deleteUser({ callbackURL });
      setState(
        result.error
          ? { kind: "failed", message: result.error.message || startError }
          : { kind: "sent" },
      );
    } catch {
      setState({ kind: "failed", message: startError });
    }
  }

  return (
    <footer className={styles.accountFoot}>
      <button
        type="button"
        className={styles.deleteAccount}
        disabled={state.kind === "pending"}
        onClick={() => void requestDeletion()}
      >
        {phrases.resolve("ui.delete_account").text}
      </button>
      <p className={styles.deleteAccountStatus} role="status">
        {state.kind === "sent"
          ? phrases.resolve("ui.delete_account_check_email").text
          : state.kind === "failed"
            ? state.message
            : ""}
      </p>
    </footer>
  );
}
