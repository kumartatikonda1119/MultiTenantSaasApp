import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [projects, setProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get tenant info
      if (user?.tenant) {
        const tenantRes = await api.get(`/tenants/${user.tenant.id}`);
        if (tenantRes.data.success) {
          setStats((prev) => ({
            ...prev,
            totalProjects: tenantRes.data.data.stats.totalProjects,
            totalTasks: tenantRes.data.data.stats.totalTasks,
          }));
        }
      }

      // Get projects
      const projectsRes = await api.get("/projects?limit=5");
      if (projectsRes.data.success) {
        setProjects(projectsRes.data.data.projects);
      }

      // Get my tasks
      const tasksRes = await api.get(`/projects?limit=100`);
      if (tasksRes.data.success) {
        // This is a simplified version - in real scenario, you'd get tasks for assigned user
        setMyTasks([]);
      }

      // Calculate completed and pending tasks
      let completed = 0,
        pending = 0;
      projects.forEach((project) => {
        completed += project.completedTaskCount;
        pending += project.taskCount - project.completedTaskCount;
      });

      setStats((prev) => ({
        ...prev,
        completedTasks: completed,
        pendingTasks: pending,
      }));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, label, value, color }) => (
    <div
      className={`bg-white rounded-lg shadow p-6 border-l-4 border-${color}-500`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`text-4xl text-${color}-500`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.fullName}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="📊"
            label="Total Projects"
            value={stats.totalProjects}
            color="blue"
          />
          <StatCard
            icon="✅"
            label="Completed Tasks"
            value={stats.completedTasks}
            color="green"
          />
          <StatCard
            icon="⏳"
            label="Pending Tasks"
            value={stats.pendingTasks}
            color="yellow"
          />
          <StatCard
            icon="📈"
            label="Total Tasks"
            value={stats.totalTasks}
            color="purple"
          />
        </div>

        {/* Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Projects
                </h2>
                <Link
                  to="/projects"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  View All →
                </Link>
              </div>

              {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">No projects yet</p>
                  <Link
                    to="/projects"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Create your first project →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {project.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                project.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {project.status}
                            </span>
                            <span className="text-xs text-gray-600">
                              {project.completedTaskCount}/{project.taskCount}{" "}
                              tasks completed
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/projects"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                + New Project
              </Link>
              <Link
                to="/projects"
                className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                View All Projects
              </Link>
              {user?.role === "tenant_admin" && (
                <Link
                  to="/users"
                  className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Manage Users
                </Link>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2">Your Info</h3>
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {user?.email}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Role:</strong> {user?.role}
              </p>
              {user?.tenant && (
                <p className="text-sm text-gray-700">
                  <strong>Org:</strong> {user.tenant.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
