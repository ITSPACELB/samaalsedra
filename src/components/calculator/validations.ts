import { z } from "zod";

export function validateNumeric(value: string, min: number, max: number, errorMsg: string) {
  if (!value || String(value).trim() === "") return "";
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max && Number.isInteger(num) ? "" : errorMsg;
}

export const userSchema = z.object({
  ampHour: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      return typeof val === "number" ? val : parseFloat(String(val));
    },
    z.number()
      .min(1, "يجب أن يكون الأمبير/ساعة بين 1 و1000")
      .max(1000, "يجب أن يكون الأمبير/ساعة بين 1 و1000")
  ).or(z.undefined()),

  cycleCut: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      return typeof val === "number" ? val : parseFloat(String(val));
    },
    z.number()
      .min(1, "يجب أن تكون مدة القطع بين 1 و24 ساعة")
      .max(24, "يجب أن تكون مدة القطع بين 1 و24 ساعة")
  ).or(z.undefined()),

  cycleSupply: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      return typeof val === "number" ? val : parseFloat(String(val));
    },
    z.number()
      .min(1, "يجب أن تكون ساعات التوفر بين 1 و24 ساعة")
      .max(24, "يجب أن تكون ساعات التوفر بين 1 و24 ساعة")
  ).or(z.undefined()),

phone: z
  .union([
    z.string().regex(/^[0-9]{10,15}$/, { message: "رقم الهاتف غير صالح" }),
    z.literal("").transform(() => undefined), // يسمح بقيمة فارغة
  ])
  .optional(),
});
