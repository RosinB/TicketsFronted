import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/modal/LoadingSpinner";
import { Search, Calendar, ArrowUpDown, Music2, Clock, Timer, TimerReset, LayoutGrid } from "lucide-react";

function EventList() {
    const navigate = useNavigate();
    const [allEvent, setAllEvent] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAscending, setIsAscending] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saleStatusFilter, setSaleStatusFilter] = useState('all');

    const fetchEvent = () => {
        ApiService.fetchAllPic()
            .then((res) => {
                setAllEvent(res.data.data);
                setFilteredEvents(res.data.data);
            })
            .catch((err) => { console.log("圖片列表沒加載到" + err) })
            .finally(() => { setLoading(false); })
    };

    useEffect(() => {
        fetchEvent();
    }, []);

    const handleClick = (eventId) => {
        navigate(`/event/show/${eventId}`, { state: { eventId } });
    }

    const handleSearch = (query) => {
        const trimmedQuery = query.trim().toLowerCase();
        setSearchQuery(trimmedQuery);

        let filtered = allEvent.filter((event) =>
            event.eventName.toLowerCase().includes(trimmedQuery) ||
            event.eventDate.includes(trimmedQuery)
        );

        if (saleStatusFilter !== 'all') {
            const now = new Date();
            filtered = filtered.filter((event) => {
                const isUpcoming = new Date(event.eventSalesDate) > now;
                return saleStatusFilter === 'upcoming' ? isUpcoming : !isUpcoming;
            });
        }

        setFilteredEvents(filtered);
    };

    const handleSaleStatusFilter = (status) => {
        setSaleStatusFilter(status);

        let filtered = allEvent;

        if (searchQuery) {
            filtered = filtered.filter((event) =>
                event.eventName.toLowerCase().includes(searchQuery) ||
                event.eventDate.includes(searchQuery)
            );
        }

        if (status !== 'all') {
            const now = new Date();
            filtered = filtered.filter((event) => {
                const isUpcoming = new Date(event.eventSalesDate) > now;
                return status === 'upcoming' ? isUpcoming : !isUpcoming;
            });
        }

        setFilteredEvents(filtered);
    };

    const handleSortByDate = () => {
        const sortedEvents = [...filteredEvents].sort((a, b) => {
            const dateA = new Date(a.eventDate);
            const dateB = new Date(b.eventDate);
            return isAscending ? dateA - dateB : dateB - dateA;
        });
        setFilteredEvents(sortedEvents);
        setIsAscending(!isAscending);
    };

    if (loading) return <LoadingSpinner />;
    return (
        <div className="max-w-7xl mx-auto -mt-1">
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <SearchInput value={searchQuery} onChange={handleSearch} />
                    <SortButton onClick={handleSortByDate} isAscending={isAscending} />
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSaleStatusFilter('all')}
                            className={`p-2 border border-blue-400 rounded-lg transition-colors ${saleStatusFilter === 'all'
                                ? 'bg-white '
                                : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            title="全部"
                        >
                            <LayoutGrid
                                className={`w-5 h-5  transition-colors ${saleStatusFilter === 'all'
                                    ? 'text-blue-600'
                                    : 'text-gray-400 group-hover:text-gray-600'
                                    }`}
                            />
                        </button>
                        <button
                            onClick={() => handleSaleStatusFilter('selling')}
                            className={`p-2  border border-blue-400 rounded-lg transition-all group ${saleStatusFilter === 'selling'
                                ? 'bg-blue-700'
                                : 'bg-white hover:bg-gray-200'
                                }`}
                            title="熱賣中"
                        >
                            <Timer
                                className={`w-5 h-5 transition-colors ${saleStatusFilter === 'selling'
                                    ? 'text-white'
                                    : 'text-blue-500 group-hover:text-blue-600'
                                    }`}
                            />
                        </button>
                        <button
                            onClick={() => handleSaleStatusFilter('upcoming')}
                            className={`p-2  border border-blue-400 rounded-lg transition-all group ${saleStatusFilter === 'upcoming'
                                ? 'bg-teal-500'
                                : 'bg-white hover:bg-gray-200'
                                }`}
                            title="即將開賣"
                        >
                            <TimerReset
                                className={`w-5 h-5 transition-colors ${saleStatusFilter === 'upcoming'
                                    ? 'text-white'
                                    : 'text-teal-500 group-hover:text-teal-600'
                                    }`}
                            />
                        </button>

                    </div>
                </div>
            </div>
            <EventGrid events={filteredEvents} onEventClick={handleClick} />
        </div>
    );
}

const SearchInput = ({ value, onChange }) => {
    return (
        <div className="relative w-full md:w-4/12">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="搜尋活動或日期...."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
    );
};

const SortButton = ({ onClick, isAscending }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
            <ArrowUpDown className="h-4 w-4" />
            {isAscending ? "演出日期排序(遠->近)" : "演出日期排序(近->遠)"}
        </button>
    );
};

const EventCard = ({ event, onClick }) => (
    <div className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <EventPic event={event} onClick={onClick} />
        <div className="p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <Calendar className="h-4 w-4" />
                <span>{event.eventDate}</span>
            </div>
            <div className="flex items-start gap-2 mb-2">
                <Music2 className="h-4 w-4 mt-1 text-blue-500 flex-shrink-0" />
                <h3 className="font-bold text-gray-800 line-clamp-2">
                    {event.eventName}
                </h3>
            </div>
            <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{event.eventTime}</span>
                </div>
                {/* <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{event.eventLocation || "演出地點"}</span>
                </div> */}
            </div>
            <button
                onClick={onClick}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
                查看詳情
            </button>
        </div>
    </div>
);

const EventGrid = ({ events, onEventClick }) => {
    if (!events?.length) {
        return (
            <div className="text-center py-12">
                <Music2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">無符合搜尋條件的活動</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
                <EventCard
                    key={event.eventId}
                    event={event}
                    onClick={() => onEventClick(event.eventId)}
                />
            ))}
        </div>
    );
};

const EventPic = ({ event, onClick }) => {
    return (
        <div className="relative">
            <img
                src={event.eventTicketList}
                alt={event.eventName}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onClick={onClick}
            />
            <SaleStatusBadge event={event} />
        </div>
    );
};

const SaleStatusBadge = ({ event }) => {
    const isUpcoming = new Date(event.eventSalesDate) > new Date();

    return (
        <div className={`
        absolute top-3 right-3 
        px-3 py-1 
        text-white text-sm 
        rounded-full 
        shadow-md
        ${isUpcoming ? 'bg-teal-500' : 'bg-blue-700'}
      `}>
            {isUpcoming ? "即將開賣" : "熱賣中"}
        </div>
    );
};

export default EventList;