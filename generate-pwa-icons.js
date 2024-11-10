#!/usr/bin/env node

import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';

// Ensure the public directory exists
try {
    mkdirSync('public', { recursive: true });
} catch (err) {
    if (err.code !== 'EEXIST') throw err;
}

function generateIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Fill background with a gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#4a90e2');
    gradient.addColorStop(1, '#357abd');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Draw a simple "F" for Flashcards
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('F', size/2, size/2);

    // Add a subtle shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = size * 0.05;
    ctx.shadowOffsetX = size * 0.02;
    ctx.shadowOffsetY = size * 0.02;

    // Save the image
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(`public/pwa-${size}x${size}.png`, buffer);
    console.log(`Generated ${size}x${size} icon`);
}

// Generate icons
generateIcon(192);
generateIcon(512);

console.log('PWA icons generated successfully!');
