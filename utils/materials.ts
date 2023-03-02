import GenshinData from "genshin-data";

export type Material = {
  id: string;
  name: string;
  rarity: number;
  type: string;
};

export const allTypes = [
  "materials",
  "common_materials",
  "elemental_stone_materials",
  "jewels_materials",
  "local_materials",
  "talent_lvl_up_materials",
  "weapon_primary_materials",
  "weapon_secondary_materials",
];

export async function getAllMaterialsMap(
  genshinData: GenshinData
): Promise<Record<string, Material>> {
  const characterExpMaterials = await genshinData.characterExpMaterials({
    select: ["id", "name", "rarity"],
  });
  const commonMaterials = await genshinData.commonMaterials({
    select: ["id", "name", "rarity"],
  });
  const elementalStoneMaterials = await genshinData.elementalStoneMaterials({
    select: ["id", "name", "rarity"],
  });
  const jewelsMaterials = await genshinData.jewelsMaterials({
    select: ["id", "name", "rarity"],
  });
  const localMaterials = await genshinData.localMaterials({
    select: ["id", "name"],
  });
  const talentLvlUpMaterials = await genshinData.talentLvlUpMaterials({
    select: ["id", "name", "rarity"],
  });
  const weaponExpMaterials = await genshinData.weaponExpMaterials({
    select: ["id", "name", "rarity"],
  });
  const weaponPrimaryMaterials = await genshinData.weaponPrimaryMaterials({
    select: ["id", "name", "rarity"],
  });
  const weaponSecondaryMaterials = await genshinData.weaponSecondaryMaterials({
    select: ["id", "name", "rarity"],
  });

  const materialsMap: any = {};
  // iterate through all materials arrays
  characterExpMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "materials",
    };
  });

  commonMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "common_materials",
    };
  });

  elementalStoneMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "elemental_stone_materials",
    };
  });

  jewelsMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "jewels_materials",
    };
  });

  localMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: 1,
      type: "local_materials",
    };
  });

  talentLvlUpMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "talent_lvl_up_materials",
    };
  });

  weaponExpMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "materials",
    };
  });

  weaponPrimaryMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "weapon_primary_materials",
    };
  });

  weaponSecondaryMaterials.forEach((mat) => {
    materialsMap[mat.id] = {
      name: mat.name,
      rarity: mat.rarity,
      type: "weapon_secondary_materials",
    };
  });

  materialsMap["mora"] = {
    name: "Mora",
    rarity: 1,
    type: "materials",
  };

  return materialsMap;
}
