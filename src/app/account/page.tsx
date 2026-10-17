"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { Package, MapPin, LogOut, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { useState } from 'react';

// MOCK_DATA_START: Replace with API fetch for user orders and addresses
const mockOrders = [
  { id: "#KMR-8842", date: "Oct 12, 2026", status: "delivered", total: 553.50 },
  { id: "#KMR-8841", date: "Oct 05, 2026", status: "shipped", total: 272.50 },
  { id: "#KMR-8839", date: "Sep 28, 2026", status: "processing", total: 120.00 },
];

const mockAddresses = [
  { id: 1, name: "Home", address: "123 Golden Street, Tehran, Iran", postal: "1234567890", isDefault: true },
  { id: 2, name: "Office", address: "456 Silver Ave, Tehran, Iran", postal: "0987654321", isDefault: false },
];
// MOCK_DATA_END

export default function AccountPage() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Status badge colors
  const getStatusColor = (status: string) => {
    if (status === 'delivered') return 'bg-green-100 text-green-800';
    if (status === 'shipped') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      
      {/* Page Header */}
      <h1 className="text-3xl font-serif text-gray-900 mb-10 text-center md:text-left">
        {t('myAccount')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Sidebar Navigation */}
        <aside className="md:col-span-1">
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                activeTab === 'orders' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4" />
              {t('orderHistory')}
            </button>
            
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                activeTab === 'addresses' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              {t('myAddresses')}
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-serif text-gray-900 mb-6">{t('orderHistory')}</h2>
              <div className="overflow-x-auto border border-gray-200 rounded-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">{t('orderNumber')}</th>
                      <th className="px-6 py-4">{t('date')}</th>
                      <th className="px-6 py-4">{t('status')}</th>
                      <th className="px-6 py-4">{t('totalAmount')}</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 text-gray-600">{order.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                            {t(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-sm font-medium text-black underline underline-offset-4 hover:text-gray-600 transition-colors">
                            {t('viewOrder')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif text-gray-900">{t('myAddresses')}</h2>
                <button 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('addNewAddress')}
                </button>
              </div>

              {/* Add Address Form (Mock) */}
              {showAddressForm && (
                <div className="bg-gray-50 p-6 rounded-sm border border-gray-200 mb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder={t('fullName')} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" />
                    <input type="text" placeholder={t('phone')} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" />
                  </div>
                  <input type="text" placeholder={t('address')} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder={t('city')} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" />
                    <input type="text" placeholder={t('postalCode')} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setShowAddressForm(false)} className="px-6 py-2 border border-gray-300 rounded-sm text-sm hover:bg-gray-100 transition-colors">Cancel</button>
                    <button className="px-6 py-2 bg-black text-white rounded-sm text-sm hover:bg-gray-800 transition-colors">{t('saveAddress')}</button>
                  </div>
                </div>
              )}

              {/* Address List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockAddresses.map((addr) => (
                  <div key={addr.id} className={`p-6 rounded-sm border transition-colors ${addr.isDefault ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{addr.name}</h3>
                        {addr.isDefault && (
                          <span className="flex items-center gap-1 text-xs bg-black text-white px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> {t('defaultAddress')}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{addr.address}</p>
                    <p className="text-sm text-gray-500 mb-6">{addr.postal}</p>
                    
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors">
                        <Edit2 className="w-3 h-3" /> {t('edit')}
                      </button>
                      <button className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="w-3 h-3" /> {t('delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}