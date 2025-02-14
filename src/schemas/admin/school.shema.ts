import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import {
  AFTERNOON_TIME_REGEX,
  MORNING_TIME_REGEX,
  PHONE_REGEX,
} from "~/constants/regex-comon";

export const schoolSchema = toTypedSchema(
  zod.object({
    name: zod
      .string()
      .min(1, createRequireMessageByField("Tên trường"))
      .default(""),
    schoolType: zod.number().nullish(),
    schoolDescription: zod.string().nullable().optional(),
    address: zod
      .string()
      .min(1, createRequireMessageByField("Địa chỉ"))
      .default(""),
    morningStarttime: zod
      .string()
      .min(1, createRequireMessageByField("Thời gian bắt đầu ca sáng"))
      .regex(MORNING_TIME_REGEX, "Thời gian sáng không hợp lệ, ví dụ: 07:00:00")
      .default(""),
    morningEndtime: zod
      .string()
      .min(1, createRequireMessageByField("Thời gian kết thúc ca sáng"))
      .regex(
        MORNING_TIME_REGEX,
        "Thời gian kết thúc ca sáng không hợp lệ, ví dụ: 11:30:00"
      )
      .default(""),
    afternoonEndtime: zod
      .string()
      .min(1, createRequireMessageByField("Thời gian bắt đầu ca chiều"))
      .regex(
        AFTERNOON_TIME_REGEX,
        "Thời gian bắt đầu ca chiều không hợp lệ, ví dụ: 13:00:00"
      )
      .default(""),
    afternoonStarttime: zod
      .string()
      .min(1, createRequireMessageByField("Thời gian kết thúc ca chiều"))
      .regex(
        AFTERNOON_TIME_REGEX,
        "Thời gian kết thúc ca chiều không hợp lệ, ví dụ: 16:30:00"
      )
      .default(""),
    email: zod
      .string()
      .min(1, createRequireMessageByField("Email"))
      .default(""),
    phoneNumber: zod
      .string()
      .min(1, createRequireMessageByField("Số điện thoại"))
      .regex(PHONE_REGEX, { message: "Số điện thoại không phù hợp" })
      .default(""),
  })
);
