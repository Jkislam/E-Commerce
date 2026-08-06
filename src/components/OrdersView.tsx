import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { 
  Search, 
  ShoppingBag, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  User, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Trash2, 
  ChevronLeft, 
  Printer, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Phone, 
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  Loader2
} from 'lucide-react';
import { Order, AppSettings } from '../types';

interface OrdersViewProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  settings: AppSettings;
  setSuccessMessage: (msg: string) => void;
}

export default function OrdersView({
  orders,
  updateOrderStatus,
  onDeleteOrder,
  settings,
  setSuccessMessage
}: OrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 20;
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [printInvoiceOrder, setPrintInvoiceOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current || !printInvoiceOrder) return;
    try {
      setIsDownloading(true);
      const element = invoiceRef.current;
      const dataUrl = await toPng(element, {
        quality: 0.98,
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: '',
      });
      const link = document.createElement('a');
      link.download = `Invoice-${printInvoiceOrder.id.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();
      setSuccessMessage('Invoice downloaded successfully as image!');
    } catch (err) {
      console.error('Failed to download invoice image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Status counts for order tabs
  const counts = {
    All: orders.length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Processing: orders.filter(o => o.status === 'Processing').length,
    Shipped: orders.filter(o => o.status === 'Shipped').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  // Helper to extract timestamp from order createdat safely
  const getOrderTimestamp = (order: Order): number => {
    const rawDate = order.createdat || (order as any).created_at || (order as any).createdAt;
    if (!rawDate) return 0;
    const time = new Date(rawDate).getTime();
    return isNaN(time) ? 0 : time;
  };

  // Filter and Sort logic
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (activeTab !== 'All' && order.status !== activeTab) return false;

    // Payment method filter
    if (paymentFilter !== 'All' && order.paymentmethod !== paymentFilter) return false;

    // Search query (Order ID, Customer Name, Phone, Address, Transaction ID)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customername.toLowerCase().includes(q);
      const matchPhone = order.customerphone.toLowerCase().includes(q);
      const matchAddr = order.customeraddress.toLowerCase().includes(q);
      const matchTx = order.transactionid ? order.transactionid.toLowerCase().includes(q) : false;
      const matchItems = order.items.some(i => i.name.toLowerCase().includes(q));

      if (!matchId && !matchName && !matchPhone && !matchAddr && !matchTx && !matchItems) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      const timeA = getOrderTimestamp(a);
      const timeB = getOrderTimestamp(b);
      if (timeA !== timeB) {
        return timeB - timeA;
      }
      return String(b.id).localeCompare(String(a.id), undefined, { numeric: true, sensitivity: 'base' });
    }
    if (sortBy === 'oldest') {
      const timeA = getOrderTimestamp(a);
      const timeB = getOrderTimestamp(b);
      if (timeA !== timeB) {
        return timeA - timeB;
      }
      return String(a.id).localeCompare(String(b.id), undefined, { numeric: true, sensitivity: 'base' });
    }
    if (sortBy === 'amount-high') {
      return b.total - a.total;
    }
    if (sortBy === 'amount-low') {
      return a.total - b.total;
    }
    return 0;
  });

  // Pagination Calculations
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (safeCurrentPage > 4) {
        pages.push('...');
      }

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (safeCurrentPage < totalPages - 3) {
        pages.push('...');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Export CSV function
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'Payment Method', 'Transaction ID', 'Items Count', 'Total Amount (BDT)', 'Status'];
    const rows = filteredOrders.map(o => [
      `"${o.id}"`,
      `"${new Date(o.createdat).toLocaleString()}"`,
      `"${o.customername.replace(/"/g, '""')}"`,
      `"${o.customerphone}"`,
      `"${o.customeraddress.replace(/"/g, '""')}"`,
      `"${o.paymentmethod}"`,
      `"${o.transactionid || 'N/A'}"`,
      o.items.length,
      o.total,
      `"${o.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Orders_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccessMessage('CSV Order Report downloaded successfully!');
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> Pending
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-300">
            <Package className="w-3.5 h-3.5 text-sky-600" /> Processing
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-300">
            <Truck className="w-3.5 h-3.5 text-indigo-600" /> Shipped
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Cancelled
          </span>
        );
    }
  };

  const getPaymentBadge = (method: string) => {
    if (method.includes('bKash')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-pink-100 text-pink-700 border border-pink-200">
          bKash
        </span>
      );
    }
    if (method.includes('Nagad')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
          Nagad
        </span>
      );
    }
    if (method.includes('Rocket')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200">
          Rocket
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
        COD (Cash on Delivery)
      </span>
    );
  };

  // Render Full Order Details Page / View
  if (selectedOrder) {
    const steps = [
      { key: 'Pending', label: 'Order Placed', desc: 'Customer placed order' },
      { key: 'Processing', label: 'Ready to Ship', desc: 'Packed in warehouse' },
      { key: 'Shipped', label: 'In Transit', desc: 'Handed over to courier' },
      { key: 'Delivered', label: 'Delivered', desc: 'Received by customer' },
    ];

    const currentStepIdx = selectedOrder.status === 'Cancelled' ? -1 : steps.findIndex(s => s.key === selectedOrder.status);

    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-6xl mx-auto"
      >
        {/* Navigation Bar */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest">
                  Merchant Portal
                </span>
                <span className="text-xs text-white/60">• Order Management</span>
              </div>
              <h2 className="text-xl font-bold mt-0.5 flex items-center gap-2">
                Order #{selectedOrder.id}
                <button 
                  onClick={() => handleCopy(selectedOrder.id, 'id-detail')}
                  className="p-1 hover:bg-white/10 rounded transition-all text-white/70"
                  title="Copy Order ID"
                >
                  {copiedId === 'id-detail' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setPrintInvoiceOrder(selectedOrder)}
              className="px-4 py-2.5 bg-white text-slate-900 rounded-xl font-black text-xs hover:bg-amber-500 hover:text-black transition-all flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print Shipping Label
            </button>
            <button 
              onClick={() => {
                if (window.confirm(`আপনি কি নিশ্চিত যে আপনি অর্ডার #${selectedOrder.id} ডিলিট করতে চান?`)) {
                  onDeleteOrder(selectedOrder.id);
                  setSelectedOrder(null);
                  setSuccessMessage('অর্ডার সফলভাবে ডিলিট করা হয়েছে।');
                }
              }}
              className="p-2.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Delete Order"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Stepper Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-500" /> Fulfillment Progress
            </h3>
            {getStatusBadge(selectedOrder.status)}
          </div>

          {selectedOrder.status === 'Cancelled' ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>This order was cancelled. No further shipping updates are required.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div 
                    key={step.key} 
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent 
                        ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-200' 
                        : isCompleted 
                          ? 'bg-emerald-50/50 border-emerald-200' 
                          : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'
                      }`}>
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[8px] font-black uppercase">
                          Active State
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-black text-slate-900">{step.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Grid Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-black/5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-slate-600" />
                  Order Package Items ({selectedOrder.items.length})
                </h3>
                <span className="text-xs font-bold text-slate-400">Merchant Store Fulfiller</span>
              </div>

              <div className="space-y-4">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl hover:border-slate-300 transition-all">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                          {item.category || 'Product'}
                        </span>
                        {item.selectedAttr && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Variant: {item.selectedAttr}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-slate-500 font-medium">৳{item.price.toLocaleString()} × {item.quantity}</span>
                        <span className="text-sm font-black text-slate-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Subtotal Amount:</span>
                  <span className="font-bold text-white">৳{selectedOrder.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-white/70">
                  <span>Standard Delivery Fee:</span>
                  <span className="font-bold text-emerald-400">INCLUDED</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-black">
                  <span>Total Payable Amount:</span>
                  <span className="text-xl font-black text-amber-400">৳{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Payment Details */}
          <div className="space-y-6">
            {/* Customer Shipping Address Card */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2 pb-3 border-b border-black/5">
                <User className="w-4 h-4 text-slate-600" /> Customer & Shipping Info
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Customer Name</p>
                    <p className="text-xs font-bold text-slate-900">{selectedOrder.customername}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">Contact Number</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a href={`tel:${selectedOrder.customerphone}`} className="text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors">
                        {selectedOrder.customerphone}
                      </a>
                      <button 
                        onClick={() => handleCopy(selectedOrder.customerphone, 'phone-detail')}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-all"
                        title="Copy Phone Number"
                      >
                        {copiedId === 'phone-detail' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Shipping Address</p>
                    <p className="text-xs font-medium leading-relaxed text-slate-800 mt-0.5">{selectedOrder.customeraddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2 pb-3 border-b border-black/5">
                <CreditCard className="w-4 h-4 text-slate-600" /> Payment Logistics
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-bold">Payment Method:</span>
                  {getPaymentBadge(selectedOrder.paymentmethod)}
                </div>

                {selectedOrder.transactionid && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Transaction ID (TrxID)</span>
                    <div className="flex justify-between items-center">
                      <code className="text-xs font-mono font-bold text-slate-900">{selectedOrder.transactionid}</code>
                      <button 
                        onClick={() => handleCopy(selectedOrder.transactionid!, 'trx-detail')}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600"
                      >
                        {copiedId === 'trx-detail' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Order Time:</span>
                  <span className="font-bold text-slate-800">{new Date(selectedOrder.createdat).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Status Control */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Change Order Status
              </h3>
              <p className="text-[10px] text-slate-400">Select new status to immediately update order status.</p>
              
              <div className="grid grid-cols-1 gap-2 pt-1">
                {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as Order['status'][]).map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, st);
                      setSelectedOrder({ ...selectedOrder, status: st });
                      setSuccessMessage(`Order status changed to ${st}`);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between ${
                      selectedOrder.status === st 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{st}</span>
                    {selectedOrder.status === st && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* 1. Header & Summary Metric Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="bg-slate-900 text-white p-4 sm:p-6 rounded-3xl shadow-xl space-y-5 sm:space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest">
                  Merchant Portal
                </span>
                <span className="text-xs text-white/50 font-bold">• Orders Portal</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                Order Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border border-white/10"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.05 }} className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Total Orders</p>
            <p className="text-2xl font-black mt-1 text-white">{counts.All}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.1 }} className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">Pending</p>
            <p className="text-2xl font-black mt-1 text-amber-400">{counts.Pending}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.15 }} className="p-3.5 bg-sky-500/10 border border-sky-500/20 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-sky-300">Processing</p>
            <p className="text-2xl font-black mt-1 text-sky-400">{counts.Processing}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.2 }} className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">In Transit</p>
            <p className="text-2xl font-black mt-1 text-indigo-400">{counts.Shipped}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.25 }} className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Delivered</p>
            <p className="text-2xl font-black mt-1 text-emerald-400">{counts.Delivered}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.3 }} className="p-3.5 bg-white/10 border border-white/15 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Total Revenue</p>
            <p className="text-2xl font-black mt-1 text-amber-300">৳{totalRevenue.toLocaleString()}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* 2. Status Navigation Tabs (Desktop) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="hidden md:block bg-white p-2 rounded-2xl border border-black/5 shadow-sm overflow-x-auto custom-scrollbar"
      >
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'All', label: 'All Orders', count: counts.All },
            { id: 'Pending', label: 'Pending', count: counts.Pending },
            { id: 'Processing', label: 'Processing', count: counts.Processing },
            { id: 'Shipped', label: 'In Transit', count: counts.Shipped },
            { id: 'Delivered', label: 'Delivered', count: counts.Delivered },
            { id: 'Cancelled', label: 'Cancelled', count: counts.Cancelled },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md font-black'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-amber-500 text-black' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 3. Search and Filters Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
      >
        {/* Search Input */}
        <div className="md:col-span-7 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search Order ID, Customer Name, Phone, TrxID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Payment Method Filter */}
        <div className="md:col-span-5 relative">
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none cursor-pointer"
          >
            <option value="All">All Payment Methods</option>
            <option value="Cash on Delivery">Cash on Delivery (COD)</option>
            <option value="bKash">bKash Personal / Merchant</option>
            <option value="Nagad">Nagad Wallet</option>
            <option value="Rocket">Rocket Mobile Banking</option>
          </select>
          <SlidersHorizontal className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* Mobile Status Filter (Shown only on Mobile) */}
        <div className="block md:hidden relative">
          <select
            value={activeTab}
            onChange={(e) => {
              setActiveTab(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none cursor-pointer"
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <SlidersHorizontal className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </motion.div>

      {/* 4. Order List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-12 text-center border border-black/5 shadow-sm space-y-3"
          >
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Orders Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              There are no orders matching your selected status filter or search parameters.
            </p>
          </motion.div>
        ) : (
          paginatedOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3), ease: "easeOut" }}
              className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Card Header Strip */}
              <div className="bg-slate-900 text-white px-3.5 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-white/10 max-w-full overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0 max-w-full">
                    <span className="text-xs font-mono font-bold text-amber-400 truncate max-w-[150px] sm:max-w-xs" title={`#${order.id}`}>#{order.id}</span>
                    <button
                      onClick={() => handleCopy(order.id, `id-${order.id}`)}
                      className="p-1 hover:bg-white/10 rounded transition-all text-white/60 hover:text-white shrink-0"
                      title="Copy Order ID"
                    >
                      {copiedId === `id-${order.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <span className="text-white/30 hidden sm:inline">•</span>
                  <div className="flex items-center gap-1 text-[11px] text-white/70 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-white/40 shrink-0" />
                    <span>{new Date(order.createdat).toLocaleString()}</span>
                  </div>

                  <span className="text-white/30 hidden sm:inline">•</span>
                  <div className="shrink-0">{getPaymentBadge(order.paymentmethod)}</div>

                  {order.transactionid && (
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-amber-300 font-bold border border-white/10 shrink-0 truncate max-w-[140px]">
                      TrxID: {order.transactionid}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Card Body */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-start md:items-center">
                {/* Customer Info (Left) */}
                <div className="md:col-span-4 space-y-2 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-xs font-black text-slate-900 truncate">{order.customername}</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${order.customerphone}`} className="text-xs font-bold text-slate-700 hover:text-amber-600 transition-colors truncate">
                      {order.customerphone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-600 font-medium leading-tight line-clamp-2 break-words">
                      {order.customeraddress}
                    </p>
                  </div>
                </div>

                {/* Purchased Items List (Middle) */}
                <div className="md:col-span-5 space-y-2.5 min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Items ({order.items.length})
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            Qty: <strong className="text-slate-900">{item.quantity}</strong>
                            {item.selectedAttr ? ` | ${item.selectedAttr}` : ''}
                          </p>
                        </div>
                        <span className="text-xs font-black text-slate-900 shrink-0">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Price & Quick Action (Right) */}
                <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between space-y-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 min-w-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Payable</span>
                    <p className="text-xl font-black text-slate-900 mt-0.5">৳{order.total.toLocaleString()}</p>
                  </div>

                  {/* Quick Actions Bar */}
                  <div className="flex flex-wrap items-center justify-end gap-2 w-full">
                    {/* Quick Status Select */}
                    <select
                      value={order.status}
                      onChange={(e) => {
                        updateOrderStatus(order.id, e.target.value as Order['status']);
                        setSuccessMessage(`Order #${order.id} status updated to ${e.target.value}`);
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-800 border border-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => setPrintInvoiceOrder(order)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                      title="Print Shipping Label / Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 bg-slate-900 text-white hover:bg-amber-500 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`আপনি কি নিশ্চিত যে আপনি অর্ডার #${order.id} ডিলিট করতে চান?`)) {
                          onDeleteOrder(order.id);
                          setSuccessMessage(`অর্ডার #${order.id} সফলভাবে ডিলিট করা হয়েছে।`);
                        }
                      }}
                      className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all cursor-pointer border border-rose-200/60"
                      title="Delete Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 5. Pagination Bar (Styled to match website's dark slate & amber theme) */}
      {filteredOrders.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden"
        >
          <div className="text-xs font-medium text-slate-300">
            মোট <span className="font-bold text-white">{filteredOrders.length}</span> টি অর্ডারের মধ্যে{' '}
            <span className="font-bold text-amber-400">
              {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)}
            </span>{' '}
            দেখানো হচ্ছে (পৃষ্ঠা <span className="font-bold text-white">{safeCurrentPage}</span> / {totalPages})
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full custom-scrollbar py-1">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage <= 1}
              className="px-3 py-1.5 border border-slate-700 rounded-lg text-xs font-bold bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
              title="Previous Page"
            >
              Prev
            </button>

            {/* Page Number Boxes */}
            {getPageNumbers().map((p, i) => {
              if (p === '...') {
                return (
                  <span key={`ellipsis-${i}`} className="px-2 py-1 text-xs font-bold text-slate-500 shrink-0 select-none">
                    ...
                  </span>
                );
              }
              const pageNum = p as number;
              const isActive = pageNum === safeCurrentPage;
              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => handlePageChange(pageNum)}
                  className={`min-w-[34px] h-8 px-2 border text-xs font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-400/30'
                      : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage >= totalPages}
              className="px-3.5 py-1.5 border border-amber-500/80 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shrink-0 shadow-sm"
              title="Next Page"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}

      {/* 6. Shipping Label / Invoice Printable Modal */}
      <AnimatePresence>
        {printInvoiceOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPrintInvoiceOrder(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] border border-black/10"
            >
              {/* Modal Control Header */}
              <div className="p-3 sm:p-4 bg-slate-900 text-white flex justify-between items-center shrink-0 gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider truncate">Shipping & Fulfillment Label</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={handleDownloadInvoice}
                    disabled={isDownloading}
                    className="px-2.5 sm:px-3 py-1.5 bg-amber-500 text-black font-bold rounded-lg text-[11px] sm:text-xs hover:bg-amber-400 transition-colors flex items-center gap-1 sm:gap-1.5 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="hidden sm:inline">Downloading...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" /> Print Invoice
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setPrintInvoiceOrder(null)}
                    className="p-1 sm:p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close modal"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Content Scrollable Wrapper */}
              <div className="flex-1 overflow-auto custom-scrollbar p-3 sm:p-6 bg-slate-100/60 flex justify-start sm:justify-center items-start">
                {/* The actual full-height printable card (fixed desktop width for crisp rendering across all devices) */}
                <div ref={invoiceRef} className="w-[640px] shrink-0 mx-auto p-8 space-y-6 font-sans text-slate-900 bg-white rounded-2xl border border-slate-200/80 shadow-sm print:p-0 print:border-0 print:shadow-none">
                  {/* Store Slip Header */}
                  <div className="flex justify-between items-center gap-4 border-b-2 border-slate-900 pb-5">
                    <div className="space-y-1 min-w-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-900 text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-md shadow-sm">
                        <Sparkles className="w-3 h-3" /> SELLER FULFILLMENT SLIP
                      </span>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight break-words">
                        {settings.brandName || 'SABBIR'}
                      </h2>
                      <p className="text-xs text-slate-500 font-semibold">Official Verified E-Commerce Merchant</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Order Reference</p>
                      <p className="text-lg font-black font-mono text-amber-600">#{printInvoiceOrder.id}</p>
                      <p className="text-[11px] font-bold text-slate-500 mt-0.5">{new Date(printInvoiceOrder.createdat).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Simulated Realistic Barcode */}
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 text-center space-y-1.5">
                    <div className="flex items-center justify-center gap-[3px] h-11 bg-white px-6 py-2 rounded-xl border border-slate-200 shadow-inner max-w-md mx-auto overflow-hidden">
                      {[3,1,2,1,4,1,2,3,1,2,1,3,2,1,4,1,2,1,3,1,2,3,1,2,1,4,1,2,1,3,2,1,2,3,1,2,4,1,2].map((w, i) => (
                        <div 
                          key={i} 
                          className={`h-full ${i % 2 === 1 ? 'bg-transparent' : 'bg-slate-900'}`} 
                          style={{ width: `${w * 2}px` }} 
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-mono font-bold tracking-widest text-slate-500">
                      PACKAGE TRACKING BARCODE: #{printInvoiceOrder.id}
                    </p>
                  </div>

                  {/* Address Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Recipient Card */}
                    <div className="p-4 bg-slate-50/90 border border-slate-200 rounded-2xl space-y-2 min-w-0">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <User className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span>Recipient</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 break-words">{printInvoiceOrder.customername}</p>
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" /> {printInvoiceOrder.customerphone}
                        </p>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium bg-white p-2.5 rounded-xl border border-slate-200/60 break-words">
                          {printInvoiceOrder.customeraddress}
                        </p>
                      </div>
                    </div>

                    {/* Sender Card (Company Name Only) */}
                    <div className="p-4 bg-slate-50/90 border border-slate-200 rounded-2xl space-y-2 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Sender</span>
                        </div>
                        <div className="mt-2 min-w-0">
                          <p className="text-lg font-black text-slate-900 break-words">{settings.brandName || 'SABBIR'}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Store Merchant</span>
                      </div>
                    </div>
                  </div>

                  {/* Package Items Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-black uppercase text-[10px] tracking-wider">
                          <th className="p-3.5">Product Item</th>
                          <th className="p-3.5 text-center">Qty</th>
                          <th className="p-3.5 text-right">Unit Price</th>
                          <th className="p-3.5 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/80 font-medium bg-white">
                        {printInvoiceOrder.items.map((item, idx) => (
                          <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/50' : ''}>
                            <td className="p-3.5">
                              <span className="font-black text-slate-900 block text-xs break-words">{item.name}</span>
                              {item.selectedAttr && (
                                <span className="inline-block mt-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                  {item.selectedAttr}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-center font-bold text-slate-900">{item.quantity}</td>
                            <td className="p-3.5 text-right text-slate-600 font-semibold">৳{item.price.toLocaleString()}</td>
                            <td className="p-3.5 text-right font-black text-slate-900">৳{(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Amount to collect banner */}
                  <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl flex items-center justify-between gap-3 shadow-lg">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-amber-500 text-black text-[10px] font-black uppercase rounded-md">
                          {printInvoiceOrder.paymentmethod}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        {printInvoiceOrder.paymentmethod === 'Cash on Delivery' 
                          ? 'Collect cash payment from recipient upon delivery.' 
                          : `Prepaid Order via ${printInvoiceOrder.paymentmethod} (${printInvoiceOrder.transactionid || 'Verified'})`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">Total Payable</span>
                      <p className="text-2xl font-black text-amber-400">৳{printInvoiceOrder.total.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Footer message */}
                  <div className="pt-4 border-t border-dashed border-slate-300 flex justify-center items-center text-[10px] text-slate-400 font-semibold text-center">
                    <span>Thank you for shopping with {settings.brandName || 'SABBIR'}!</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
