import { useState } from 'react';
import { 
    Ticket, 
    ShoppingCart,
    Calendar,
    Plus,
    List,
} from 'lucide-react';

import AdminOnSale from './ticketStatus/AdminOnSale';
import AdminOrder from './AdminOrder';
import EventForm from '../components/event/EventForm';
import EventManagement from '../components/event/EventManagement';
function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('onsale');

    const tabs = [
        {
            id: 'onsale',
            label: '售票管理',
            icon: <Ticket className="w-5 h-5" />,
            component: <AdminOnSale />
        },
        {
            id: 'orders',
            label: '訂單查詢',
            icon: <ShoppingCart className="w-5 h-5" />,
            component: <AdminOrder />
        },
        {
            id: 'events',
            label: '活動管理',
            icon: <Calendar className="w-5 h-5" />,
            component: <EventManagement />
        },
        {
            id: 'eventForm',
            label: '新增活動',
            icon: <Plus className="w-5 h-5" />,
            component: <EventForm />
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 px-4 py-6">
            {/* Header */}
                <header className="mx-auto sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-6">
                            <List className="w-6 h-6 text-teal-500" />
                            <h1 className="text-2xl font-semibold text-white">
                                活動管理系統
                            </h1>
                    </div>
                </header>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-700">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-4 overflow-x-auto" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    ${activeTab === tab.id
                                        ? 'border-teal-500 text-white bg-gray-800'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                                    }
                                    px-4 py-4 text-sm font-medium border-b-2
                                    flex items-center gap-2 transition-all duration-200
                                    whitespace-nowrap
                                `}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <div className="transition-all duration-300 ease-in-out">
                    {tabs.find(tab => tab.id === activeTab)?.component}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;