import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../services/firebase';
import Loading from '../../components/reusables/loading';
import PageTransition from '../../components/reusables/page-transition';
import { getDashboardStats, DashboardStats } from '../../services/dashboard.firebase';
import { BsHouseDoor, BsEnvelope } from 'react-icons/bs';
import { MdSell, MdApartment } from 'react-icons/md';
import { formatCurrency } from '../../utils/format';
import { useDataCache } from '../../hooks/useDataCache';

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const navigate = useNavigate();
  const { getProperties, getMessages, setProperties, setMessages } = useDataCache();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Check cache first
      const propertiesCache = getProperties();
      const messagesCache = getMessages();

      // If both caches are valid, calculate stats from cached data
      if (propertiesCache.isValid && messagesCache.isValid) {
        const properties = propertiesCache.data;
        const messages = messagesCache.data;

        // Calculate stats from cached data
        const forSaleProperties = properties.filter(p => p.purpose === 'for-sale');
        const forRentProperties = properties.filter(p => p.purpose === 'for-rent');

        const propertyTypeDistribution = properties.reduce((acc: { [key: string]: number }, property) => {
          const type = property.propertyType;
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const averageSalePrice = forSaleProperties.length > 0
          ? forSaleProperties.reduce((sum, p) => sum + p.price, 0) / forSaleProperties.length
          : 0;

        const averageRentPrice = forRentProperties.length > 0
          ? forRentProperties.reduce((sum, p) => sum + p.price, 0) / forRentProperties.length
          : 0;

        const recentProperties = [...properties]
          .sort((a, b) => {
            const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
            const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
            return dateB - dateA;
          })
          .slice(0, 5);

        const recentMessages = [...messages]
          .sort((a, b) => {
            const dateA = a.timestamp?.seconds ? a.timestamp.seconds * 1000 : 0;
            const dateB = b.timestamp?.seconds ? b.timestamp.seconds * 1000 : 0;
            return dateB - dateA;
          })
          .slice(0, 5);

        setStats({
          totalProperties: properties.length,
          forSaleProperties: forSaleProperties.length,
          forRentProperties: forRentProperties.length,
          totalMessages: messages.length,
          recentProperties,
          recentMessages,
          propertyTypeDistribution,
          averagePrice: {
            sale: averageSalePrice,
            rent: averageRentPrice
          }
        });
      } else {
        // If cache is invalid, fetch fresh data
        const data = await getDashboardStats();
        setStats(data);

        // Update cache with fresh data
        if (!propertiesCache.isValid) {
          setProperties(data.recentProperties);
        }
        if (!messagesCache.isValid) {
          setMessages(data.recentMessages);
        }
      }
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        {error}
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8 text-white">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-90 p-6 rounded-lg border border-dark-80">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-dark-80 rounded-lg">
                <BsHouseDoor className="text-2xl text-btn-primary" />
              </div>
              <div>
                <p className="text-dark-10">Total Properties</p>
                <h3 className="text-2xl font-bold text-white">{stats?.totalProperties || 0}</h3>
              </div>
            </div>
          </div>

          <div className="bg-dark-90 p-6 rounded-lg border border-dark-80">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-dark-80 rounded-lg">
                <MdSell className="text-2xl text-green-500" />
              </div>
              <div>
                <p className="text-dark-10">For Sale</p>
                <h3 className="text-2xl font-bold text-white">{stats?.forSaleProperties || 0}</h3>
              </div>
            </div>
          </div>

          <div className="bg-dark-90 p-6 rounded-lg border border-dark-80">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-dark-80 rounded-lg">
                <MdApartment className="text-2xl text-blue-500" />
              </div>
              <div>
                <p className="text-dark-10">For Rent</p>
                <h3 className="text-2xl font-bold text-white">{stats?.forRentProperties || 0}</h3>
              </div>
            </div>
          </div>

          <div className="bg-dark-90 p-6 rounded-lg border border-dark-80">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-dark-80 rounded-lg">
                <BsEnvelope className="text-2xl text-yellow-500" />
              </div>
              <div>
                <p className="text-dark-10">Messages</p>
                <h3 className="text-2xl font-bold text-white">{stats?.totalMessages || 0}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Property Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-dark-90 p-6 rounded-lg border border-dark-80">
            <h2 className="text-xl font-semibold mb-4 text-white">Property Types</h2>
            <div className="space-y-4">
              {stats?.propertyTypeDistribution && Object.entries(stats.propertyTypeDistribution).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-dark-10 capitalize">{type}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-dark-90 p-6 rounded-lg border border-dark-80">
            <h2 className="text-xl font-semibold mb-4 text-white">Average Prices</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-dark-10">For Sale</span>
                <span className="text-white font-medium">{formatCurrency(stats?.averagePrice.sale || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark-10">For Rent</span>
                <span className="text-white font-medium">{formatCurrency(stats?.averagePrice.rent || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-90 p-6 rounded-lg border border-dark-80">
            <h2 className="text-xl font-semibold mb-4 text-white">Recent Properties</h2>
            <div className="space-y-4">
              {stats?.recentProperties.map(property => (
                <Link 
                  key={property.id} 
                  to={`/admin/edit-property/${property.id}`}
                  className="flex justify-between items-center hover:bg-dark-80 p-2 rounded transition-colors"
                >
                  <span className="text-white">{property.title}</span>
                  <span className="text-dark-10">{formatCurrency(property.price)}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-dark-90 p-6 rounded-lg border border-dark-80">
            <h2 className="text-xl font-semibold mb-4 text-white">Recent Messages</h2>
            <div className="space-y-4">
              {stats?.recentMessages.map(message => (
                <div key={message.id} className="flex justify-between items-center">
                  <span className="text-white">{message.name}</span>
                  <span className="text-dark-10">
                    {message.timestamp?.seconds 
                      ? new Date(message.timestamp.seconds * 1000).toLocaleDateString()
                      : 'No date'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Overview;
