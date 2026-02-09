import React from 'react';

const ContactLensIcon = ({ className, size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        {/* Eye Shape */}
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />

        {/* Contact Lens Overlay with Iris pattern */}
        <g transform="translate(13, 13)">
            <circle cx="5" cy="5" r="5" fill="var(--background)" stroke="currentColor" />
            <circle cx="5" cy="5" r="1.2" fill="currentColor" />
            {/* Radial iris lines */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                    key={angle}
                    x1="5"
                    y1="2.5"
                    x2="5"
                    y2="3.5"
                    transform={`rotate(${angle} 5 5)`}
                    strokeWidth="1"
                />
            ))}
        </g>
    </svg>
);

export default ContactLensIcon;
