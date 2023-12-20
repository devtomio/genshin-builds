import type { Achievement } from "@interfaces/hsr";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import List from "./list";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { i18n } from "i18n-config";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "hsr",
    "achievements"
  );
  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail Achievements",
  });
  const description = t({
    id: "description",
    defaultMessage: "A complete list of all achievements in Honkai: Star Rail.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/achievements`,
    locale,
  });
}

export default async function HSRAchievementsPage({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "hsr",
    "achievements"
  );

  const achievements = await getHSRData<Achievement[]>({
    resource: "achievements",
    language: langData,
  });

  const rewardValue = {
    Low: 5,
    Mid: 10,
    High: 20,
  };

  const allSeriesText = [
    ...new Set(
      achievements.map((a) => a.seriesText).filter((a) => a !== undefined)
    ),
  ];
  const categories = allSeriesText
    .map((name) => {
      const a = achievements.filter((a) => a.seriesText === name);
      const nonDuplicate = [...new Set(a.map((a) => a._id))];

      return {
        id: a[0].seriesId,
        name,
        achievements: nonDuplicate.map((id) => ({
          _id: id,
          r: rewardValue[a.find((a) => a._id === id)?.rarity || "Low"],
        })),
      };
    })
    .sort((a, b) => a.id - b.id);
  const achievementsMap = achievements.reduce(
    (a, b) => {
      a[b._id] = b;
      return a;
    },
    {} as Record<number, Achievement>
  );

  return (
    <div>
      <div className="my-2">
        <h2 className="text-3xl font-semibold uppercase text-slate-100">
          {t({
            id: "achievements",
            defaultMessage: "Achievements",
          })}
        </h2>
        <p className="px-4 text-sm">
          {t({
            id: "achievements_desc",
            defaultMessage:
              "List of all achievements in Honkai Star Rail and how to complete them so you can score some Stellar Jades easily.",
          })}
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <List
        achievements={achievementsMap}
        categories={categories}
        rewardValue={rewardValue}
      />
    </div>
  );
}
