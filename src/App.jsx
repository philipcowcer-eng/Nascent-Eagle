import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import WrappedView from './components/WrappedView';
import { ShoppingBag, Shield, Zap, BarChart3, Lock, Sparkles } from 'lucide-react';

function App() {
  const [data, setData] = useState(null);

  const handleDataLoaded = (newData) => {
    setData(newData);
  };

  const handleReset = () => {
    setData(null);
  };

  if (data) {
    return <WrappedView data={data} onReset={handleReset} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        {/* Logo/Icon */}
        <div style={{
          width: 100,
          height: 100,
          background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
          borderRadius: 28,
          margin: '0 auto 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(249, 115, 22, 0.3)'
        }}>
          <ShoppingBag style={{ width: 48, height: 48, color: 'white' }} />
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 24,
          background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #f9a8d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Your Amazon Year,<br />Wrapped
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          color: '#94a3b8',
          maxWidth: 600,
          margin: '0 auto 48px',
          lineHeight: 1.6
        }}>
          Discover your shopping story. See exactly where your money went with beautiful,
          Spotify-style insights from your Amazon order history.
        </p>

        {/* Social Proof / Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          marginBottom: 48,
          flexWrap: 'wrap'
        }}>
          {[
            { icon: <Zap style={{ width: 20, height: 20 }} />, text: 'Instant analysis' },
            { icon: <Lock style={{ width: 20, height: 20 }} />, text: '100% private' },
            { icon: <Sparkles style={{ width: 20, height: 20 }} />, text: 'Beautiful visuals' }
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#64748b',
              fontSize: 14
            }}>
              <span style={{ color: '#f97316' }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>

        {/* File Upload - THE CTA */}
        <FileUpload onDataLoaded={handleDataLoaded} />

        {/* Trust Badges */}
        <div style={{
          marginTop: 48,
          padding: '24px 32px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.06)',
          maxWidth: 600,
          margin: '48px auto 0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 12
          }}>
            <Shield style={{ width: 20, height: 20, color: '#22c55e' }} />
            <span style={{ color: '#22c55e', fontWeight: 600, fontSize: 14 }}>Your Privacy is Protected</span>
          </div>
          <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
            All data processing happens <strong style={{ color: '#94a3b8' }}>100% in your browser</strong>.
            Nothing is uploaded to any server. You can even disconnect from the internet and it will still work!
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        maxWidth: 1000,
        margin: '40px auto 80px',
        padding: '0 24px'
      }}>
        <h2 style={{
          fontSize: 32,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 48,
          color: '#e2e8f0'
        }}>
          What You'll Discover
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24
        }}>
          {[
            {
              icon: <BarChart3 style={{ width: 28, height: 28 }} />,
              title: 'Total Spending Breakdown',
              desc: 'See exactly how much you spent and your average order value',
              color: '#22c55e'
            },
            {
              icon: <Sparkles style={{ width: 28, height: 28 }} />,
              title: 'Top Purchases',
              desc: 'Discover your most-bought items and biggest purchases',
              color: '#f97316'
            },
            {
              icon: <Zap style={{ width: 28, height: 28 }} />,
              title: 'Peak Shopping Months',
              desc: 'Find out when you went on your biggest shopping sprees',
              color: '#8b5cf6'
            }
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 16,
              padding: 28,
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.3s',
              cursor: 'default'
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: `${feature.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                color: feature.color
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#f1f5f9' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        padding: '60px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 48, color: '#e2e8f0' }}>
            How to Get Your Amazon Data
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left' }}>
            {[
              { step: '1', title: 'Request Your Data', desc: 'Go to Amazon → Account → Download Your Data → Request Order History' },
              { step: '2', title: 'Download the ZIP', desc: 'Amazon will email you when your data is ready (usually within a few days)' },
              { step: '3', title: 'Find Retail.OrderHistory.csv', desc: 'Unzip the file and look for "Retail.OrderHistory.csv" in the folder' },
              { step: '4', title: 'Upload & Enjoy!', desc: 'Drag the CSV here and watch your shopping story unfold ✨' }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                padding: 20,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 12
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f97316, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0
                }}>
                  {item.step}
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: 4, color: '#f1f5f9' }}>{item.title}</h4>
                  <p style={{ color: '#64748b', fontSize: 14 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div style={{
        textAlign: 'center',
        padding: '80px 24px 60px',
        maxWidth: 600,
        margin: '0 auto'
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#e2e8f0' }}>
          Ready to See Your Story?
        </h2>
        <p style={{ color: '#64748b', marginBottom: 32 }}>
          Upload your CSV above and discover your Amazon shopping insights in seconds.
        </p>
        <div style={{ color: '#475569', fontSize: 12 }}>
          Made with ❤️ for curious shoppers
        </div>
      </div>
    </div>
  );
}

export default App;
