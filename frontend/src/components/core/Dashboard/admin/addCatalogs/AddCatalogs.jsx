import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { categories, catalogCreate } from "../../../../../services/apis";
import axios from "axios";
import { useSelector } from "react-redux";

const AddCatalog = () => {
  const { token } = useSelector((state) => state.auth);
  const [categoriesList, setCategoriesList] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get(categories.CATEGORIES_API);
      if (data.success) setCategoriesList(data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description } = formData;

    if (!name.trim() || !description.trim()) {
      toast.warning("Please fill all fields");
      return;
    }

    setIsLoading(true);
    const api = editingId
      ? axiosInstance.put(`${catalogCreate.CATALOGPAGECREATE_API}/${editingId}`, formData)
      : axiosInstance.post(catalogCreate.CATALOGPAGECREATE_API, formData);

    try {
      const { data } = await api;
      if (data.success) {
        toast.success(editingId ? "Category updated" : "Category added");
        setFormData({ name: "", description: "" });
        setEditingId(null);
        fetchCategories();
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      setIsLoading(true);
      const { data } = await axiosInstance.delete(`${catalogCreate.CATALOGPAGECREATE_API}/${id}`);
      if (data.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (category) => {
    setFormData({ name: category.name, description: category.description });
    setEditingId(category._id);
  };

  const cancelEditing = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
  };

  return (
    <div className="bg-richblack-800 min-h-screen text-richblack-5">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-electricblue">Category Management</h1>

        {/* Add/Edit Form */}
        <div className="bg-richblack-700 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-softteal">
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-richblack-300 mb-1">
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-richblack-600 bg-richblack-800 text-richblack-5 rounded-md focus:outline-none focus:ring-2 focus:ring-electricblue"
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-richblack-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-richblack-600 bg-richblack-800 text-richblack-5 rounded-md focus:outline-none focus:ring-2 focus:ring-electricblue"
                placeholder="Enter category description"
                rows="3"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-4 py-2 bg-richblack-600 text-richblack-5 rounded-md hover:bg-richblack-400 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-electricblue text-richblack-800 font-semibold rounded-md hover:bg-softteal transition-colors disabled:bg-richblack-400"
              >
                {isLoading ? "Processing..." : editingId ? "Update" : "Add"} Category
              </button>
            </div>
          </form>
        </div>

        {/* Category Table */}
        <div className="bg-richblack-700 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-softteal">Existing Categories</h2>
          {isLoading && !categoriesList.length ? (
            <div className="text-center py-8 text-richblack-300">Loading categories...</div>
          ) : categoriesList.length === 0 ? (
            <div className="text-center py-8 text-richblack-300">No categories found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-richblack-600">
                <thead className="bg-richblack-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-richblack-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-richblack-800 divide-y divide-richblack-700">
                  {categoriesList.map(({ _id, name, description }) => (
                    <tr key={_id}>
                      <td className="px-6 py-4 text-sm font-medium text-richblack-5">{name}</td>
                      <td className="px-6 py-4 text-sm text-richblack-300">{description}</td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <button
                          onClick={() => startEditing({ _id, name, description })}
                          className="text-electricblue hover:text-softteal mr-4"
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(_id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCatalog;
