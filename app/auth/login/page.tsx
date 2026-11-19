"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import TextInput from "@/components/TextInput";

export default function Login() {
  const t = useTranslations();

  //TODO: Change this to a form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    //TODO: add logic
  }

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

        <Button onClick={login}>
          {t("LOGIN.SIGN_IN")}
          <Image
            className="h-3 w-3"
            src="/arrow-right.svg"
            alt="arrow right"
            width={12}
            height={12}
          />
        </Button>
      </div>

      <div className="w-full flex gap-2 items-center pt-10">
        <Divider />
        <span className="text-[0.875rem] text-(--primary-color) whitespace-nowrap">
          {t("LOGIN.CONTINUE_WITH")}
        </span>
        <Divider />
      </div>
    </div>
  );
}
