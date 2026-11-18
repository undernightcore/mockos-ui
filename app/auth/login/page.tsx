"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import TextInput from "@/components/TextInput";

export default function Login() {
  const t = useTranslations();

  //TODO: Change this to a form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex w-full flex-col">
      <div className="w-full flex flex-col pb-10">
        <h1 className="text-[2rem] text-(--primary-color)">
          {t("LOGIN.TITLE")}
        </h1>
        <p className="text-[1rem] text-(--primary-color)">
          {t("LOGIN.SUBTITLE")}
        </p>
      </div>

      <div className="w-full flex flex-col gap-4">
        <TextInput
          title={t("LOGIN.EMAIL")}
          placeholder={t("LOGIN.EMAIL_PLACEHOLDER")}
          value={email}
          onChange={setEmail}
          link={t("LOGIN.FORGOT_PASSWORD")}
        />

        <TextInput
          title={t("LOGIN.PASSWORD")}
          placeholder={t("LOGIN.PASSWORD_PLACEHOLDER")}
          value={password}
          onChange={setPassword}
        />
      </div>
    </div>
  );
}
