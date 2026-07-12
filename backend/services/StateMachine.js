/**
 * StateMachine Service
 * Manages asset lifecycle state transitions with validation
 * Prevents invalid state transitions
 * Pure validation logic - no database access
 */

export class StateMachine {
  /**
   * Asset lifecycle states
   */
  static STATES = {
    AVAILABLE: 'AVAILABLE',
    ALLOCATED: 'ALLOCATED',
    RESERVED: 'RESERVED',
    UNDER_MAINTENANCE: 'UNDER_MAINTENANCE',
    LOST: 'LOST',
    RETIRED: 'RETIRED',
    DISPOSED: 'DISPOSED'
  }

  /**
   * Valid state transitions
   * Format: FROM_STATE: [TO_STATE1, TO_STATE2, ...]
   */
  static TRANSITIONS = {
    AVAILABLE: ['ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED'],
    ALLOCATED: ['AVAILABLE', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED'],
    RESERVED: ['AVAILABLE', 'ALLOCATED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED'],
    UNDER_MAINTENANCE: ['AVAILABLE', 'LOST', 'RETIRED', 'DISPOSED'],
    LOST: ['RETIRED', 'DISPOSED'],
    RETIRED: [], // Terminal state
    DISPOSED: [] // Terminal state
  }

  /**
   * Terminal states - no transitions out
   */
  static TERMINAL_STATES = ['RETIRED', 'DISPOSED', 'LOST']

  /**
   * Validate if transition from current state to target state is allowed
   * @param {string} currentState - Current asset state
   * @param {string} targetState - Desired target state
   * @returns {boolean} - True if transition is valid
   * @throws {Error} - If transition is invalid
   */
  static validateTransition(currentState, targetState) {
    // Validate states exist
    if (!this.STATES[currentState]) {
      throw new Error(`Invalid current state: ${currentState}`)
    }
    if (!this.STATES[targetState]) {
      throw new Error(`Invalid target state: ${targetState}`)
    }

    // Cannot transition from terminal state
    if (this.TERMINAL_STATES.includes(currentState)) {
      throw new Error(`Cannot transition from terminal state ${currentState}`)
    }

    // Same state is not a transition
    if (currentState === targetState) {
      throw new Error(`Cannot transition to same state ${currentState}`)
    }

    // Check if transition is allowed
    const validTransitions = this.TRANSITIONS[currentState] || []
    if (!validTransitions.includes(targetState)) {
      throw new Error(
        `Invalid transition: ${currentState} → ${targetState}. ` +
        `Valid transitions: ${validTransitions.join(', ') || 'none (terminal state)'}`
      )
    }

    return true
  }

  /**
   * Get valid transitions from current state
   * @param {string} currentState - Current asset state
   * @returns {string[]} - Array of valid target states
   */
  static getValidTransitions(currentState) {
    if (!this.STATES[currentState]) {
      throw new Error(`Invalid state: ${currentState}`)
    }

    if (this.TERMINAL_STATES.includes(currentState)) {
      return []
    }

    return this.TRANSITIONS[currentState] || []
  }

  /**
   * Check if a state is terminal
   * @param {string} state - State to check
   * @returns {boolean} - True if state is terminal
   */
  static isTerminalState(state) {
    return this.TERMINAL_STATES.includes(state)
  }

  /**
   * Get all available states
   * @returns {string[]} - Array of all states
   */
  static getAllStates() {
    return Object.values(this.STATES)
  }

  /**
   * Get workflow type for a state transition
   * Useful for audit tracking
   * @param {string} fromState - Source state
   * @param {string} toState - Target state
   * @returns {string} - Workflow type name
   */
  static getWorkflowType(fromState, toState) {
    if (fromState === 'AVAILABLE' && toState === 'ALLOCATED') {
      return 'ALLOCATION'
    }
    if (fromState === 'ALLOCATED' && toState === 'AVAILABLE') {
      return 'RETURN'
    }
    if (fromState === 'ALLOCATED' && toState === 'ALLOCATED') {
      return 'TRANSFER'
    }
    if (fromState === 'AVAILABLE' && toState === 'UNDER_MAINTENANCE') {
      return 'MAINTENANCE_START'
    }
    if (fromState === 'UNDER_MAINTENANCE' && toState === 'AVAILABLE') {
      return 'MAINTENANCE_RESOLVE'
    }
    return 'STATE_CHANGE'
  }

  /**
   * Validate asset can be allocated
   * @param {string} currentState - Current asset state
   * @throws {Error} - If asset cannot be allocated
   */
  static validateCanAllocate(currentState) {
    if (currentState !== 'AVAILABLE') {
      throw new Error(
        `Cannot allocate asset in ${currentState} state. ` +
        `Asset must be AVAILABLE.`
      )
    }
  }

  /**
   * Validate asset can be returned
   * @param {string} currentState - Current asset state
   * @throws {Error} - If asset cannot be returned
   */
  static validateCanReturn(currentState) {
    if (currentState !== 'ALLOCATED') {
      throw new Error(
        `Cannot return asset in ${currentState} state. ` +
        `Asset must be ALLOCATED.`
      )
    }
  }

  /**
   * Validate asset can be transferred
   * @param {string} currentState - Current asset state
   * @throws {Error} - If asset cannot be transferred
   */
  static validateCanTransfer(currentState) {
    if (currentState !== 'ALLOCATED') {
      throw new Error(
        `Cannot transfer asset in ${currentState} state. ` +
        `Asset must be ALLOCATED.`
      )
    }
  }

  /**
   * Validate asset can start maintenance
   * @param {string} currentState - Current asset state
   * @throws {Error} - If asset cannot start maintenance
   */
  static validateCanStartMaintenance(currentState) {
    if (currentState === 'UNDER_MAINTENANCE') {
      throw new Error(`Asset is already under maintenance`)
    }
    if (this.TERMINAL_STATES.includes(currentState)) {
      throw new Error(`Cannot start maintenance on ${currentState} asset`)
    }
  }
}

export default StateMachine
