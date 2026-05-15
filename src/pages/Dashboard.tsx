import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Shield, Plus, List, LayoutDashboard, FileSearch, AlertCircle, Edit3 } from 'lucide-react';
import AdminClaims from '../components/AdminClaims';
import { Toaster, toast } from 'react-hot-toast';

// --- HELPER COMPONENTS ---
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [productToDelete, setProductToDelete] = useState<any>(null);

const ProductsTable = ({ products, onEdit, onDelete }: {
  products: any[],
  onEdit: (p: any) => void,
  onDelete: (product: any) => void
}) => (
  <table className="w-full text-left">
    <thead>
      <tr className="border-b text-gray-400 text-sm">
        <th className="pb-3">Product Name</th>
        <th className="pb-3">Category</th>
        <th className="pb-3">Price</th>
        <th className="pb-3 text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.length > 0 ? products.map((item) => (
        <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
          <td className="py-4 font-medium">{item.nombre}</td>
          <td className="py-4">
            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-semibold">
              {item.category || 'General'}
            </span>
          </td>
          <td className="py-4">${item.price}</td>
          <td className="py-4 text-right">
            <div className="flex justify-end gap-4">
              <button onClick={() => onEdit(item)} className="text-praxent-blue hover:underline font-semibold flex items-center gap-1">
                <Edit3 size={14} /> Edit
              </button>
              <button
                onClick={() => onDelete(item)} // This now calls handleDeleteClick
                className="text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
              >
                <AlertCircle size={14} /> Delete
              </button>
            </div>
          </td>
        </tr>
      )) : (
        <tr><td colSpan={4} className="py-4 text-center text-gray-400">No products found.</td></tr>
      )}
    </tbody>
  </table>
);

const PoliciesTable = ({ insurances }: { insurances: any[] }) => (
  <table className="w-full text-left">
    <thead>
      <tr className="border-b text-gray-400 text-sm">
        <th className="pb-3">Policy Name</th>
        <th className="pb-3">Coverage</th>
        <th className="pb-3">Type</th>
        <th className="pb-3 text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {insurances.length > 0 ? insurances.map((item) => (
        <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
          <td className="py-4 font-medium">{item.policyName}</td>
          <td className="py-4">${item.coverageAmount}</td>
          <td className="py-4">{item.insuranceType}</td>
          <td className="py-4 text-right text-praxent-blue font-semibold cursor-pointer">Edit</td>
        </tr>
      )) : (
        <tr><td colSpan={4} className="py-4 text-center text-gray-400">No policies found.</td></tr>
      )}
    </tbody>
  </table>
);

