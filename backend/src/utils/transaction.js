const { sequelize } = require('../config/database');
const { Transaction } = require('sequelize');

/**
 * Execute a database operation within a transaction
 * Implements ACID properties:
 * - Atomicity: All or nothing
 * - Consistency: Valid state transitions
 * - Isolation: Concurrent transactions don't interfere
 * - Durability: Committed changes persist
 */
const executeTransaction = async (callback, isolationLevel = 'READ_COMMITTED') => {
  // Map isolation levels
  const isolationLevels = {
    'READ_UNCOMMITTED': Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    'READ_COMMITTED': Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    'REPEATABLE_READ': Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    'SERIALIZABLE': Transaction.ISOLATION_LEVELS.SERIALIZABLE
  };

  const transaction = await sequelize.transaction({
    isolationLevel: isolationLevels[isolationLevel]
  });

  try {
    console.log(`🔒 Transaction started (Isolation: ${isolationLevel})`);
    
    // Execute the callback with transaction
    const result = await callback(transaction);
    
    // Commit transaction
    await transaction.commit();
    console.log('✅ Transaction committed successfully');
    
    return result;
  } catch (error) {
    // Rollback on error (Atomicity)
    await transaction.rollback();
    console.error('❌ Transaction rolled back:', error.message);
    throw error;
  }
};

/**
 * Simulates Two-Phase Locking (2PL) for concurrency control
 * Phase 1: Growing - acquire all locks
 * Phase 2: Shrinking - release all locks
 */
const executeWithLocking = async (callback) => {
  return executeTransaction(async (transaction) => {
    console.log('🔐 Acquiring locks (Growing Phase)...');
    const result = await callback(transaction);
    console.log('🔓 Releasing locks (Shrinking Phase)...');
    return result;
  }, 'SERIALIZABLE'); // Highest isolation level
};

module.exports = {
  executeTransaction,
  executeWithLocking
};