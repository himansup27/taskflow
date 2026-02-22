import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/\d/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const { register: registerUser, isLoading, error, clearError, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    clearError();
    const result = await registerUser({ name: data.name, email: data.email, password: data.password });
    if (result.success) navigate("/dashboard", { replace: true });
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authBrand}>
          <div className={styles.brandIcon}>T</div>
          <span>TaskFlow</span>
        </div>

        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Create account</h1>
          <p className={styles.authSubtitle}>Start managing your projects today</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm} noValidate>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Himansu Dey"
              {...register("name")}
            />
            {errors.name && <span className="form-error">⚠ {errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && <span className="form-error">⚠ {errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-input ${errors.password ? "error" : ""}`}
              placeholder="Min 6 chars, include a number"
              {...register("password")}
            />
            {errors.password && <span className="form-error">⚠ {errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-input ${errors.confirmPassword ? "error" : ""}`}
              placeholder="••••••••"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <span className="form-error">⚠ {errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading} style={{ width: "100%", marginTop: 8 }}>
            {isLoading ? <><span className="spinner" /> Creating account...</> : "Create Account"}
          </button>
        </form>

        <p className={styles.authSwitch}>
          Already have an account?{" "}
          <Link to="/login" onClick={clearError}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;