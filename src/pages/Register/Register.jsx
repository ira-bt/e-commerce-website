import { useFormik } from "formik"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { ROUTES } from "../../utils/routes"
import InputField from "../../components/form/InputField"
import { userService } from "../../services/user.service"
import { VALIDATION_MESSAGES as VM } from "../../utils/validationMessages"
import { fakeStoreUserService } from "../../services/fakestoreUser.service"
import { registerSchema } from "../../utils/validationSchemas"
import { USER_ROLES } from "../../utils/enums"

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: USER_ROLES.USER,
    },
    validationSchema: registerSchema,
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        /**
         * 1️⃣ Check LOCAL users first
         */
        const localUser = userService.findByUsername(values.username)

        if (localUser) {
          setStatus(VM.USERNAME_EXISTS)
          return
        }

        /**
         * 2️⃣ Fallback to FakeStore API users
         */
        const apiUserExists = await fakeStoreUserService.usernameExists(values.username)

        if (apiUserExists) {
          setStatus(VM.USERNAME_EXISTS)
          return
        }

        /**
         * 3️⃣ Safe to register - create via API and sync to localStorage
         */
        const newUser = await userService.createWithAPI(values)

        login({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          token: crypto.randomUUID(),
        })

        navigate(ROUTES.HOME)
      } catch (error) {
        console.error(error)
        setStatus(VM.REGISTRATION_FAILED)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="auth-form">
      <h2>Create Account</h2>

      <InputField
        {...formik.getFieldProps("username")}
        label="Username"
        error={formik.errors.username}
        touched={formik.touched.username}
      />

      <InputField
        {...formik.getFieldProps("email")}
        label="Email"
        error={formik.errors.email}
        touched={formik.touched.email}
      />

      <InputField
        {...formik.getFieldProps("password")}
        label="Password"
        type="password"
        error={formik.errors.password}
        touched={formik.touched.password}
      />

      <InputField
        {...formik.getFieldProps("confirmPassword")}
        label="Confirm Password"
        type="password"
        error={formik.errors.confirmPassword}
        touched={formik.touched.confirmPassword}
      />

      <div className="form-group">
        <label htmlFor="role">Account Type</label>
        <select id="role" {...formik.getFieldProps("role")} className="form-input">
          <option value={USER_ROLES.USER}>Customer</option>
          <option value={USER_ROLES.ADMIN}>Administrator</option>
        </select>
      </div>

      {formik.status && <p className="form-error">{formik.status}</p>}

      <button disabled={!formik.isValid || formik.isSubmitting}>Register</button>

      <p className="auth-form__switch">
        Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
      </p>
    </form>
  )
}
