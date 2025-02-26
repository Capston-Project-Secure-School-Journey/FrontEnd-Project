import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

const baseClassSchema = zod.object({
  className: zod.string().min(1, createRequireMessageByField("Tên lớp")),
  numberOfStudent: zod
    .number()
    .min(0, createRequireMessageByField("Số lượng"))
    .default(0),
});

export const createClassSchema = toTypedSchema(baseClassSchema);
export const updateClassSchema = toTypedSchema(baseClassSchema);
