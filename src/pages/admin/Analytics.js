import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaVideo, FaMoneyBillWave, FaCalendar } from 'react-icons/fa';
import Header from '../../components/Header/Header';
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
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: #333;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background 0.3s ease;
  
  &:hover {
    background: #555;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
`;

const PeriodSelector = styled.select`
  background: #333;
  color: white;
  border: 1px solid #555;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-left: auto;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #333;
  text-align: center;
  
  .icon {
    font-size: 2.5rem;
    color: ${props => props.color || '#e50914'};
    margin-bottom: 1rem;
  }
  
  .value {
    color: white;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .label {
    color: #ccc;
    font-size: 1rem;
  }
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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

const TopContentList = styled.div`
  .content-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #333;
    
    &:last-child {
      border-bottom: none;
    }
    
    .title {
      color: white;
      font-weight: 600;
      flex: 1;
    }
    
    .views {
      color: #4CAF50;
      font-weight: 600;
    }
  }
`;

const Analytics = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/admin/analytics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header />
        <Content>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'white' }}>
            Loading analytics...
          </div>
        </Content>
      </Container>
    );
  }

  const totalRevenue = analyticsData?.dailyRevenue?.reduce((sum, item) => sum + item.revenue, 0) || 0;
  const totalTransactions = analyticsData?.dailyRevenue?.reduce((sum, item) => sum + item.transactions, 0) || 0;
  const totalRegistrations = analyticsData?.userRegistrations?.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <Container>
      <Header />
      <Content>
        <PageHeader>
          <BackButton onClick={() => navigate('/admin')}>
            <FaArrowLeft />
          </BackButton>
          <Title>Analytics Dashboard</Title>
          <PeriodSelector value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </PeriodSelector>
        </PageHeader>

        <StatsGrid>
          <StatCard color="#4CAF50">
            <div className="icon">
              <FaMoneyBillWave />
            </div>
            <div className="value">₹{totalRevenue.toLocaleString()}</div>
            <div className="label">Total Revenue</div>
          </StatCard>

          <StatCard color="#2196F3">
            <div className="icon">
              <FaUsers />
            </div>
            <div className="value">{totalRegistrations}</div>
            <div className="label">New Registrations</div>
          </StatCard>

          <StatCard color="#FF9800">
            <div className="icon">
              <FaCalendar />
            </div>
            <div className="value">{totalTransactions}</div>
            <div className="label">Total Transactions</div>
          </StatCard>

          <StatCard color="#9C27B0">
            <div className="icon">
              <FaVideo />
            </div>
            <div className="value">{analyticsData?.topContent?.length || 0}</div>
            <div className="label">Active Content</div>
          </StatCard>
        </StatsGrid>

        <ChartsSection>
          <ChartCard>
            <h3>Top Performing Content</h3>
            <TopContentList>
              {analyticsData?.topContent?.slice(0, 10).map((content, index) => (
                <div key={content._id} className="content-item">
                  <div className="title">
                    {index + 1}. {content.title}
                  </div>
                  <div className="views">
                    {content.views.toLocaleString()} views
                  </div>
                </div>
              )) || (
                <div style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                  No content data available
                </div>
              )}
            </TopContentList>
          </ChartCard>

          <ChartCard>
            <h3>Revenue Breakdown</h3>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
              {analyticsData?.dailyRevenue && analyticsData.dailyRevenue.length > 0 ? (
                <>
                  <div style={{ fontSize: '1.5rem', color: '#4CAF50' }}>
                    Average: ₹{Math.round(totalRevenue / analyticsData.dailyRevenue.length).toLocaleString()}
                  </div>
                  <div style={{ color: '#ccc' }}>per day</div>
                  <div style={{ fontSize: '1.2rem', color: '#2196F3' }}>
                    Peak: ₹{Math.max(...analyticsData.dailyRevenue.map(d => d.revenue)).toLocaleString()}
                  </div>
                </>
              ) : (
                <div style={{ color: '#666' }}>No revenue data available</div>
              )}
            </div>
          </ChartCard>
        </ChartsSection>
      </Content>
    </Container>
  );
};

export default Analytics;
