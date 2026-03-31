import React, { useState } from 'react'
import ViewsLayout from '../Layout'
import { useNavigate } from 'react-router-dom'
import PhotographerLayout from './PhotographerLayout';

const LoginPhotographer = () => {
    const navigate = useNavigate();
 const [agreed, setAgreed] = useState(false);

  return (
    <PhotographerLayout>
      <div className="w-full" style={{ maxWidth: '640px' }}>
        <div className="views-card">


          <h1 style={{
            textAlign: 'center',
            fontSize: '36px',
            fontWeight: 700,
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
            <div style={{ gridColumn: 'span 2', marginTop: '4px' }} onClick={() => navigate('/join-as-photographer/otp-verification')}>
              <button type="submit" className="su-btn-primary" style={{width:"100%"}}>Login</button>
            </div>


          </div>
          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#111',
            fontWeight: 700,
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
            <a href="/join-as-photographer" style={{ color: '#111', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
              Sign Up
            </a>
          </p>


        </div>




      </div>
    </PhotographerLayout>
  )
}

export default LoginPhotographer