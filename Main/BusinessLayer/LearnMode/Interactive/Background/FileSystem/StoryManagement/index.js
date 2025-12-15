// Interactive/Background/FileSystem/StoryManagement/index.js - Central story management exports

import { getNextStorySlide, getFirstStorySlide } from './navigator.js';
import { selectRandomStory, selectNextStory } from './selector.js';
import { findNextSlide, getFirstSlideInStory } from './slideManager.js';

// NAVIGATION OPERATIONS
export { getNextStorySlide, getFirstStorySlide };

// STORY SELECTION OPERATIONS  
export { selectRandomStory, selectNextStory };

// SLIDE MANAGEMENT OPERATIONS
export { findNextSlide, getFirstSlideInStory }; 