import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

export const schoolLoginSchema = toTypedSchema(
  zod.object({
    username: zod.string().min(1, createRequireMessageByField("Tên đăng nhập")),
    password: zod.string().min(1, createRequireMessageByField("Mật khẩu")),
  })
);
