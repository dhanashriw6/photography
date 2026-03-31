import React from 'react'
import ViewsLayout from '../Layout'
import PhotographerLayout from './PhotographerLayout'

const Dashboard = () => {
    return (
    <PhotographerLayout>
            <div className='views-card' style={{
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: '48px 56px',
                maxWidth: '860px',
                width: '100%',
                textAlign: 'center',
                animation: 'ty-fadeIn 0.5s ease both',
            }}>
                Welcome to your dashboard!


            </div>
    </PhotographerLayout>
    )
}

export default Dashboard