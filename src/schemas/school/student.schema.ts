import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

const baseStudentSchema = zod.object({
  firstName: zod.string().min(1, createRequireMessageByField("Họ")),
  lastName: zod.string().min(1, createRequireMessageByField("Tên")),
  dateOfBirth: zod.string().min(1, createRequireMessageByField("Ngày sinh")),
  gender: zod.number().nullish(),
});

export const createStudentSchema = toTypedSchema(baseStudentSchema);
export const updateStudentSchema = toTypedSchema(baseStudentSchema);
