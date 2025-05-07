import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import RichTextEditor from './RichTextEditor';

interface ScholarshipFormProps {
  scholarshipId?: string | null;
}

interface ScholarshipData {
  title: string;
  content: string;
  country: string;
  deadline: string;
  funding_type: string;
  host_institution: string;
  level_of_study: string;
  official_link: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
}

const initialData: ScholarshipData = {
  title: '',
  content: '',
  country: '',
  deadline: '',
  funding_type: '',
  host_institution: '',
  level_of_study: '',
  official_link: '',
  category: 'government-scholarship',
  tags: [],
  status: 'draft'
};

const ScholarshipForm: React.FC<ScholarshipFormProps> = ({ scholarshipId }) => {
  const [formData, setFormData] = useState<ScholarshipData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (scholarshipId) {
      fetchScholarship();
    }
  }, [scholarshipId]);

  const fetchScholarship = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('id', scholarshipId)
        .single();

      if (error) throw error;
      if (data) setFormData(data);
    } catch (err) {
      console.error('Error fetching scholarship:', err);
      setError('Failed to load scholarship data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const scholarshipData = {
        ...formData,
        author_id: userData.user.id
      };

      let result;
      if (scholarshipId) {
        // Update existing scholarship
        result = await supabase
          .from('scholarships')
          .update(scholarshipData)
          .eq('id', scholarshipId);
      } else {
        // Create new scholarship
        result = await supabase
          .from('scholarships')
          .insert([scholarshipData]);
      }

      if (result.error) throw result.error;

      setSuccess('Scholarship saved successfully!');
      if (!scholarshipId) {
        setFormData(initialData); // Reset form for new entries
      }
    } catch (err) {
      console.error('Error saving scholarship:', err);
      setError('Failed to save scholarship');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({ ...prev, tags }));
  };

  if (loading && scholarshipId) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading scholarship data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg">
          {success}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Funding Type
            </label>
            <select
              name="funding_type"
              value={formData.funding_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Funding Type</option>
              <option value="Full Fund">Full Fund</option>
              <option value="Full Tuition">Full Tuition</option>
              <option value="Partial Fund">Partial Fund</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Host Institution
            </label>
            <input
              type="text"
              name="host_institution"
              value={formData.host_institution}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level of Study
            </label>
            <select
              name="level_of_study"
              value={formData.level_of_study}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Level</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Official Link
            </label>
            <input
              type="url"
              name="official_link"
              value={formData.official_link}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="government-scholarship">Government Scholarship</option>
              <option value="university-scholarship">University Scholarship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. engineering, europe, full-funding"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.location.href = '/admin/scholarships'}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Scholarship'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ScholarshipForm;