import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaCheck, FaCrown, FaStar, FaDownload, FaDesktop, FaPlay } from 'react-icons/fa';
import Header from '../components/Header/Header';
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

const Hero = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PlanCard = styled(motion.div)`
  background: ${props => props.featured ? 
    'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)' : 
    '#1a1a1a'};
  border: ${props => props.featured ? '2px solid #e50914' : '1px solid #333'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #e50914;
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }
`;

const PlanBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #e50914;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const PlanName = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: white;
  font-weight: 600;
`;

const PlanPrice = styled.div`
  margin-bottom: 1rem;
  
  .currency {
    font-size: 1.2rem;
    color: #e50914;
    font-weight: 600;
  }
  
  .price {
    font-size: 2.5rem;
    font-weight: bold;
    color: #e50914;
    margin: 0 0.2rem;
  }
  
  .duration {
    color: #ccc;
    font-size: 1rem;
    margin-top: 0.5rem;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin: 1.5rem 0;
  text-align: left;
  padding: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  color: #ccc;
  font-size: 0.95rem;
  
  svg {
    color: #4CAF50;
    margin-right: 0.5rem;
    font-size: 0.9rem;
  }
`;

const QualityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const QualityItem = styled.div`
  text-align: center;
  
  .icon {
    font-size: 1.2rem;
    color: #e50914;
    margin-bottom: 0.3rem;
  }
  
  .label {
    font-size: 0.8rem;
    color: #999;
    margin-bottom: 0.2rem;
  }
  
  .value {
    font-size: 0.9rem;
    color: white;
    font-weight: 600;
  }
`;

const PlanButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${props => props.disabled ? '#666' : 
    props.current ? '#4CAF50' : '#e50914'};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.current ? '#45a049' : '#f40612'};
  }
`;

const CurrentPlanSection = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid #e50914;
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #e50914, #f40612);
  }
`;

const CurrentPlanHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  h2 {
    color: white;
    font-size: 1.8rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .status-badge {
    background: #4CAF50;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  .plan-type {
    background: #e50914;
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

const PlanDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const PlanDetailCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  
  .icon {
    font-size: 2rem;
    color: #e50914;
    margin-bottom: 1rem;
  }
  
  .label {
    color: #999;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .value {
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const UpgradeAlert = styled.div`
  background: linear-gradient(135deg, #ff9800, #f57c00);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
  
  h3 {
    color: white;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  .upgrade-benefits {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    
    .benefit {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      font-size: 0.9rem;
      
      svg {
        color: #4CAF50;
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid #e50914;
  color: #e50914;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e50914;
    color: white;
  }
`;

const UpgradeButton = styled.button`
  background: #4CAF50;
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #45a049;
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 1.8rem;
  margin-bottom: 1rem;
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

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  color: white;
  
  h3 {
    margin-bottom: 1rem;
    color: #e50914;
  }
  
  p {
    margin: 0.5rem 0;
    color: #ccc;
  }
`;

const SeedButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 2rem;
  
  &:hover {
    background: #218838;
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #ccc;
  
  h2 {
    margin-bottom: 1rem;
    color: white;
  }
  
  p {
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

const CancelModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const CancelModalContent = styled(motion.div)`
  background: #1a1a1a;
  padding: 2.5rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  color: white;
  
  .cancel-icon {
    font-size: 3rem;
    color: #ff4444;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  h3 {
    margin-bottom: 1rem;
    color: white;
    text-align: center;
    font-size: 1.5rem;
  }
  
  .cancel-details {
    background: rgba(255, 68, 68, 0.1);
    border: 1px solid #ff4444;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        color: #ccc;
      }
      
      .value {
        color: white;
        font-weight: 600;
      }
    }
  }
  
  .cancel-benefits {
    background: rgba(76, 175, 80, 0.1);
    border: 1px solid #4CAF50;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
    
    h4 {
      color: #4CAF50;
      margin-bottom: 0.5rem;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        color: #ccc;
        
        svg {
          color: #4CAF50;
        }
      }
    }
  }
  
  .modal-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    
    @media (max-width: 480px) {
      flex-direction: column;
    }
  }
