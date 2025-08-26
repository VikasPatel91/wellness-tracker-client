// components/Dashboard/EditMetric.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditMetric = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    steps: "",
    sleep: "",
    mood: "Neutral",
    date: ""
  });
  const token = localStorage.getItem("token");

  // Fetch metric details
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/metrics/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Make sure date is ISO formatted for <input type="date">
        const metric = res.data;
        setFormData({
          ...metric,
          date: metric.date ? metric.date.split("T")[0] : "",
        });
      })
      .catch((err) => console.error(err));
  }, [id, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/metrics/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Metric</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="steps"
          value={formData.steps}
          onChange={handleChange}
          placeholder="Steps"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="sleep"
          value={formData.sleep}
          onChange={handleChange}
          placeholder="Sleep (hours)"
          className="w-full p-2 border rounded"
        />
        <select
          name="mood"
          value={formData.mood}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Happy">Happy</option>
          <option value="Neutral">Neutral</option>
          <option value="Tired">Tired</option>
          <option value="Stressed">Stressed</option>
        </select>
        <input
          type="date"
          name="date"
          value={formData.date || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditMetric;
