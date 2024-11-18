import { i18n } from "i18n-config";
import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import StarRarity from "@components/StarRarity";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Potion } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "potions");
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Potions List",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Discover all the alchemy recipes and the best potions and oils to use for your team.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/potions`,
    locale,
  });
}

export default async function GenshinIngredients({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(lang, "genshin", "potions");

  const potions = await getGenshinData<Potion[]>({
    resource: "potions",
    language: langData,
    select: ["id", "name", "rarity", "effect"],
  });

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "cooking_ingredient", defaultMessage: "Cooking Ingredient" })}
      </h2>
      <div className="card">
        <table className="w-full">
          <thead>
            <tr>
              <th></th>
              <th>{t({ id: "name", defaultMessage: "Name" })}</th>
              <th>{t({ id: "rarity", defaultMessage: "Rarity" })}</th>
              <th>{t({ id: "effect", defaultMessage: "Effect" })}</th>
            </tr>
          </thead>
          <tbody>
            {potions.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? "bg-vulcan-600" : "bg-vulcan-700"}
              >
                <td>
                  <img
                    height={54}
                    width={54}
                    src={getUrl(`/potions/${row.id}.png`, 54, 54)}
                    alt={row.name}
                  />
                </td>
                <td>{row.name}</td>
                <td>
                  <StarRarity rarity={row.rarity} />
                </td>
                <td>{row.effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
