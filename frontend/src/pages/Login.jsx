import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    tenantSubdomain: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Subdomain is optional for super admin
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password, formData.tenantSubdomain);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      tenantSubdomain: "demo",
      email: "admin@demo.com",
      password: "Demo@123",
    });
    setError("");
  };

  const fillSuperAdminCredentials = () => {
    setFormData({
      tenantSubdomain: "",
      email: "superadmin@system.com",
      password: "Admin@123",
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">GPP</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Login to your SaaS platform</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Subdomain{" "}
              <span className="text-xs text-gray-500">
                (optional for super admin)
              </span>
            </label>
            <input
              type="text"
              name="tenantSubdomain"
              value={formData.tenantSubdomain}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="company"
            />
            <p className="text-xs text-gray-500 mt-1">
              e.g., 'demo' for demo.saasapp.com. Leave empty for super admin
              login.
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="admin@company.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:text-blue-800"
          >
            Register here
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-blue-900">
              Demo Tenant Admin:
            </p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition"
            >
              Fill Form
            </button>
          </div>
          <p className="text-xs text-blue-800">
            Subdomain: <span className="font-mono">demo</span>
          </p>
          <p className="text-xs text-blue-800">
            Email: <span className="font-mono">admin@demo.com</span>
          </p>
          <p className="text-xs text-blue-800">
            Password: <span className="font-mono">Demo@123</span>
          </p>
        </div>

        {/* Super Admin Credentials */}
        <div className="mt-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-purple-900">
              Super Admin:
            </p>
            <button
              type="button"
              onClick={fillSuperAdminCredentials}
              className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded hover:bg-purple-700 transition"
            >
              Fill Form
            </button>
          </div>
          <p className="text-xs text-purple-800">
            Subdomain: <span className="font-mono italic">(leave empty)</span>
          </p>
          <p className="text-xs text-purple-800">
            Email: <span className="font-mono">superadmin@system.com</span>
          </p>
          <p className="text-xs text-purple-800">
            Password: <span className="font-mono">Admin@123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
