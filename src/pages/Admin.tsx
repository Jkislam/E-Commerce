import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  LayoutDashboard, 
  Package, 
  LogOut, 
  Search,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Star,
  Upload,
  Layers,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  XCircle
} from 'lucide-react';
import { Product, Order } from '../types';

interface AdminProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => void;
  onReset: () => void;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export default function Admin({ 
  products, 
  setProducts, 
  onDelete, 
  onBulkDelete, 
  onReset,
  orders,
  updateOrderStatus
}: AdminProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');

  // Initial state for a new product
  const initialProductState: Omit<Product, 'id'> = {
    name: '',
    price: 0,
    category: 'Panjabi',
    image: '',
    rating: 4.5,
    description: '',
    stock: 0,
    sizes: [],
    volumes: []
  };

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(initialProductState);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple secure check (In real app, use backend auth)
    if (email === 'admin@alhurumah.com' && password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(id);
      setSelectedIds(prev => prev.filter(selectedId => Number(selectedId) !== Number(id)));
      setSuccessMessage('Product deleted successfully');
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
      setSuccessMessage(`${selectedIds.length} products deleted successfully`);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
    setSuccessMessage('Product updated successfully');
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts(prev => [...prev, { ...newProduct, id }]);
    setIsAddingNew(false);
    setNewProduct(initialProductState);
    setSuccessMessage('Product added successfully');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEdit && editingProduct) {
          setEditingProduct({ ...editingProduct, image: base64String });
        } else {
          setNewProduct({ ...newProduct, image: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAttribute = (attr: string, type: 'sizes' | 'volumes', isEdit: boolean) => {
    if (isEdit && editingProduct) {
      const current = editingProduct[type] || [];
      const updated = current.includes(attr) 
        ? current.filter(a => a !== attr)
        : [...current, attr];
      setEditingProduct({ ...editingProduct, [type]: updated });
    } else {
      const current = newProduct[type] || [];
      const updated = current.includes(attr) 
        ? current.filter(a => a !== attr)
        : [...current, attr];
      setNewProduct({ ...newProduct, [type]: updated });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return <Clock className="w-3 h-3 text-amber-500" />;
      case 'Processing': return <Package className="w-3 h-3 text-blue-500" />;
      case 'Shipped': return <Truck className="w-3 h-3 text-indigo-500" />;
      case 'Delivered': return <CheckCircle2 className="w-3 h-3 text-green-500" />;
      case 'Cancelled': return <XCircle className="w-3 h-3 text-red-500" />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-black/5"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="text-black/40 mt-2">Secure access to AL-Hurumah Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Email Address</label>
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alhurumah.com"
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/40 ml-1">Password</label>
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-sm font-medium text-center">{loginError}</p>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-black/90 transition-all shadow-xl"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-black/30">
              Demo Access: admin@alhurumah.com / admin123
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Admin Header */}
      <div className="bg-white border-b border-black/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-md">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none">Admin Panel</h2>
              <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold mt-1">Management System</p>
            </div>
          </div>

          <div className="flex items-center bg-black/5 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'inventory' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black/60'}`}
            >
              Inventory
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black/60'}`}
            >
              Orders
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onReset}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-black/60 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
              title="Reset to default"
            >
              Reset
            </button>
            {selectedIds.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all shadow-lg animate-in fade-in zoom-in duration-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedIds.length})
              </button>
            )}
            <button 
              onClick={() => setIsAddingNew(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-black/90 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 text-green-700 rounded-2xl font-bold text-center border border-green-200"
          >
            {successMessage}
          </motion.div>
        )}
        {/* Stats & Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">
              {activeTab === 'inventory' ? 'Total Products' : 'Total Orders'}
            </p>
            <p className="text-3xl font-black">
              {activeTab === 'inventory' ? products.length : orders.length}
            </p>
          </div>
          <div className="md:col-span-2 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
            <input 
              type="text"
              placeholder={activeTab === 'inventory' ? "Search by name or category..." : "Search by Order ID or Customer..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full min-h-[70px] pl-14 pr-6 bg-white border border-black/5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
            />
          </div>
        </div>

        {activeTab === 'inventory' ? (
          /* Product Table */
          <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5">
                    <th className="px-6 py-4 w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-black/10 text-black focus:ring-black cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Product</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Price</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Stock</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className={`hover:bg-black/[0.02] transition-colors ${selectedIds.includes(product.id) ? 'bg-black/[0.03]' : ''}`}>
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="w-4 h-4 rounded border-black/10 text-black focus:ring-black cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/5 flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-bold text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm">৳{product.price}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold ${product.stock < 5 ? 'text-red-500' : 'text-black/60'}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setEditingProduct(product)}
                            className="p-2 hover:bg-black/5 rounded-lg text-black/60 hover:text-black transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Orders Table */
          <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Order ID</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Total</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black/40 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {orders.filter(o => 
                    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(order => (
                    <tr key={order.id} className="hover:bg-black/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-xs">{order.id}</span>
                        <p className="text-[10px] text-black/40 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{order.customerName}</span>
                          <span className="text-[10px] text-black/40">{order.customerPhone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm">৳{order.total}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="text-xs font-bold">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="px-3 py-1.5 bg-black/5 rounded-lg text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-black/10"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {(editingProduct || isAddingNew) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-black/5 flex justify-between items-center bg-gray-50">
                <h2 className="text-2xl font-bold">
                  {isAddingNew ? 'Add New Product' : 'Edit Product'}
                </h2>
                <button 
                  onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form 
                onSubmit={isAddingNew ? handleAddNew : handleSaveEdit}
                className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Product Name</label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        required
                        type="text"
                        value={isAddingNew ? newProduct.name : editingProduct?.name}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, name: e.target.value})
                          : setEditingProduct({...editingProduct!, name: e.target.value})
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Category</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <select 
                        value={isAddingNew ? newProduct.category : editingProduct?.category}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, category: e.target.value})
                          : setEditingProduct({...editingProduct!, category: e.target.value})
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all appearance-none"
                      >
                        <option value="Panjabi">Panjabi</option>
                        <option value="Attar">Attar</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Price (৳)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        required
                        type="number"
                        value={isAddingNew ? newProduct.price : editingProduct?.price}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, price: Number(e.target.value)})
                          : setEditingProduct({...editingProduct!, price: Number(e.target.value)})
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Stock Units</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        required
                        type="number"
                        min="0"
                        value={isAddingNew ? newProduct.stock : editingProduct?.stock}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, stock: Number(e.target.value)})
                          : setEditingProduct({...editingProduct!, stock: Number(e.target.value)})
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Image Selection</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                      <input 
                        type="text"
                        value={isAddingNew ? newProduct.image : editingProduct?.image}
                        onChange={(e) => isAddingNew 
                          ? setNewProduct({...newProduct, image: e.target.value})
                          : setEditingProduct({...editingProduct!, image: e.target.value})
                        }
                        placeholder="Image URL..."
                        className="w-full pl-11 pr-4 py-3.5 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-xs"
                      />
                    </div>
                    <div className="relative">
                      <label className="flex items-center justify-center gap-2 w-full h-full min-h-[50px] bg-black/5 rounded-2xl border-2 border-dashed border-black/10 hover:border-black/20 cursor-pointer transition-all">
                        <Upload className="w-4 h-4 text-black/40" />
                        <span className="text-xs font-bold text-black/40">Upload File</span>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, !isAddingNew)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  {(isAddingNew ? newProduct.image : editingProduct?.image) && (
                    <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-black/5">
                      <img 
                        src={isAddingNew ? newProduct.image : editingProduct?.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">
                    {(isAddingNew ? newProduct.category : editingProduct?.category) === 'Panjabi' ? 'Available Sizes' : 'Available Volumes'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(isAddingNew ? newProduct.category : editingProduct?.category) === 'Panjabi' ? (
                      ['38', '40', '42', '44', '46'].map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleAttribute(size, 'sizes', !isAddingNew)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            (isAddingNew ? newProduct.sizes : editingProduct?.sizes)?.includes(size)
                              ? 'bg-black text-white'
                              : 'bg-black/5 text-black/40 hover:bg-black/10'
                          }`}
                        >
                          {size}
                        </button>
                      ))
                    ) : (
                      ['3ml', '6ml', '12ml', '25ml'].map(vol => (
                        <button
                          key={vol}
                          type="button"
                          onClick={() => toggleAttribute(vol, 'volumes', !isAddingNew)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            (isAddingNew ? newProduct.volumes : editingProduct?.volumes)?.includes(vol)
                              ? 'bg-black text-white'
                              : 'bg-black/5 text-black/40 hover:bg-black/10'
                          }`}
                        >
                          {vol}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={isAddingNew ? newProduct.description : editingProduct?.description}
                    onChange={(e) => isAddingNew 
                      ? setNewProduct({...newProduct, description: e.target.value})
                      : setEditingProduct({...editingProduct!, description: e.target.value})
                    }
                    className="w-full px-5 py-4 bg-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
                    className="flex-1 py-4 border border-black/10 rounded-2xl font-bold hover:bg-black/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-black/90 transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isAddingNew ? 'Add Product' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Add Button */}
      <button 
        onClick={() => setIsAddingNew(true)}
        className="sm:hidden fixed bottom-8 right-8 w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