const InsuranceReportView = ({ data }: { data: any }) => (
  <div id="insurance-report" className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-600 font-semibold uppercase">Total Policies</p>
        <h3 id="total-policies" className="text-2xl font-bold">{data?.totalPolicies || 0}</h3>
      </div>
      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <p className="text-sm text-green-600 font-semibold uppercase">Total Revenue</p>
        <h3 id="total-revenue" className="text-2xl font-bold">${data?.totalPremiumRevenue?.toFixed(2) || '0.00'}</h3>
      </div>
    </div>
    <div className="mt-4">
      <h4 className="font-bold mb-2">Policy Breakdown</h4>
      <ul className="text-sm space-y-2">
        {data?.topInsurances?.map((ins: any, index: number) => (
          <li key={index} className="flex justify-between border-b pb-1">
            <span>{ins.productName} ({ins.policyName})</span>
            <span className="font-mono">${ins.premium}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// --- MAIN DASHBOARD ---

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'policies' | 'claims' | 'report'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [newProduct, setNewProduct] = useState({ nombre: '', description: '', price: 0, category: 'General' });
  const [newPolicy, setNewPolicy] = useState({ policyName: '', insuranceType: 'Standard', coverageAmount: 0, premiumPrice: 0, productId: 0 });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError(null);
    try {
      const pRes = await axios.get(`${API_BASE}/Products`, { headers });
      const iRes = await axios.get(`${API_BASE}/Insurances`, { headers });
      const rRes = await axios.get(`${API_BASE}/Insurances/report`, { headers });

      setProducts(pRes.data);
      setInsurances(iRes.data);
      setReportData(rRes.data);
    } catch (err: any) {
      toast.error("Could not sync with the server.");
    }
  };

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    const productId = productToDelete.id || productToDelete.Id;
    const loadingToast = toast.loading("Deleting product and related policies...");

    try {
      await axios.delete(`${API_BASE}/Products/${productId}`, { headers });
      toast.success("Product and policies deleted.", { id: loadingToast });
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      toast.error("Delete failed.", { id: loadingToast });
    }
  };

  const handleEditClick = (product: any) => {
    setEditingProductId(product.id);
    setNewProduct({ nombre: product.nombre, description: product.description || '', price: product.price, category: product.category || 'General' });
    setActiveTab('products');
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setNewProduct({ nombre: '', description: '', price: 0, category: 'General' });
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingProductId ? "Updating..." : "Saving...");

    try {
      if (editingProductId) {
        await axios.put(`${API_BASE}/Products/${editingProductId}`, newProduct, { headers });
        toast.success("Product updated!", { id: loadingToast });
      } else {
        await axios.post(`${API_BASE}/Products`, newProduct, { headers });
        toast.success("Product created!", { id: loadingToast });
      }
      fetchData();
      cancelEdit();
    } catch (err) {
      toast.error("Error saving product.", { id: loadingToast });
    }
  };

  const addPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPolicy.productId === 0) { setError("Select a product."); return; }
    try {
      await axios.post(`${API_BASE}/Insurances`, newPolicy, { headers });
      fetchData();
      setNewPolicy({ policyName: '', insuranceType: 'Standard', coverageAmount: 0, premiumPrice: 0, productId: 0 });
    } catch (err) { setError("Failed to save policy."); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-praxent-blue" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Insurance Management</h1>
          </div>
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 border border-red-100">
              <AlertCircle size={18} /> {error}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('products')} className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${activeTab === 'products' ? 'bg-praxent-blue text-white' : 'bg-white shadow-sm'}`}>
            <Package size={18} /> Products
          </button>
          <button onClick={() => setActiveTab('policies')} className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${activeTab === 'policies' ? 'bg-praxent-blue text-white' : 'bg-white shadow-sm'}`}>
            <Shield size={18} /> Policies
          </button>
          <button onClick={() => setActiveTab('claims')} className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${activeTab === 'claims' ? 'bg-praxent-blue text-white' : 'bg-white shadow-sm'}`}>
            <FileSearch size={18} /> Claims
          </button>
          <button onClick={() => setActiveTab('report')} className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${activeTab === 'report' ? 'bg-praxent-blue text-white' : 'bg-white shadow-sm'}`}>
            <List size={18} /> Report
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${activeTab === 'claims' || activeTab === 'report' ? 'hidden' : 'block'}`}>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              {editingProductId ? <Edit3 size={20} className="text-orange-500" /> : <Plus size={20} />}
              {editingProductId ? 'Edit Product' : `Add ${activeTab === 'products' ? 'Product' : 'Policy'}`}
            </h2>
            {activeTab === 'products' ? (
              <form onSubmit={submitProduct} className="space-y-4">
                <input required placeholder="Name" className="w-full p-2 border rounded" value={newProduct.nombre} onChange={e => setNewProduct({ ...newProduct, nombre: e.target.value })} />
                <input required placeholder="Description" className="w-full p-2 border rounded" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                <input required type="number" placeholder="Price" className="w-full p-2 border rounded" value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
                <select className="w-full p-2 border rounded" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                  <option value="General">General</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Property">Property</option>
                </select>
                <button className={`w-full py-2 rounded font-bold text-white ${editingProductId ? 'bg-orange-500' : 'bg-gray-900'}`}>
                  {editingProductId ? 'Update Product' : 'Save Product'}
                </button>
              </form>
            ) : (
              <form onSubmit={addPolicy} className="space-y-4">
                <select required className="w-full p-2 border rounded" value={newPolicy.productId} onChange={e => setNewPolicy({ ...newPolicy, productId: parseInt(e.target.value) })}>
                  <option value="0">Select Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
                <input required type="number" placeholder="Coverage Amount" className="w-full p-2 border rounded" value={newPolicy.coverageAmount || ''} onChange={e => setNewPolicy({ ...newPolicy, coverageAmount: parseFloat(e.target.value) || 0 })} />
                <button className="w-full bg-gray-900 text-white py-2 rounded font-bold">Save Policy</button>
              </form>
            )}
          </div>

          {/* Table / Content Section */}
          <div className={`${activeTab === 'claims' || activeTab === 'report' ? 'md:col-span-3' : 'md:col-span-2'} bg-white p-6 rounded-xl shadow-sm border border-gray-100`}>
            <h2 className="text-xl font-bold mb-6">
              {activeTab === 'report' ? 'Insurance Analytics' : `Existing ${activeTab}`}
            </h2>
            {activeTab === 'products' && <ProductsTable products={products} onEdit={handleEditClick} onDelete={handleDeleteClick} />}
            {activeTab === 'policies' && <PoliciesTable insurances={insurances} />}
            {activeTab === 'claims' && <AdminClaims />}
            {activeTab === 'report' && <InsuranceReportView data={reportData} />}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={28} />
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
            </div>

            <p className="text-gray-600 mb-6">
              The product <span className="font-bold text-gray-900">"{productToDelete?.nombre}"</span> has active policies.
              Deleting it will remove all associated data. This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;