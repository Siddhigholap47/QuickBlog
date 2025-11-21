// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { useAppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";
import { assets as sharedAssets } from "../../assets/assets"; // adjust path if needed

const DEFAULT_DASH = { blogs: 0, comments: 0, drafts: 0, recentBlogs: [] };

const Dashboard = () => {
  const { axios } = useAppContext(); // configured axios from AppContext
  const [dashboard, setDashboard] = useState(DEFAULT_DASH);
  const pollingRef = useRef(null);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
      if (data?.success && data.dashboard) {
        // Expect { dashboard: { blogs, comments, drafts, recentBlogs: [...] } }
        setDashboard({
          blogs: data.dashboard.blogs ?? 0,
          comments: data.dashboard.comments ?? 0,
          drafts: data.dashboard.drafts ?? 0,
          recentBlogs: Array.isArray(data.dashboard.recentBlogs) ? data.dashboard.recentBlogs : [],
        });
      } else {
        // If server returns success:false, show message but do not wipe local state
        toast.error(data?.message || "Could not load dashboard");
      }
    } catch (err) {
      console.error("[Dashboard] fetchDashboard error:", err);
      toast.error(err?.response?.data?.message || err.message || "Network error");
    }
  };

  useEffect(() => {
    // initial fetch
    fetchDashboard();

    // start polling every 10s for "real-time" feel
    pollingRef.current = setInterval(fetchDashboard, 10000);

    // cleanup
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { blogs, comments, drafts, recentBlogs } = dashboard;

  return (
    <div className="p-6">
      {/* Top stat cards */}
      <div className="flex gap-6 mb-6">
        <div className="bg-white rounded p-6 shadow w-48 text-center">
          <img src={sharedAssets.dashboard_icon_1} alt="Blogs" className="w-10 mx-auto mb-2" />
          <div className="text-xl font-semibold">{blogs}</div>
          <div className="text-sm text-gray-500">Blogs</div>
        </div>

        <div className="bg-white rounded p-6 shadow w-48 text-center">
          <img src={sharedAssets.dashboard_icon_2} alt="Comments" className="w-10 mx-auto mb-2" />
          <div className="text-xl font-semibold">{comments}</div>
          <div className="text-sm text-gray-500">Comments</div>
        </div>

        <div className="bg-white rounded p-6 shadow w-48 text-center">
          <img src={sharedAssets.dashboard_icon_3} alt="Drafts" className="w-10 mx-auto mb-2" />
          <div className="text-xl font-semibold">{drafts}</div>
          <div className="text-sm text-gray-500">Drafts</div>
        </div>
      </div>

      {/* Latest blogs table */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4">Latest Blogs</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left font-semibold">#</th>
                <th className="p-3 text-left font-semibold">Blog Title</th>
                <th className="p-3 text-left font-semibold">Date</th>
                <th className="p-3 text-left font-semibold">Status</th>
                <th className="p-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBlogs && recentBlogs.length > 0 ? (
                recentBlogs.map((b, i) => (
                  <tr key={b._id ?? i} className="border-t">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">
                      <div className="font-medium">{b.title}</div>
                      <div className="text-sm text-gray-500">{b.subTitle}</div>
                    </td>
                    <td className="p-3">{moment(b.createdAt).format("ddd MMM DD YYYY")}</td>
                    <td className="p-3">
                      {b.isPublished ? (
                        <span className="text-green-600 font-medium">Published</span>
                      ) : (
                        <span className="text-gray-500 font-medium">Draft</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button className="px-3 py-1 rounded border text-sm">Unpublish</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No recent blogs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
