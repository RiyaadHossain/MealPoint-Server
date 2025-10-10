import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "../src/config/index";
import { Category } from "../src/app/modules/categories/category.model.ts";
import { Combo } from "../src/app/modules/combos/combo.model.ts";
import { Menu } from "../src/app/modules/menus/menu.model.ts";
import { slugify } from "../src/utils/slugify.ts";

dotenv.config();

const MONGO_URI = config.MONGO_URI;

async function addSlugs() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to DB");

  const models = [
    { Model: Category, name: "Category" },
    { Model: Combo, name: "Combo" },
    { Model: Menu, name: "Menu" },
  ];

  for (const { Model, name } of models) {
    console.log(`\nProcessing ${name}s...`);
    // @ts-ignore
    const docs = await Model.find({ slug: { $exists: false } });
    console.log(`Found ${docs.length} documents without slug`);

    for (const doc of docs) {
      doc.slug = slugify(doc.name);
      await doc.save();
      console.log(`✅ ${name}: "${doc.name}" -> slug: "${doc.slug}"`);
    }
  }

  console.log("\nAll slugs generated successfully!");
  await mongoose.disconnect();
  console.log("✅ Disconnected from DB");
}

addSlugs().catch((err) => {
  console.error(err);
  process.exit(1);
});
