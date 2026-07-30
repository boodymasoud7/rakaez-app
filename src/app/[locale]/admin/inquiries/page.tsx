'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  HiSearch,
  HiTrash,
  HiCheckCircle,
  HiClock,
  HiArchive,
  HiPhone,
  HiChatAlt2,
  HiMail,
  HiUser,
  HiEye,
  HiX,
  HiRefresh,
} from 'react-icons/hi';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import type { Inquiry } from '@/lib/content/types';

export default function AdminInquiriesPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'archived'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'contacted' | 'archived') => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isAr ? 'هل أنت تأكد من حذف طلب التواصل هذا؟' : 'Are you sure you want to delete this inquiry?')) {
      return;
    }
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      inq.phone.includes(search) ||
      inq.message.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const countNew = inquiries.filter((i) => i.status === 'new').length;
  const countContacted = inquiries.filter((i) => i.status === 'contacted').length;
  const countArchived = inquiries.filter((i) => i.status === 'archived').length;

  const formatPhoneForWhatsapp = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('01')) clean = '2' + clean; // Convert Egyptian 01... to 201...
    return clean;
  };

  if (loading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAr ? 'طلبات التواصل والعملاء' : 'Inquiries & Leads'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isAr
                ? 'إدارة وتقارير الأشخاص الذين قاموا بملء نموذج التواصل من الموقع'
                : 'Manage customer inquiries submitted via the website contact form'}
            </p>
          </div>

          <button
            onClick={fetchInquiries}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium shadow-sm self-start"
          >
            <HiRefresh className="w-4 h-4 text-gold" />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>
        </div>

        {/* Status Filter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'all'
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'
            }`}
          >
            <span className="block text-xs opacity-70 mb-1">{isAr ? 'إجمالي الطلبات' : 'Total'}</span>
            <span className="text-2xl font-bold">{inquiries.length}</span>
          </button>

          <button
            onClick={() => setStatusFilter('new')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'new'
                ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20'
                : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="block text-xs opacity-70 mb-1">{isAr ? 'جديد (غير مقروء)' : 'New'}</span>
              {countNew > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              )}
            </div>
            <span className="text-2xl font-bold">{countNew}</span>
          </button>

          <button
            onClick={() => setStatusFilter('contacted')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'contacted'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20'
                : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'
            }`}
          >
            <span className="block text-xs opacity-70 mb-1">{isAr ? 'تم التواصل' : 'Contacted'}</span>
            <span className="text-2xl font-bold">{countContacted}</span>
          </button>

          <button
            onClick={() => setStatusFilter('archived')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'archived'
                ? 'bg-gray-700 text-white border-gray-700 shadow-lg shadow-gray-700/20'
                : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'
            }`}
          >
            <span className="block text-xs opacity-70 mb-1">{isAr ? 'مؤرشف' : 'Archived'}</span>
            <span className="text-2xl font-bold">{countArchived}</span>
          </button>
        </div>

        {/* Search & Actions */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <HiSearch className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isAr ? 'بحث بالاسم، الإيميل، أو الهاتف...' : 'Search by name, email, phone...'}
              className="w-full pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
            />
          </div>
          <p className="text-xs text-gray-400">
            {isAr ? `عرض ${filteredInquiries.length} من أصل ${inquiries.length}` : `Showing ${filteredInquiries.length} of ${inquiries.length}`}
          </p>
        </div>

        {/* Table / List */}
        {filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <HiChatAlt2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">
              {isAr ? 'لا توجد طلبات تواصل' : 'No inquiries found'}
            </h3>
            <p className="text-gray-400 text-sm">
              {isAr ? 'لم يتم العثور على رسائل تطابق بحثك الحالي.' : 'No messages match your current filter.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right rtl:text-right ltr:text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                    <th className="p-4">{isAr ? 'العميل' : 'Customer'}</th>
                    <th className="p-4">{isAr ? 'الهاتف' : 'Phone'}</th>
                    <th className="p-4">{isAr ? 'الرسالة' : 'Message'}</th>
                    <th className="p-4">{isAr ? 'التاريخ' : 'Date'}</th>
                    <th className="p-4">{isAr ? 'الحالة' : 'Status'}</th>
                    <th className="p-4 text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredInquiries.map((inq) => (
                    <tr key={inq.id} className={`hover:bg-gray-50/50 transition-colors ${inq.status === 'new' ? 'bg-amber-50/30' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-sm">
                            {inq.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{inq.name}</p>
                            <p className="text-xs text-gray-400">{inq.email || '—'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 dir-ltr text-right">
                        {inq.phone ? (
                          <div className="flex items-center gap-2 justify-end">
                            <a
                              href={`https://wa.me/${formatPhoneForWhatsapp(inq.phone)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 p-1 rounded hover:bg-emerald-50"
                              title="WhatsApp"
                            >
                              <HiChatAlt2 className="w-4 h-4" />
                            </a>
                            <a href={`tel:${inq.phone}`} className="text-blue-600 hover:underline font-medium">
                              {inq.phone}
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="p-4 max-w-xs">
                        <p className="line-clamp-2 text-gray-600 text-xs leading-relaxed">
                          {inq.message || isAr ? '(بدون رسالة)' : '(No message)'}
                        </p>
                      </td>

                      <td className="p-4 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(inq.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            inq.status === 'new'
                              ? 'bg-amber-100 text-amber-800'
                              : inq.status === 'contacted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {inq.status === 'new' && <HiClock className="w-3.5 h-3.5" />}
                          {inq.status === 'contacted' && <HiCheckCircle className="w-3.5 h-3.5" />}
                          {inq.status === 'archived' && <HiArchive className="w-3.5 h-3.5" />}
                          {inq.status === 'new'
                            ? isAr ? 'جديد' : 'New'
                            : inq.status === 'contacted'
                            ? isAr ? 'تم التواصل' : 'Contacted'
                            : isAr ? 'مؤرشف' : 'Archived'}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            className="p-1.5 text-gray-500 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                            title={isAr ? 'عرض التفاصيل' : 'View details'}
                          >
                            <HiEye className="w-5 h-5" />
                          </button>

                          {inq.status !== 'contacted' && (
                            <button
                              disabled={updatingId === inq.id}
                              onClick={() => handleUpdateStatus(inq.id, 'contacted')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                              title={isAr ? 'تحديد كـ تم التواصل' : 'Mark as Contacted'}
                            >
                              <HiCheckCircle className="w-5 h-5" />
                            </button>
                          )}

                          {inq.status !== 'archived' && (
                            <button
                              disabled={updatingId === inq.id}
                              onClick={() => handleUpdateStatus(inq.id, 'archived')}
                              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                              title={isAr ? 'أرشفة' : 'Archive'}
                            >
                              <HiArchive className="w-5 h-5" />
                            </button>
                          )}

                          <button
                            disabled={updatingId === inq.id}
                            onClick={() => handleDelete(inq.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title={isAr ? 'حذف' : 'Delete'}
                          >
                            <HiTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Detail View */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="absolute top-5 left-5 rtl:left-auto rtl:right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all"
              >
                <HiX className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 text-gold flex items-center justify-center font-bold text-2xl">
                  {selectedInquiry.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedInquiry.name}</h3>
                  <p className="text-xs text-gray-400">
                    {new Date(selectedInquiry.created_at).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <HiMail className="w-5 h-5 text-gold" />
                  <div>
                    <span className="block text-xs text-gray-400">{isAr ? 'البريد الإلكتروني' : 'Email'}</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="font-medium text-gray-800 hover:underline">
                      {selectedInquiry.email || '—'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <HiPhone className="w-5 h-5 text-gold" />
                  <div>
                    <span className="block text-xs text-gray-400">{isAr ? 'رقم الهاتف' : 'Phone'}</span>
                    <a href={`tel:${selectedInquiry.phone}`} className="font-medium text-gray-800 dir-ltr hover:underline">
                      {selectedInquiry.phone || '—'}
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                  <span className="block text-xs text-gray-400 font-medium">{isAr ? 'الرسالة' : 'Message'}</span>
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
                    {selectedInquiry.message || (isAr ? 'لا يوجد نص رسالة' : 'No message body')}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {selectedInquiry.phone && (
                  <>
                    <a
                      href={`https://wa.me/${formatPhoneForWhatsapp(selectedInquiry.phone)}?text=${encodeURIComponent(
                        isAr
                          ? `أهلاً ${selectedInquiry.name}، تواصلنا معك بخصوص استفسارك من موقع شركة ركائز للتطوير العقاري.`
                          : `Hello ${selectedInquiry.name}, reaching out regarding your inquiry on Rakaez Real Estate.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-emerald-600/20 text-sm"
                    >
                      <HiChatAlt2 className="w-5 h-5" />
                      <span>{isAr ? 'مراسلة عبر واتساب' : 'WhatsApp'}</span>
                    </a>

                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20 text-sm"
                    >
                      <HiPhone className="w-5 h-5" />
                      <span>{isAr ? 'اتصال تليفوني' : 'Call'}</span>
                    </a>
                  </>
                )}
              </div>

              {/* Status Toggle Buttons */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">{isAr ? 'تغيير الحالة:' : 'Set Status:'}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'contacted')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedInquiry.status === 'contacted'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {isAr ? 'تم التواصل' : 'Contacted'}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'archived')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedInquiry.status === 'archived'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isAr ? 'مؤرشف' : 'Archived'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
