import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { PHONE_REGEX } from "~/constants/regex-common";

const baseTeacherSchema = zod.object({
  firstName: zod.string().min(1, createRequireMessageByField("Họ")),
  lastName: zod.string().min(1, createRequireMessageByField("Tên")),
  dateOfBirth: zod.string().min(1, createRequireMessageByField("Ngày sinh")),
  gender: zod.number().nullish(),
  phoneNumber: zod
    .string()
    .min(1, createRequireMessageByField("Số điện thoại"))
    .regex(PHONE_REGEX, { message: "Số điện thoại không phù hợp" })
    .default(""),
  email: zod.string().min(1, createRequireMessageByField("Email")).default(""),
});

export const updateTeacherSchema = toTypedSchema(baseTeacherSchema);
export const createTeacherSchema = toTypedSchema(baseTeacherSchema);
