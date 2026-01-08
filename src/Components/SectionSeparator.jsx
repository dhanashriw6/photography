import React from 'react';

const SectionSeparator = ({
    fill = '#F7F3E8',
    height = '80px',
    flip = false,
    className = '',
    ...props
}) => {
    return (
        <div
            className={`absolute left-0 w-full overflow-hidden leading-none z-30 ${className}`}
            style={{
                bottom: flip ? 'auto' : '-1px', // -1px overlap to prevent sub-pixel gaps
                top: flip ? '-1px' : 'auto',
                height: height,
                transform: flip ? 'rotate(180deg)' : 'none',
                ...props.style
            }}
            {...props}
        >
            <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="relative block w-[calc(100%+1.3px)] h-full"
                style={{ fill: fill }}
            >
                <path
                    d="M0,0V46.29c47,0,47,43.23,94,43.23c47,0,47-43.23,94-43.23c47,0,47,43.23,94,43.23
          c47,0,47-43.23,94-43.23c47,0,47,43.23,94,43.23c47,0,47-43.23,94-43.23c47,0,47,43.23,94,43.23
          c47,0,47-43.23,94-43.23c47,0,47,43.23,94,43.23c47,0,47-43.23,94-43.23c47,0,47,43.23,94,43.23
          c47,0,47-43.23,94-43.23c47,0,47,43.23,94,43.23c47,0,47-43.23,94-43.23c47,0,47,43.23,94,43.23
          V120H0Z"
                />
            </svg>
        </div>
    );
};

export default SectionSeparator;
