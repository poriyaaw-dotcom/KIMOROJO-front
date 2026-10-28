"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { Package, MapPin, LogOut, Plus, Check, Edit2, Trash2, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Order { id: number; total: number; status: string; created_at: string; }
interface CustomOrder { id: number; jewelry_type: string; status: string; created_at: string; budget: number | null; }
interface Address { id: number; first_name: string; last_name: string; phone_number: string; province: string; city: string; address: string; postal_code: string; is_default: boolean; }

export default function AccountPage() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [profileName, setProfileName] = useState('');
  const [profileSurname, setProfileSurname] = useState('');
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Address>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ phone_number: '', province: '', city: '', address: '', postal_code: '', is_default: false });

  useEffect(() => {
    const phone = localStorage.getItem('kimorojo_user_phone');
    const token = localStorage.getItem('kimorojo_auth_token');
    
    if (!phone || !token) {
      router.push('/login');
      return;
    }
    setUserPhone(phone);
    setAuthToken(token);
    loadProfile(token);
    fetchData(token);
  }, [router]);

  const getHeaders = (token: string) => ({
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  const loadProfile = async (token: string) => {
    try {
      const res = await fetch('http://https://api.kimorojo.com/api/profile', { headers: getHeaders(token) });
      const data = await res.json();
      if (data.success && data.data) {
        setProfileName(data.data.first_name || '');
        setProfileSurname(data.data.last_name || '');
        localStorage.setItem('kimorojo_user_profile', JSON.stringify({ firstName: data.data.first_name || '', lastName: data.data.last_name || '' }));
      }
    } catch (error) { console.error("Failed to fetch profile", error); }
  };

  const fetchData = async (token: string) => {
    try {
      const addrRes = await fetch('http://https://api.kimorojo.com/api/addresses', { headers: getHeaders(token) });
      const addrData = await addrRes.json();
      if (addrData.success) setAddresses(addrData.data || []);

      const orderRes = await fetch('http://https://api.kimorojo.com/api/orders', { headers: getHeaders(token) });
      const orderData = await orderRes.json();
      if (orderData.success) setOrders(orderData.data || []);

      const customRes = await fetch('http://https://api.kimorojo.com/api/custom-orders', { headers: getHeaders(token) });
      const customData = await customRes.json();
      if (customData.success) setCustomOrders(customData.data || []);
    } catch (error) { console.error("Failed to fetch account data", error); } 
    finally { setLoading(false); }
  };

  const handleSaveProfile = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('http://https://api.kimorojo.com/api/profile', {
        method: 'POST',
        headers: getHeaders(authToken),
        body: JSON.stringify({ first_name: profileName, last_name: profileSurname })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('kimorojo_user_profile', JSON.stringify({ firstName: profileName, lastName: profileSurname }));
        alert(isFarsi ? 'پروفایل ذخیره شد' : 'Profile saved successfully');
      } else { alert(data.message || 'Failed to save profile'); }
    } catch (error) { console.error("Failed to save profile", error); }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!authToken || !confirm(isFarsi ? 'آیا از حذف این آدرس مطمئن هستید؟' : 'Are you sure?')) return;
    try {
      const res = await fetch(`http://https://api.kimorojo.com/api/addresses/${id}`, { method: 'DELETE', headers: getHeaders(authToken) });
      const data = await res.json();
      if (data.success) setAddresses(prev => prev.filter(a => a.id !== id));
      else alert(data.message || 'Cannot delete');
    } catch (error) { console.error("Failed to delete address", error); }
  };

  const handleSaveEditedAddress = async (id: number) => {
    if (!authToken) return;
    try {
      const addr = addresses.find(a => a.id === id);
      const res = await fetch(`http://https://api.kimorojo.com/api/addresses/${id}`, {
        method: 'PUT',
        headers: getHeaders(authToken),
        body: JSON.stringify({ ...editForm, first_name: addr?.first_name || profileName, last_name: addr?.last_name || profileSurname })
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(prev => prev.map(a => a.id === id ? data.data : a));
        setEditingAddressId(null);
      }
    } catch (error) { console.error("Failed to update address", error); }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      const res = await fetch('http://https://api.kimorojo.com/api/addresses', {
        method: 'POST',
        headers: getHeaders(authToken),
        body: JSON.stringify({ ...newAddress, first_name: profileName || 'User', last_name: profileSurname || 'Name' })
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(prev => [...prev, data.data]);
        setShowAddForm(false);
        setNewAddress({ phone_number: userPhone || '', province: '', city: '', address: '', postal_code: '', is_default: false });
      }
    } catch (error) { console.error("Failed to add address", error); }
  };

  const handleLogout = () => {
    localStorage.removeItem('kimorojo_user_phone');
    localStorage.removeItem('kimorojo_auth_token');
    localStorage.removeItem('kimorojo_cart');
    router.push('/');
  };

  const formatToman = (amount: number) => {
    const locale = isFarsi ? 'fa-IR' : 'en-US';
    return new Intl.NumberFormat(locale).format(Math.round(amount)) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  const getStatusColor = (status: string) => {
    if (status === 'delivered' || status === 'approved') return 'bg-green-100 text-green-800';
    if (status === 'shipped' || status === 'processing') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-24 text-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[80vh]" dir={isFarsi ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-serif text-gray-900 mb-10 text-center md:text-left">{t('myAccount') || 'My Account'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <aside className="md:col-span-1">
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}><Package className="w-4 h-4" /> {t('profile') || 'Profile'}</button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}><Package className="w-4 h-4" /> {t('orderHistory') || 'Order History'}</button>
            <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${activeTab === 'addresses' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}><MapPin className="w-4 h-4" /> {t('myAddresses') || 'My Addresses'}</button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-8 border-t border-gray-200 pt-6"><LogOut className="w-4 h-4" /> {t('logout') || 'Logout'}</button>
          </nav>
        </aside>

        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-gray-50 p-6 rounded-sm border border-gray-200 space-y-6">
              <h2 className="text-xl font-serif text-gray-900">{t('profileInformation') || 'Profile Information'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{isFarsi ? 'نام' : 'First Name'}</label><input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{isFarsi ? 'نام خانوادگی' : 'Last Name'}</label><input type="text" value={profileSurname} onChange={(e) => setProfileSurname(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{isFarsi ? 'شماره تماس' : 'Phone Number'}</label><input type="text" value={userPhone || ''} disabled className="w-full px-4 py-3 border border-gray-200 rounded-sm bg-gray-100 text-gray-500 dir-ltr text-left" /></div>
              <button onClick={handleSaveProfile} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm text-sm font-medium hover:bg-gray-800 transition-colors"><Save className="w-4 h-4" /> {t('saveChanges') || 'Save Changes'}</button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-serif text-gray-900 mb-6">{t('orderHistory') || 'Order History'}</h2>
              {orders.length === 0 && customOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-sm border border-gray-200">{isFarsi ? 'شما هنوز سفارشی ثبت نکرده‌اید.' : 'You have not placed any orders yet.'}</p>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Order</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Total/Budget</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={`reg-${order.id}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">#{order.id}</td>
                          <td className="px-6 py-4 text-gray-600">Regular</td>
                          <td className="px-6 py-4 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</span></td>
                          <td className="px-6 py-4 font-medium">{formatToman(order.total)}</td>
                        </tr>
                      ))}
                      {customOrders.map((order) => (
                        <tr key={`cust-${order.id}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">#{order.id}</td>
                          <td className="px-6 py-4 text-gray-600">Custom ({order.jewelry_type})</td>
                          <td className="px-6 py-4 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</span></td>
                          <td className="px-6 py-4 font-medium">{order.budget ? formatToman(order.budget) : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif text-gray-900">{t('myAddresses') || 'My Addresses'}</h2>
                <button onClick={() => { setNewAddress({ phone_number: userPhone || '', province: '', city: '', address: '', postal_code: '', is_default: addresses.length === 0 }); setShowAddForm(true); }} className="flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"><Plus className="w-4 h-4" /> {t('addNewAddress') || 'Add New Address'}</button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddAddress} className="bg-gray-50 p-6 rounded-sm border border-gray-200 mb-6 space-y-4">
                  <h3 className="font-medium text-gray-900 mb-2">{isFarsi ? 'افزودن آدرس جدید' : 'Add New Address'}</h3>
                  <input type="tel" required value={newAddress.phone_number} onChange={e => setNewAddress({...newAddress, phone_number: e.target.value})} placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black dir-ltr text-left" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" required value={newAddress.province} onChange={e => setNewAddress({...newAddress, province: e.target.value})} placeholder="Province" className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" />
                    <input type="text" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} placeholder="City" className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" />
                  </div>
                  <textarea required value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} placeholder="Full Address" rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" />
                  <input type="text" required value={newAddress.postal_code} onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})} placeholder="Postal Code" className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black dir-ltr text-left" />
                  <div className="flex items-center gap-2"><input type="checkbox" id="is_default" checked={newAddress.is_default} onChange={e => setNewAddress({...newAddress, is_default: e.target.checked})} className="accent-[#682535]" /><label htmlFor="is_default" className="text-sm text-gray-700">{isFarsi ? 'تنظیم به عنوان آدرس پیش‌فرض' : 'Set as default address'}</label></div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2 border border-gray-300 rounded-sm text-sm hover:bg-gray-100 transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-black text-white rounded-sm text-sm hover:bg-gray-800 transition-colors">Save Address</button>
                  </div>
                </form>
              )}

              {addresses.length === 0 && !showAddForm ? <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-sm border border-gray-200">No saved addresses found.</p> : !showAddForm ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`p-6 rounded-sm border transition-colors ${addr.is_default ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                      {editingAddressId === addr.id ? (
                        <div className="space-y-3">
                          <input className="w-full px-3 py-2 border rounded-sm text-sm" value={editForm.phone_number || ''} onChange={e => setEditForm({...editForm, phone_number: e.target.value})} placeholder="Phone" />
                          <input className="w-full px-3 py-2 border rounded-sm text-sm" value={editForm.province || ''} onChange={e => setEditForm({...editForm, province: e.target.value})} placeholder="Province" />
                          <input className="w-full px-3 py-2 border rounded-sm text-sm" value={editForm.city || ''} onChange={e => setEditForm({...editForm, city: e.target.value})} placeholder="City" />
                          <textarea className="w-full px-3 py-2 border rounded-sm text-sm" value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})} placeholder="Address" />
                          <input className="w-full px-3 py-2 border rounded-sm text-sm" value={editForm.postal_code || ''} onChange={e => setEditForm({...editForm, postal_code: e.target.value})} placeholder="Postal Code" />
                          <div className="flex gap-2 pt-2">
                            <button onClick={() => handleSaveEditedAddress(addr.id)} className="flex-1 bg-black text-white py-2 rounded-sm text-sm flex items-center justify-center gap-1"><Save className="w-3 h-3"/> Save</button>
                            <button onClick={() => setEditingAddressId(null)} className="flex-1 border border-gray-300 py-2 rounded-sm text-sm flex items-center justify-center gap-1"><X className="w-3 h-3"/> Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">{addr.first_name} {addr.last_name}</h3>
                              {addr.is_default && <span className="flex items-center gap-1 text-xs bg-black text-white px-2 py-0.5 rounded-full"><Check className="w-3 h-3" /> Default</span>}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{addr.province}, {addr.city}</p>
                          <p className="text-sm text-gray-600 mb-1">{addr.address}</p>
                          <p className="text-sm text-gray-500 mb-6 dir-ltr text-left">{addr.postal_code} | {addr.phone_number}</p>
                          <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <button onClick={() => { setEditingAddressId(addr.id); setEditForm(addr); }} className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors"><Edit2 className="w-3 h-3" /> Edit</button>
                            <button onClick={() => handleDeleteAddress(addr.id)} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"><Trash2 className="w-3 h-3" /> Delete</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}