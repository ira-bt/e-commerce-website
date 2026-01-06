import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../utils/routes";
import InputField from "../../components/form/InputField";
import { userService } from "../../services/user.service";
import { VALIDATION_MESSAGES as VM } from "../../utils/validationMessages";
import { fakeStoreUserService } from "../../services/fakestoreUser.service";
import { registerSchema } from "../../utils/validationSchemas";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
        try {
            /**
             * 1️⃣ Check LOCAL users first
             */
            const localUser = userService.findByUsername(values.username);

            if (localUser) {
            setStatus(VM.USERNAME_EXISTS);
            return;
            }

            /**
             * 2️⃣ Fallback to FakeStore API users
             */
            const apiUserExists =
            await fakeStoreUserService.usernameExists(values.username);

            if (apiUserExists) {
            setStatus(VM.USERNAME_EXISTS);
            return;
            }

            /**
             * 3️⃣ Safe to register locally
             */
            const newUser = userService.create(values);

            login({
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            token: crypto.randomUUID(),
            });

            navigate(ROUTES.HOME);
        } catch (error) {
            console.error(error);
            setStatus(VM.REGISTRATION_FAILED);
        } finally {
            setSubmitting(false);
        }
        },

  });

  return (
    <form onSubmit={formik.handleSubmit} className="auth-form">
      <h2>Create Account</h2>

      <InputField {...formik.getFieldProps("username")} label="Username"
        error={formik.errors.username} touched={formik.touched.username} />

      <InputField {...formik.getFieldProps("email")} label="Email"
        error={formik.errors.email} touched={formik.touched.email} />

      <InputField {...formik.getFieldProps("password")} label="Password" type="password"
        error={formik.errors.password} touched={formik.touched.password} />

      <InputField {...formik.getFieldProps("confirmPassword")} label="Confirm Password" type="password"
        error={formik.errors.confirmPassword} touched={formik.touched.confirmPassword} />

      {formik.status && <p className="form-error">{formik.status}</p>}

      <button disabled={!formik.isValid || formik.isSubmitting}>
        Register
      </button>

      <p className="auth-form__switch">
        Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
      </p>
    </form>
  );
}
