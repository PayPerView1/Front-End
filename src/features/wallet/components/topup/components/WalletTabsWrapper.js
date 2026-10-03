"use client";

import { useState } from "react";
import WalletTopupPage from "./WalletTopupPage";
import WalletTopup133Page from "./WalletTopup133Page";
import WalletTopup134Page from "./WalletTopup134Page";
import WalletTopup135Page from "./WalletTopup135Page";
import PaymentFailed124Page from "./PaymentFailed124Page";

const INITIAL_AMOUNT = "5,000";

export default function WalletTabsWrapper() {
  const [state, setState] = useState("form");
  const [amount, setAmount] = useState(INITIAL_AMOUNT);

  const showFailure = () => setState("124");

  const showValidation = (nextState, enteredAmount) => {
    setAmount(enteredAmount);
    setState(nextState);
  };

  const returnToForm = (enteredAmount = amount) => {
    setAmount(enteredAmount);
    setState("form");
  };

  if (state === "133") {
    return <WalletTopup133Page initialAmount={amount} onRetry={returnToForm} />;
  }

  if (state === "134") {
    return <WalletTopup134Page initialAmount={amount} onRetry={returnToForm} />;
  }

  if (state === "135") {
    return <WalletTopup135Page initialAmount={amount} onRetry={returnToForm} />;
  }

  if (state === "124") {
    return <PaymentFailed124Page />;
  }

  return (
    <WalletTopupPage
      initialAmount={amount}
      onAmountChange={setAmount}
      onFailure={showFailure}
      onValidationFailure={showValidation}
    />
  );
}
