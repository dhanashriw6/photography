import React, { useState } from 'react'
import '../index.css';
import ViewsLayout from '../Layout';

const login = () => {
  const [agreed, setAgreed] = useState(false);

  return (
    <ViewsLayout>
      <div className="w-full" style={{ maxWidth: '640px' }}>
        <div className="views-card">


          <h1 style={{
            textAlign: 'center',
            fontSize: '26px',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '28px',
            letterSpacing: '-0.01em',
          }}>Login</h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '24px 20px',
          }}>
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
            <label>Email</label>
            <input type="email" placeholder="johndoe@gmail.com" />
            </div>
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
                <label>Password</label>
                <input type="password" placeholder="********" />
            </div>

            <div style={{ gridColumn: 'span 2', marginTop: '4px', display: 'flex' }}>
              <label className="su-checkbox-row">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                />
                <span>
                  Remember me
                </span>
              </label>
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: '4px' }}>
              <button type="submit" className="su-btn-primary">Login</button>
            </div>


          </div>
          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#111',
            fontWeight: 800,
            textDecoration: 'none',
            cursor: 'pointer',
            marginTop: '20px',
          }}>
           
            Forgot Password?
            
          </p>
          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            marginTop: '20px',
          }}>
            Don't have an account?{' '}
            <a href="/find-photographer" style={{ color: '#111', fontWeight: 800, textDecoration: 'none', cursor: 'pointer' }}>
              Sign Up
            </a>
          </p>


        </div>




      </div>
    </ViewsLayout>
  )
}

export default login