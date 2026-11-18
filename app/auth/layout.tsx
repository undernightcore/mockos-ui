import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations();

  return (
    <div className="grid h-full w-full grid-cols-2">
      <div className="flex flex-col justify-between p-10">
        <Image
          className="h-10 w-10"
          src="/mockos-logo.svg"
          alt="Mockos"
          width={40}
          height={40}
        />

        <div className="flex flex-col w-full gap-4 max-w-104">
          <h5 className="text-(--primary-color) text-5xl">{t("AUTH.TITLE")}</h5>
          <p className="text-(--primary-color) text-lg">{t("AUTH.SUBTITLE")}</p>
        </div>
      </div>
      <div className="flex">{children}</div>
    </div>
  );
}
