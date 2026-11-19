"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import TextInput from "@/components/TextInput";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const t = useTranslations();

  const loginSchema = z.object({
    email: z.string().trim().min(1, t("COMMON.REQUIRED")),
    password: z.string().trim().min(1, t("COMMON.REQUIRED")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  function login(_values: LoginFormValues) {
    // TODO: add logic
  }

  function loginOAuth() {
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

      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(login)}
        noValidate
      >
        <TextInput
          title={t("LOGIN.EMAIL")}
          placeholder={t("LOGIN.EMAIL_PLACEHOLDER")}
          name="email"
          type="email"
          inputProps={register("email")}
          error={errors.email?.message}
          link={t("LOGIN.FORGOT_PASSWORD")}
        />

        <TextInput
          title={t("LOGIN.PASSWORD")}
          placeholder={t("LOGIN.PASSWORD_PLACEHOLDER")}
          name="password"
          type="password"
          inputProps={register("password")}
          error={errors.password?.message}
        />

        <Button type="submit">
          {t("LOGIN.SIGN_IN")}
          <Image
            className="h-3 w-3"
            src="/arrow-right.svg"
            alt="arrow right"
            width={12}
            height={12}
          />
        </Button>
      </form>

      <div className="w-full flex gap-2 items-center pt-10 pb-10">
        <Divider />
        <span className="text-[0.875rem] text-(--primary-color) whitespace-nowrap">
          {t("LOGIN.CONTINUE_WITH")}
        </span>
        <Divider />
      </div>

      <Button variant="secondary" onClick={loginOAuth}>
        <Image
          className="h-5 w-5"
          src="/google.svg"
          alt="arrow right"
          width={20}
          height={20}
        />
        {t("LOGIN.SIGN_IN_OAUTH")}
      </Button>

      <div className="w-full flex gap-2 text-[0.875rem] text-(--primary-color) pt-10 justify-center items-center">
        <span>{t("LOGIN.ACCOUNT_QUESTION")}</span>
        <Link
          className="text-(--link-color) hover:underline"
          href="/auth/register"
        >
          {t("LOGIN.SIGN_UP")}
        </Link>
      </div>
    </div>
  );
}
