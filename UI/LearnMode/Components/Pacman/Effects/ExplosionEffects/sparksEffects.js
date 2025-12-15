// Effects/ExplosionEffects/sparksEffects.js - Explosion spark effects

// IMPORTS
import { PACMAN_CONFIG, ANIMATION_CONFIG } from '../../pacmanConfig.js';
import { findTrackElement } from '../MovementEffects/targetUtils.js';

// CONFIG
const SPARKS_CONFIG = {
    MIN_WIDTH: 1,
    MAX_WIDTH: 3,
    MIN_HEIGHT: 4,
    MAX_HEIGHT: 12,
    BASE_DISTANCE: 20,
    MAX_DISTANCE: 60,
    VERTICAL_OFFSET: 15,
    DURATION: 1900,
    MAX_ANIMATION_DELAY: 0.4,
    COLORS: ['yellow', 'orange', 'white', 'gold']
};

// OPERATIONS
export const createExplosionSparks = (container, bottom) => {
    // Guard clauses
    if (!container || bottom == null) return false;
    
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    if (!track) return false;
    
    const sparksCount = ANIMATION_CONFIG.EXPLOSION_SPARKS_COUNT;
    
    for (let i = 0; i < sparksCount; i++) {
        const spark = createSingleSpark(bottom, i, sparksCount);
        track.appendChild(spark);
        scheduleSparkRemoval(spark);
    }
    
    return true;
};

export const createColoredSparks = (container, bottom, count, colors = []) => {
    // Guard clauses
    if (!container || bottom == null || count <= 0) return false;
    
    const track = findTrackElement(container, PACMAN_CONFIG.TRACK_CLASS);
    if (!track) return false;
    
    for (let i = 0; i < count; i++) {
        const color = colors[i % colors.length] || getRandomSparkColor();
        const spark = createColoredSpark(bottom, i, count, color);
        track.appendChild(spark);
        scheduleSparkRemoval(spark);
    }
    
    return true;
};

export const createRadialSparks = (container, bottom, density = 1) => {
    // Guard clauses
    if (!container || bottom == null || density <= 0) return false;
    
    const baseCount = ANIMATION_CONFIG.EXPLOSION_SPARKS_COUNT;
    const adjustedCount = Math.floor(baseCount * density);
    
    return createExplosionSparks(container, bottom, adjustedCount);
};

// HELPERS
const createSingleSpark = (bottom, index, totalSparks) => {
    const spark = document.createElement('div');
    spark.className = 'pacman-explosion-spark';
    
    const size = calculateSparkSize();
    applySparkSize(spark, size);
    
    const position = calculateSparkPosition(bottom, index, totalSparks);
    applySparkPosition(spark, position);
    
    const animationDelay = Math.random() * SPARKS_CONFIG.MAX_ANIMATION_DELAY;
    spark.style.animationDelay = `${animationDelay}s`;
    
    return spark;
};

const createColoredSpark = (bottom, index, totalSparks, color) => {
    const spark = createSingleSpark(bottom, index, totalSparks);
    
    if (SPARKS_CONFIG.COLORS.includes(color)) {
        spark.style.backgroundColor = color;
        spark.style.boxShadow = `0 0 4px ${color}`;
    }
    
    return spark;
};

const calculateSparkSize = () => {
    const width = SPARKS_CONFIG.MIN_WIDTH + Math.random() * (SPARKS_CONFIG.MAX_WIDTH - SPARKS_CONFIG.MIN_WIDTH);
    const height = SPARKS_CONFIG.MIN_HEIGHT + Math.random() * (SPARKS_CONFIG.MAX_HEIGHT - SPARKS_CONFIG.MIN_HEIGHT);
    
    return { width, height };
};

const applySparkSize = (spark, { width, height }) => {
    spark.style.width = `${width}px`;
    spark.style.height = `${height}px`;
};

const calculateSparkPosition = (bottom, index, totalSparks) => {
    const angle = (Math.PI * 2 * index) / totalSparks + Math.random() * 0.4;
    const distance = SPARKS_CONFIG.BASE_DISTANCE + Math.random() * (SPARKS_CONFIG.MAX_DISTANCE - SPARKS_CONFIG.BASE_DISTANCE);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    return {
        bottom: bottom + SPARKS_CONFIG.VERTICAL_OFFSET,
        x,
        y
    };
};

const applySparkPosition = (spark, { bottom, x, y }) => {
    spark.style.bottom = `${bottom}px`;
    spark.style.setProperty('--spark-x', `${x}px`);
    spark.style.setProperty('--spark-y', `${y}px`);
};

const getRandomSparkColor = () => {
    return SPARKS_CONFIG.COLORS[Math.floor(Math.random() * SPARKS_CONFIG.COLORS.length)];
};

const scheduleSparkRemoval = (spark) => {
    setTimeout(() => {
        if (spark.parentNode) {
            spark.parentNode.removeChild(spark);
        }
    }, SPARKS_CONFIG.DURATION);
}; 