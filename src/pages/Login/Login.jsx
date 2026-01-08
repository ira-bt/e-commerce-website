import { useFormik } from "formik"
import { loginApi } from "../../services/auth.service"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate, Link } from "react-router-dom"
import { ROUTES } from "../../utils/routes"
import InputField from "../../components/form/InputField"
import { userService } from "../../services/user.service"
import { VALIDATION_MESSAGES as VM } from "../../utils/validationMessages"
import { loginSchema } from "../../utils/validationSchemas"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        /**
         * 1️⃣ Try LOCAL login first
         */
        const localUser = userService.findByUsername(values.username)

        if (localUser && localUser.password === values.password) {
          login({
            id: localUser.id,
            username: localUser.username,
            email: localUser.email,
            role: localUser.role,
            token: crypto.randomUUID(),
          })

          navigate(ROUTES.HOME)
          return
        }

        /**
         * 2️⃣ Fallback to FakeStore API
         */
        const { token } = await loginApi(values)

        login({
          username: values.username,
          token,
        })

        navigate(ROUTES.HOME)
      } catch {
        setStatus(VM.INVALID_CREDENTIALS)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="auth-form">
      <h2>Login</h2>
      <InputField
        {...formik.getFieldProps("username")}
        label="Username"
        error={formik.errors.username}
        touched={formik.touched.username}
      />

      <InputField
        {...formik.getFieldProps("password")}
        label="Password"
        type="password"
        error={formik.errors.password}
        touched={formik.touched.password}
      />

      {formik.status && <p className="form-error">{formik.status}</p>}

      <button disabled={!formik.isValid || formik.isSubmitting}>Login</button>

      <p className="auth-form__switch">
        Don&apos;t have an account? <Link to={ROUTES.REGISTER}>Register</Link>
      </p>
    </form>
  )
}
