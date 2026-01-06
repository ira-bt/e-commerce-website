import * as Yup from "yup";
import { REGEX } from "./validations";
import { VALIDATION_MESSAGES as VM } from "./validationMessages";

/* =========================
   Login Schema
========================= */
export const loginSchema = Yup.object({
  username: Yup.string()
    .required(VM.REQUIRED_USERNAME),

  password: Yup.string()
    .matches(REGEX.PASSWORD, VM.INVALID_PASSWORD_FORMAT)
    .required(VM.REQUIRED_PASSWORD),
});

/* =========================
   Register Schema
========================= */
export const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, VM.USERNAME_MIN_LENGTH)
    .required(VM.REQUIRED_USERNAME),

  email: Yup.string()
    .matches(REGEX.EMAIL, VM.INVALID_EMAIL)
    .required(VM.REQUIRED_EMAIL),

  password: Yup.string()
    .matches(REGEX.PASSWORD, VM.INVALID_PASSWORD_FORMAT)
    .required(VM.REQUIRED_PASSWORD),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], VM.PASSWORD_MISMATCH)
    .required(VM.REQUIRED_PASSWORD),
});
