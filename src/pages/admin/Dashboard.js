import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaVideo, FaMoneyBillWave, FaEye, FaPlus, FaChartLine } from 'react-icons/fa';
import Header from '../../components/Header/Header';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  background: #141414;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 6rem 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const QuickActionBtn = styled(Link)`
  background: #e50914;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f40612;
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid #333;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || '#e50914'};
  }
`;

const StatIcon = styled.div`
  width: 70px;
  height: 70px;
  background: ${props => props.color || '#e50914'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3);
`;

const StatInfo = styled.div`
  flex: 1;
  
  h3 {
    color: white;
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    line-height: 1;
  }
  
  p {
    color: #ccc;
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }
  
  .trend {
    font-size: 0.85rem;
    color: ${props => props.trend > 0 ? '#4CAF50' : '#f44336'};
    font-weight: 600;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #333;
  
  h3 {
    color: white;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
  }
`;

const DataTable = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #333;
  margin-bottom: 2rem;
  
  h3 {
    color: white;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid #333;
  }
  
  th {
    background: #2a2a2a;
    color: #ccc;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  td {
    color: white;
    font-size: 0.95rem;
  }
  
  tr:hover {
    background: rgba(255, 255, 255, 0.02);
  }
  
  .status {
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
    
    &.active {
      background: rgba(76, 175, 80, 0.2);
      color: #4CAF50;
    }
    
    &.inactive {
      background: rgba(158, 158, 158, 0.2);
      color: #9e9e9e;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #333;
    border-top: 3px solid #e50914;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const RefreshButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background: #45a049;
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const ContainerFlex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [contentData, setContentData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchAnalytics();
    fetchContentData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get('http://localhost:8000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDashboardData(response.data);
      console.log('Dashboard data loaded:', response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Set fallback data for demo
      setDashboardData({
        stats: {
          totalUsers: 0,
          activeSubscriptions: 0,
          totalVideos: 0,
          totalRevenue: 0
        },
        recentUsers: [],
        popularVideos: [],
        monthlyRevenue: [],
        userGrowth: []
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/analytics?period=30', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchContentData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/videos?limit=10', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setContentData(response.data);
    } catch (error) {
      console.error('Error fetching content data:', error);
    }
  };

  const handleDeleteContent = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/videos/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Video deleted successfully');
        fetchContentData(); // Refresh content data
        fetchDashboardData(); // Refresh dashboard stats
      } catch (error) {
        toast.error('Failed to delete video');
      }
    }
  };

  const handleUpdateUserStatus = async (userId, status) => {
    try {
      await axios.put(`http://localhost:8000/api/admin/users/${userId}/status`, 
        { status }, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('User status updated successfully');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  if (loading) {
    return (
      <Container>
        <Header />
        <Content>
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        </Content>
      </Container>
    );
  }

  const { stats, recentUsers, popularVideos } = dashboardData;

  return (
    <Container>
      <Header />
      <Content>
        <PageHeader>
          <Title>Admin Dashboard</Title>
          <QuickActions>
            <RefreshButton onClick={fetchDashboardData} disabled={refreshing}>
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </RefreshButton>
            <QuickActionBtn to="/admin/analytics">
              <FaChartLine />
              View Analytics
            </QuickActionBtn>
            <QuickActionBtn to="/admin/content">
              <FaVideo />
              Manage Content
            </QuickActionBtn>
            <QuickActionBtn to="/admin/upload">
              <FaPlus />
              Upload Video
            </QuickActionBtn>
          </QuickActions>
        </PageHeader>
        
        <StatsGrid>
          <StatCard color="#e50914">
            <StatIcon color="#e50914">
              <FaUsers />
            </StatIcon>
            <StatInfo trend={12}>
              <h3>{stats.totalUsers.toLocaleString()}</h3>
              <p>Total Users</p>
              <div className="trend">
                {stats.totalUsers > 0 ? '+12% this month' : 'No users yet'}
              </div>
            </StatInfo>
          </StatCard>
          
          <StatCard color="#4CAF50">
            <StatIcon color="#4CAF50">
              <FaMoneyBillWave />
            </StatIcon>
            <StatInfo trend={8}>
              <h3>{stats.activeSubscriptions.toLocaleString()}</h3>
              <p>Active Subscriptions</p>
              <div className="trend">
                {stats.activeSubscriptions > 0 ? '+8% this month' : 'No active subscriptions'}
              </div>
            </StatInfo>
          </StatCard>
          
          <StatCard color="#2196F3">
            <StatIcon color="#2196F3">
              <FaVideo />
            </StatIcon>
            <StatInfo trend={15}>
              <h3>{stats.totalVideos}</h3>
              <p>Total Videos</p>
              <div className="trend">
                {stats.totalVideos > 0 ? '+15 this month' : 'No videos uploaded'}
              </div>
            </StatInfo>
          </StatCard>
          
          <StatCard color="#FF9800">
            <StatIcon color="#FF9800">
              <FaEye />
            </StatIcon>
            <StatInfo trend={22}>
              <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
              <div className="trend">
                {stats.totalRevenue > 0 ? '+22% this month' : 'No revenue yet'}
              </div>
            </StatInfo>
          </StatCard>
        </StatsGrid>

        <ChartsGrid>
          <ChartCard>
            <h3>Revenue Analytics</h3>
            <div style={{ 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#666',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {analyticsData?.dailyRevenue ? (
                <>
                  <div style={{ fontSize: '2rem', color: '#4CAF50' }}>
                    ₹{analyticsData.dailyRevenue.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                  </div>
                  <div>Revenue (Last 30 Days)</div>
                  <div style={{ fontSize: '1.2rem', color: '#2196F3' }}>
                    {analyticsData.dailyRevenue.reduce((sum, item) => sum + item.transactions, 0)} Transactions
                  </div>
                </>
              ) : (
                'No revenue data available'
              )}
            </div>
          </ChartCard>
          
          <ChartCard>
            <h3>Content Performance</h3>
            <div style={{ 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#666',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {analyticsData?.topContent && analyticsData.topContent.length > 0 ? (
                <>
                  <div style={{ fontSize: '2rem', color: '#FF9800' }}>
                    {analyticsData.topContent[0].views.toLocaleString()}
                  </div>
                  <div>Top Video Views</div>
                  <div style={{ fontSize: '1rem', color: '#ccc', textAlign: 'center' }}>
                    "{analyticsData.topContent[0].title}"
                  </div>
                </>
              ) : (
                'No content data available'
              )}
            </div>
          </ChartCard>
        </ChartsGrid>

        {/* Enhanced Recent Users Table with Actions */}
        {dashboardData?.recentUsers && dashboardData.recentUsers.length > 0 && (
          <DataTable>
            <h3>Recent Users Management</h3>
            <div style={{ overflowX: 'auto' }}>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Join Date</th>
                    <th>Subscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${user.subscription?.status || 'inactive'}`}>
                          {user.subscription?.status || 'inactive'}
                        </span>
                      </td>
                      <td>
                        <select 
                          onChange={(e) => handleUpdateUserStatus(user._id, e.target.value)}
                          style={{ 
                            background: '#333', 
                            color: 'white', 
                            border: '1px solid #555',
                            padding: '0.25rem',
                            borderRadius: '4px'
                          }}
                        >
                          <option value="">Change Status</option>
                          <option value="active">Activate</option>
                          <option value="inactive">Deactivate</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </DataTable>
        )}

        {/* Enhanced Content Management Table */}
        {contentData?.videos && contentData.videos.length > 0 && (
          <DataTable>
            <h3>Content Management</h3>
            <div style={{ overflowX: 'auto' }}>
              <Table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Views</th>
                    <th>Upload Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contentData.videos.map(video => (
                    <tr key={video._id}>
                      <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {video.title}
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{video.type}</td>
                      <td>{video.views?.toLocaleString() || 0}</td>
                      <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${video.isActive ? 'active' : 'inactive'}`}>
                          {video.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => window.open(`/details/${video._id}`, '_blank')}
                            style={{
                              background: '#2196F3',
                              color: 'white',
                              border: 'none',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteContent(video._id)}
                            style={{
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </DataTable>
        )}

        {(!recentUsers || recentUsers.length === 0) && (!popularVideos || popularVideos.length === 0) && (
          <DataTable>
            <h3>Getting Started</h3>
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ccc' }}>
              <p>Welcome to your StreamFlix Admin Dashboard!</p>
              <p>To get started:</p>
              <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '1rem auto' }}>
                <li>Create subscription plans using "Create Plans" button</li>
                <li>Upload sample content using "Seed Movies" button</li>
                <li>Add your own content using "Upload Video" button</li>
                <li>Monitor user registrations and subscriptions</li>
              </ul>
            </div>
          </DataTable>
        )}
      </Content>
    </Container>
  );
};

export default Dashboard;
