import { useFormik } from "formik";
import * as Yup from "yup";
import { loginApi } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";

const validationSchema = Yup.object({
  username: Yup.string().required("Username required"),
  password: Yup.string().required("Password required"),
});

export default function Login() {
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const { token } = await loginApi(values);

        login({
          username: values.username,
          token,
        });
      } catch (error) {
        setStatus("Invalid credentials");
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
        value={formik.values.username}
        onChange={formik.handleChange}
      />
      {formik.errors.username && <p>{formik.errors.username}</p>}

      <input
        type="password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
      />
      {formik.errors.password && <p>{formik.errors.password}</p>}

      {formik.status && <p>{formik.status}</p>}

      <button type="submit" disabled={formik.isSubmitting}>
        Login
      </button>
    </form>
  );
}