`;

const Subscription = () => {
  const { user } = useSelector((state) => state.auth);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [upgradeInfo, setUpgradeInfo] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Add isAdmin variable
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const handleSeedPlans = async () => {
    try {
      setSeeding(true);
      // Fix the API URL - remove duplicate /api
      const response = await axios.post('http://localhost:8000/api/subscriptions/seed-plans');
      toast.success(response.data.message);
      await fetchSubscriptionPlans(); // Refresh plans after seeding
    } catch (error) {
      console.error('Error seeding plans:', error);
      toast.error('Failed to create subscription plans');
    } finally {
      setSeeding(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/subscriptions/plans');
      console.log('Fetched plans:', response.data);
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan, isUpgrade = false) => {
    try {
      setSelectedPlan(plan);
      setPaymentLoading(true);
      
      console.log('Creating order for plan:', plan.name, 'Upgrade:', isUpgrade);
      
      // Fix API URL - remove duplicate /api
      const orderResult = await axios.post('http://localhost:8000/api/subscriptions/create-order', { 
        planId: plan._id,
        isUpgrade 
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Order created:', orderResult.data);
      
      if (!orderResult.data.success) {
        throw new Error(orderResult.data.message || 'Failed to create order');
      }
      
      const { orderId, amount, currency, key, planName } = orderResult.data;
      
      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Payment gateway not loaded. Please refresh the page.');
      }
      
      const options = {
        key,
        amount,
        currency,
        name: 'StreamFlix',
        description: `${planName} Subscription${isUpgrade ? ' Upgrade' : ''}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            console.log('Payment successful, verifying...', response);
            
            const verifyResult = await axios.post('http://localhost:8000/api/subscriptions/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan._id
            }, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            });
            
            console.log('Payment verified:', verifyResult.data);
            
            if (verifyResult.data.success) {
              toast.success('🎉 Subscription activated successfully!');
              setTimeout(() => window.location.reload(), 2000);
            } else {
              throw new Error(verifyResult.data.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.response?.data?.message || 'Payment verification failed');
          } finally {
            setPaymentLoading(false);
            setSelectedPlan(null);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#e50914'
        },
        modal: {
          ondismiss: () => {
            setSelectedPlan(null);
            setPaymentLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      console.log('Opening Razorpay with options:', { ...options, key: 'hidden' });
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Subscription error:', error);
      
      let errorMessage = 'Failed to process request';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setPaymentLoading(false);
      setSelectedPlan(null);
    }
  };

  const handleUpgrade = async (plan) => {
    try {
      const response = await axios.post('http://localhost:8000/api/subscriptions/upgrade', {
        newPlanId: plan._id
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setUpgradeInfo(response.data);
      setShowUpgradeModal(true);
    } catch (error) {
      console.error('Upgrade check error:', error);
      toast.error(error.response?.data?.message || 'Cannot upgrade at this time');
    }
  };

  const confirmUpgrade = () => {
    setShowUpgradeModal(false);
    handleSubscribe(selectedPlan, true);
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = async () => {
    try {
      setCancelling(true);
      const response = await axios.post('http://localhost:8000/api/subscriptions/cancel', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        setShowCancelModal(false);
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/subscriptions/reactivate', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error('Reactivate subscription error:', error);
      toast.error(error.response?.data?.message || 'Failed to reactivate subscription');
    }
  };

  const currentSubscription = user?.subscription;
  const isActive = currentSubscription?.status === 'active';
  const isCancelled = currentSubscription?.status === 'cancelled';
  const hasSubscription = isActive || isCancelled;
  const currentPlan = plans.find(plan => plan._id === currentSubscription?.planId);

  console.log('User subscription data:', {
    subscription: currentSubscription,
    isActive,
    isCancelled,
    hasSubscription,
    currentPlan: currentPlan?.name
  });

  const canUpgradeToAdvance = isActive && currentPlan?.type === 'basic';
  
  // Calculate days since subscription
  const daysSinceSubscription = currentSubscription?.startDate 
    ? Math.floor((new Date() - new Date(currentSubscription.startDate)) / (1000 * 60 * 60 * 24))
    : 0;

  const isWithinUpgradeWindow = daysSinceSubscription <= 5;

  // Group plans by type
  const basicPlans = plans.filter(plan => plan.type === 'basic');
  const advancePlans = plans.filter(plan => plan.type === 'advance');

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

  return (
    <Container>
      <Header />
      <Content>
        <Hero>
          <Title>
            {hasSubscription ? 'Your Subscription' : 'Choose Your Perfect Plan'}
          </Title>
          <Subtitle>
            {hasSubscription 
              ? 'Manage your current subscription and explore upgrade options'
              : 'Stream unlimited movies and TV shows. Cancel anytime!'
            }
          </Subtitle>
        </Hero>

        {/* Show seed button if no plans exist AND user is admin */}
        {plans.length === 0 && (
          <EmptyState>
            <h2>No Subscription Plans Available</h2>
            {isAdmin ? (
              <>
                <p>As an admin, you can create the default subscription plans by clicking the button below.</p>
                <SeedButton onClick={handleSeedPlans} disabled={seeding}>
                  {seeding ? 'Creating Plans...' : 'Create Default Plans'}
                </SeedButton>
              </>
            ) : (
              <p>Subscription plans are being set up. Please check back later or contact support.</p>
            )}
          </EmptyState>
        )}

        {/* Current Subscription Section - show if user has any subscription (active or cancelled) */}
        {hasSubscription && currentPlan && (
          <CurrentPlanSection>
            <CurrentPlanHeader>
              <h2>
                <FaCrown style={{ color: '#ffd700' }} />
                Current Plan: {currentPlan.name}
                <span className="plan-type">{currentPlan.type}</span>
              </h2>
              <div className={`status-badge ${isCancelled ? 'cancelled' : ''}`} style={{
                background: isCancelled ? '#ff6b35' : '#4CAF50'
              }}>
                {isCancelled ? 'Cancelled' : 'Active'}
              </div>
            </CurrentPlanHeader>
            
            {/* Show cancellation notice if cancelled */}
            {isCancelled && (
              <div style={{
                background: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <h4 style={{ color: '#ffc107', marginBottom: '0.5rem' }}>
                  ⚠️ Subscription Cancelled
                </h4>
                <p style={{ color: '#ccc', margin: 0 }}>
                  Your subscription is cancelled but you can continue using the service until{' '}
                  <strong style={{ color: 'white' }}>
                    {new Date(currentSubscription.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </strong>
                </p>
              </div>
            )}

            <PlanDetailsGrid>
              <PlanDetailCard>
                <div className="icon">💰</div>
                <div className="label">Price</div>
                <div className="value">₹{currentPlan.price}</div>
              </PlanDetailCard>
              
              <PlanDetailCard>
                <div className="icon">📅</div>
                <div className="label">Billing</div>
                <div className="value">{currentPlan.billing}</div>
              </PlanDetailCard>
              
              <PlanDetailCard>
                <div className="icon">📺</div>
                <div className="label">Quality</div>
                <div className="value">{currentPlan.videoQuality}</div>
              </PlanDetailCard>
              
              <PlanDetailCard>
                <div className="icon">🔗</div>
                <div className="label">Devices</div>
                <div className="value">{currentPlan.simultaneousStreams}</div>
              </PlanDetailCard>
              
              <PlanDetailCard>
                <div className="icon">🚀</div>
                <div className="label">Started On</div>
                <div className="value">
                  {new Date(currentSubscription.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </PlanDetailCard>
              
              <PlanDetailCard>
                <div className="icon">📅</div>
                <div className="label">
                  {isCancelled ? 'Access Until' : 'Next Billing'}
                </div>
                <div className="value">
                  {new Date(currentSubscription.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </PlanDetailCard>
              
              <PlanDetailCard>
                <div className="icon">🔄</div>
                <div className="label">Auto Renew</div>
                <div className="value">{currentSubscription.autoRenew ? 'On' : 'Off'}</div>
              </PlanDetailCard>
              
              <PlanDetailCard>
                <div className="icon">⏰</div>
                <div className="label">Days Active</div>
                <div className="value">{daysSinceSubscription} days</div>
              </PlanDetailCard>
            </PlanDetailsGrid>

            {/* Upgrade Alert for Basic Users */}
            {canUpgradeToAdvance && (
              <UpgradeAlert>
                <h3>🚀 Upgrade to Advance Plan Available!</h3>
                <p>
                  {isWithinUpgradeWindow 
                    ? `You're within the 5-day upgrade window! Upgrade now for just the price difference.`
                    : `Upgrade to unlock premium features and better streaming quality.`
                  }
                </p>
                <div className="upgrade-benefits">
                  <div className="benefit">
                    <FaCheck />
                    HD Quality (1080p)
                  </div>
                  <div className="benefit">
                    <FaCheck />
                    2 Devices
                  </div>
                  <div className="benefit">
                    <FaCheck />
                    Unlimited Downloads
                  </div>
                  <div className="benefit">
                    <FaCheck />
                    Priority Support
                  </div>
                </div>
                {isWithinUpgradeWindow && (
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    padding: '0.75rem', 
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: 'white'
                  }}>
                    ⏰ Free upgrade expires in {5 - daysSinceSubscription} days
                  </div>
                )}
              </UpgradeAlert>
            )}
            
            <ActionButtons>
              {isCancelled ? (
                <UpgradeButton onClick={handleReactivateSubscription}>
                  🔄 Reactivate Subscription
                </UpgradeButton>
              ) : (
                <CancelButton onClick={handleCancelSubscription}>
                  Cancel Subscription
                </CancelButton>
              )}
              
              {canUpgradeToAdvance && !isCancelled && (
                <UpgradeButton 
                  onClick={() => {
                    const advancePlan = plans.find(p => p.type === 'advance' && p.billing === currentPlan.billing);
                    if (advancePlan) {
                      setSelectedPlan(advancePlan);
                      handleUpgrade(advancePlan);
                    }
                  }}
                >
                  {isWithinUpgradeWindow ? '🎁 Free Upgrade' : '⬆️ Upgrade Plan'}
                </UpgradeButton>
              )}
            </ActionButtons>
          </CurrentPlanSection>
        )}

        {/* Always show available plans */}
        {plans.length > 0 && (
          <>
            {/* Basic Plans Section */}
            {basicPlans.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <SectionTitle>
                  {hasSubscription && currentPlan?.type === 'basic' ? 'Your Current Plan Type' : 'Basic Plans'}
                </SectionTitle>
                <PlansGrid>
                  {basicPlans.map((plan, index) => (
                    <PlanCard
                      key={plan._id}
                      featured={plan.billing === 'yearly'}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                      {plan.billing === 'yearly' && (
                        <PlanBadge>💰 Save Money</PlanBadge>
                      )}
                      
                      {/* Current plan indicator */}
                      {currentPlan?._id === plan._id && isActive && (
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: '#4CAF50',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          zIndex: 1
                        }}>
                          Active Plan
                        </div>
                      )}
                      
                      <PlanName>{plan.name}</PlanName>
                      <PlanPrice>
                        <span className="currency">₹</span>
                        <span className="price">{plan.price}</span>
                        <div className="duration">per {plan.billing === 'monthly' ? 'month' : 'year'}</div>
                      </PlanPrice>
                      
                      <QualityGrid>
                        <QualityItem>
                          <div className="icon"><FaPlay /></div>
                          <div className="label">Quality</div>
                          <div className="value">{plan.videoQuality}</div>
                        </QualityItem>
                        <QualityItem>
                          <div className="icon"><FaDesktop /></div>
                          <div className="label">Devices</div>
                          <div className="value">{plan.simultaneousStreams}</div>
                        </QualityItem>
                        <QualityItem>
                          <div className="icon"><FaDownload /></div>
                          <div className="label">Downloads</div>
                          <div className="value">{plan.downloadLimit > 0 ? plan.downloadLimit : 'Limited'}</div>
                        </QualityItem>
                      </QualityGrid>
                      
                      <FeaturesList>
                        {plan.features?.map((feature, i) => (
                          <FeatureItem key={i}>
                            <FaCheck />
                            {feature}
                          </FeatureItem>
                        ))}
                      </FeaturesList>
                      
                      <PlanButton
                        onClick={() => {
                          if (currentPlan?._id === plan._id && isActive) {
                            handleCancelSubscription();
                          } else {
                            handleSubscribe(plan);
                          }
                        }}
                        disabled={paymentLoading}
                        style={{
                          background: currentPlan?._id === plan._id && isActive 
                            ? '#ff4444' 
                            : paymentLoading && selectedPlan?._id === plan._id 
                              ? '#666' 
                              : '#e50914'
                        }}
                      >
                        {paymentLoading && selectedPlan?._id === plan._id ? (
                          'Processing...'
                        ) : currentPlan?._id === plan._id && isActive ? (
                          'Cancel Subscription'
                        ) : (
                          'Subscribe Now'
                        )}
                      </PlanButton>
                    </PlanCard>
                  ))}
                </PlansGrid>
              </div>
            )}

            {/* Advance Plans Section */}
            {advancePlans.length > 0 && (
              <div>
                <SectionTitle>
                  {hasSubscription && currentPlan?.type === 'advance' 
                    ? 'Your Current Plan Type' 
                    : canUpgradeToAdvance 
                      ? 'Upgrade Options' 
                      : 'Advance Plans'
                  }
                </SectionTitle>
                <PlansGrid>
                  {advancePlans.map((plan, index) => (
                    <PlanCard
                      key={plan._id}
                      featured={true}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                      <PlanBadge>
                        <FaCrown /> Premium
                      </PlanBadge>
                      
                      {/* Current plan indicator */}
                      {currentPlan?._id === plan._id && isActive && (
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: '#4CAF50',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          zIndex: 1
                        }}>
                          Active Plan
                        </div>
                      )}
                      
                      <PlanName>{plan.name}</PlanName>
                      <PlanPrice>
                        <span className="currency">₹</span>
                        <span className="price">{plan.price}</span>
                        <div className="duration">per {plan.billing === 'monthly' ? 'month' : 'year'}</div>
                      </PlanPrice>
                      
                      {canUpgradeToAdvance && currentPlan?._id !== plan._id && (
                        <div style={{ 
                          background: isWithinUpgradeWindow ? '#4CAF50' : '#ff9800',
                          color: 'white',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          margin: '1rem 0',
                          textAlign: 'center',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          {isWithinUpgradeWindow 
                            ? `Upgrade for ₹${Math.max(0, plan.price - currentPlan.price)} only!`
                            : `Upgrade Cost: ₹${currentPlan.price + plan.price}`
                          }
                        </div>
                      )}
                      
                      <QualityGrid>
                        <QualityItem>
                          <div className="icon"><FaPlay /></div>
                          <div className="label">Quality</div>
                          <div className="value">{plan.videoQuality}</div>
                        </QualityItem>
                        <QualityItem>
                          <div className="icon"><FaDesktop /></div>
                          <div className="label">Devices</div>
                          <div className="value">{plan.simultaneousStreams}</div>
                        </QualityItem>
                        <QualityItem>
                          <div className="icon"><FaDownload /></div>
                          <div className="label">Downloads</div>
                          <div className="value">Unlimited</div>
                        </QualityItem>
                      </QualityGrid>
                      
                      <FeaturesList>
                        {plan.features?.map((feature, i) => (
                          <FeatureItem key={i}>
                            <FaCheck />
                            {feature}
                          </FeatureItem>
                        ))}
                      </FeaturesList>
                      
                      <PlanButton
                        onClick={() => {
                          if (currentPlan?._id === plan._id && isActive) {
                            handleCancelSubscription();
                          } else if (canUpgradeToAdvance && currentPlan?._id !== plan._id) {
                            setSelectedPlan(plan);
                            handleUpgrade(plan);
                          } else if (!hasSubscription || currentPlan?._id !== plan._id) {
                            handleSubscribe(plan);
                          }
                        }}
                        disabled={paymentLoading}
                        style={{
                          background: currentPlan?._id === plan._id && isActive
                            ? '#ff4444'
                            : canUpgradeToAdvance && currentPlan?._id !== plan._id
                              ? (isWithinUpgradeWindow ? '#4CAF50' : '#ff9800')
                              : paymentLoading && selectedPlan?._id === plan._id
                                ? '#666'
                                : '#e50914'
                        }}
                      >
                        {paymentLoading && selectedPlan?._id === plan._id ? (
                          'Processing...'
                        ) : currentPlan?._id === plan._id && isActive ? (
                          'Cancel Subscription'
                        ) : canUpgradeToAdvance && currentPlan?._id !== plan._id ? (
                          isWithinUpgradeWindow ? '🎁 Free Upgrade' : '⬆️ Upgrade Now'
                        ) : (
                          'Subscribe Now'
                        )}
                      </PlanButton>
                    </PlanCard>
                  ))}
                </PlansGrid>
              </div>
            )}
          </>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && upgradeInfo && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUpgradeModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Upgrade Confirmation</h3>
              <div style={{ margin: '1rem 0' }}>
                <p><strong>Upgrading to:</strong> {upgradeInfo.newPlan?.name}</p>
                <p><strong>Upgrade Amount:</strong> ₹{upgradeInfo.upgradeAmount}</p>
                <p><strong>Reason:</strong> {upgradeInfo.reason}</p>
                <p><strong>Days since subscription:</strong> {upgradeInfo.daysSinceSubscription}</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={confirmUpgrade}
                  style={{ 
                    background: '#e50914', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.75rem 1.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Upgrade
                </button>
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  style={{ 
                    background: '#333', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.75rem 1.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </ModalContent>
          </Modal>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <CancelModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !cancelling && setShowCancelModal(false)}
          >
            <CancelModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cancel-icon">⚠️</div>
              <h3>Cancel Subscription</h3>
              
              <p style={{ textAlign: 'center', color: '#ccc', marginBottom: '1.5rem' }}>
                Are you sure you want to cancel your subscription? Here's what will happen:
              </p>

              <div className="cancel-details">
                <div className="detail-item">
                  <span className="label">Current Plan:</span>
                  <span className="value">{currentPlan?.name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Billing Amount:</span>
                  <span className="value">₹{currentPlan?.price}/{currentPlan?.billing}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Access Until:</span>
                  <span className="value">
                    {new Date(currentSubscription?.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="cancel-benefits">
                <h4>✅ What You Keep:</h4>
                <ul>
                  <li>
                    <FaCheck />
                    Access to all content until {new Date(currentSubscription?.endDate).toLocaleDateString()}
                  </li>
                  <li>
                    <FaCheck />
                    Your watchlist and viewing history
                  </li>
                  <li>
                    <FaCheck />
                    Option to reactivate before expiry
                  </li>
                  <li>
                    <FaCheck />
                    No additional charges
                  </li>
                </ul>
              </div>

              <div className="modal-buttons">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  style={{
                    flex: 1,
                    background: '#333',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Keep Subscription
                </button>
                <button
                  onClick={confirmCancelSubscription}
                  disabled={cancelling}
                  style={{
                    flex: 1,
                    background: cancelling ? '#666' : '#e50914',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    cursor: cancelling ? 'not-allowed' : 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </CancelModalContent>
          </CancelModal>
        )}
      </Content>
    </Container>
  );
};

export default Subscription;
