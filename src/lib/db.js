import { db } from './db/connection';
import { query } from './db/config';
import { initialize } from './db/init';

/**
 * @file db.js
 * @description Main database entry point for the application.
 * 
 * Modularized for 20-60 line limit compliance.
 * Delegates storage, config, and initialization to the /db module directory.
 */

/**
 * getDb: Retrieves and initializes the database singleton.
 */
export function getDb() {
  return initialize();
}

// Re-export query for convenience across the app
export { query };

// Default export as requested by existing patterns
export default getDb;
