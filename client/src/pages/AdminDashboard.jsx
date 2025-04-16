import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminDashboard.scss"; // Add styles for the dashboard

const AdminDashboard = () => {
  const [userActivities, setUserActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        const response = await axios.get("http://localhost:8080/admin/user-activities");
        console.log(response.data)
        setUserActivities(response.data);
      } catch (error) {
        console.error("Error fetching user activities:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivities();
  }, []);

  const handleBlockToggle = async (userId) => {
    try {
      const response = await axios.put(`http://localhost:8080/admin/user/${userId}/block`);
      alert(response.data.message);
      const updatedActivities = await axios.get("http://localhost:8080/admin/user-activities");
      setUserActivities(updatedActivities.data);
    } catch (error) {
      console.error("Error updating user status:", error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Properties</th>
            <th>Bookings</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userActivities.map((user) => (
            <tr key={user.userId}>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>{user.propertiesCount}</td>
              <td>{user.bookingsCount}</td>
              <td>
                <button
                  onClick={() => handleBlockToggle(user.userId)}
                  className={user.status === "blocked" ? "unblock-btn" : "block-btn"}
                >
                  {user.status === "blocked" ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
