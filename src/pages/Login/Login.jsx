import { useFormik } from "formik";
import * as Yup from "yup";
import { loginApi } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/routes";

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
        navigate(ROUTES.HOME, {replace: true});
      } catch (error) {
        setStatus("Invalid username or password");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Login</h2>

      <input
        name="username"
        placeholder="Username"
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.username && formik.errors.username && (<p>{formik.errors.username}</p>)}

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.password && formik.errors.password && (<p>{formik.errors.password}</p>)}

      {formik.status && <p>{formik.status}</p>}

      <button type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
