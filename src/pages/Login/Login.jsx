import { useFormik } from "formik";
import * as Yup from "yup";
import { loginApi } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import InputField from "../../components/form/InputField";

const validationSchema = Yup.object({
  username: Yup.string().required("Username required"),
  password: Yup.string().required("Password required"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const { token } = await loginApi(values);

        /**
         * FakeStore returns only token
         * We build user object ourselves
         */
        login({
          username: values.username,
          token,
        });
        navigate(ROUTES.HOME);
      } catch (error) {
        console.log(error);
        setStatus("Invalid username or password");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="auth-form">
      <h2>Login</h2>

      <InputField
        label="Username"
        name="username"
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.username}
        touched={formik.touched.username}
        placeholder="Enter username"
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.password}
        touched={formik.touched.password}
        placeholder="Enter password"
      />

      {formik.status && (
        <p className="form-error">{formik.status}</p>
      )}
      <button type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
