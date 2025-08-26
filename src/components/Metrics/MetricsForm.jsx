// components/Metrics/MetricsForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { metricsAPI } from '../../services/api';

const MetricsForm = () => {
  const [formData, setFormData] = useState({
    date: new Date(),
    steps: '',
    sleep: '',
    mood: 'Neutral',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      loadMetric();
    }
  }, [id]);

  const loadMetric = async () => {
    try {
      const response = await metricsAPI.getOne(id);
      const metric = response.data;
      setFormData({
        date: new Date(metric.date),
        steps: metric.steps,
        sleep: metric.sleep,
        mood: metric.mood,
        notes: metric.notes || ''
      });
    } catch (err) {
      setError('Failed to load metric');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const payload = {
      ...formData,
      steps: parseInt(formData.steps),
      sleep: parseFloat(formData.sleep),
    };

    if (isEdit) {
      await metricsAPI.update(id, payload);
    } else {
      await metricsAPI.createOrUpdate(payload);
    }

    navigate('/dashboard');
  } catch (err) {
    if (err.response?.data?.message) {
      setError(err.response.data.message); 
    } else {
      setError('Failed to save metric');
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Entry' : 'Add New Entry'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Date
          </label>
          <DatePicker
            selected={formData.date}
            onChange={(date) => setFormData({ ...formData, date })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="steps">
            Steps
          </label>
          <input
            type="number"
            id="steps"
            name="steps"
            value={formData.steps}
            onChange={handleChange}
            min="0"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sleep">
            Sleep Hours
          </label>
          <input
            type="number"
            id="sleep"
            name="sleep"
            value={formData.sleep}
            onChange={handleChange}
            min="0"
            max="24"
            step="0.5"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mood">
            Mood
          </label>
          <select
            id="mood"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Happy">Happy</option>
            <option value="Neutral">Neutral</option>
            <option value="Tired">Tired</option>
            <option value="Stressed">Stressed</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Entry' : 'Add Entry')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MetricsForm;