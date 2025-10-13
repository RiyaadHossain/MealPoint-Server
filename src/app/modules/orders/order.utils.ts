import { TAX_RATE } from "../settings/setting.constants.js";
import { AdminSettings } from "../settings/setting.model.js"

export const getTaxAmount = async(amount: number) => {
    let taxRate: any = (await AdminSettings.findOne({ key: TAX_RATE }))?.value
    taxRate = Number(taxRate);

    const tax = Math.round((amount * taxRate) / 100);
    return tax;
}