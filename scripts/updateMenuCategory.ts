import { Discount } from "@/app/modules/discounts/discount.model.js";


export async function updateDBScript() {
  {
    // Fetch all LEVEL_BASED discounts
    const discounts = await Discount.find({ type: "LEVEL_BASED" });

    for (const discount of discounts) {
      let newLevel = "";

      // Determine level based on title
      const titleLower = discount.title.toLowerCase();
      if (titleLower.includes("bronze")) newLevel = "bronze";
      else if (titleLower.includes("silver")) newLevel = "silver";
      else if (titleLower.includes("gold")) newLevel = "gold";
      else if (titleLower.includes("platinum")) newLevel = "platinum";

      if (newLevel) {
        discount.level = newLevel;
        await discount.save();
        console.log(
          `Updated discount "${discount.title}" with level: ${newLevel}`
        );
      } else {
        console.log(
          `Skipping discount "${discount.title}" - could not determine level`
        );
      }
    }

    console.log("All LEVEL_BASED discounts updated!");
    process.exit(0);
  }
}
