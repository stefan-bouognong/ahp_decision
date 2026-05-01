/**
 * AHPContext.jsx — Global state management for the AHP wizard.
 */
import React, { createContext, useContext, useReducer, useCallback } from "react";
import { buildEmptyMatrix, setMatrixValue } from "../utils/ahp";
import { MIN_CRITERIA, MAX_CRITERIA, MIN_ALTERNATIVES, MAX_ALTERNATIVES } from "../constants";

const initialState = {
  currentStep: 0,
  goal: "",
  criteria: [{ id: 1, name: "" }, { id: 2, name: "" }],
  alternatives: [{ id: 1, name: "" }, { id: 2, name: "" }],
  criteriaMatrix: buildEmptyMatrix(2),
  altMatrices: { 0: buildEmptyMatrix(2), 1: buildEmptyMatrix(2) },
  result: null,
};

const SET_STEP = "SET_STEP";
const SET_GOAL = "SET_GOAL";
const ADD_CRITERION = "ADD_CRITERION";
const REMOVE_CRITERION = "REMOVE_CRITERION";
const UPDATE_CRITERION = "UPDATE_CRITERION";
const ADD_ALTERNATIVE = "ADD_ALTERNATIVE";
const REMOVE_ALTERNATIVE = "REMOVE_ALTERNATIVE";
const UPDATE_ALTERNATIVE = "UPDATE_ALTERNATIVE";
const SET_CRITERIA_CELL = "SET_CRITERIA_CELL";
const SET_ALT_CELL = "SET_ALT_CELL";
const SET_RESULT = "SET_RESULT";
const RESET = "RESET";

function rebuildAltMatrices(criteriaCount, altCount) {
  const matrices = {};
  for (let ci = 0; ci < criteriaCount; ci++) matrices[ci] = buildEmptyMatrix(altCount);
  return matrices;
}

function reducer(state, action) {
  switch (action.type) {
    case SET_STEP: return { ...state, currentStep: action.payload };
    case SET_GOAL: return { ...state, goal: action.payload };
    case ADD_CRITERION: {
      if (state.criteria.length >= MAX_CRITERIA) return state;
      const nc = [...state.criteria, { id: Date.now(), name: "" }];
      return { ...state, criteria: nc, criteriaMatrix: buildEmptyMatrix(nc.length), altMatrices: rebuildAltMatrices(nc.length, state.alternatives.length), result: null };
    }
    case REMOVE_CRITERION: {
      if (state.criteria.length <= MIN_CRITERIA) return state;
      const nc = state.criteria.filter((_, i) => i !== action.payload);
      return { ...state, criteria: nc, criteriaMatrix: buildEmptyMatrix(nc.length), altMatrices: rebuildAltMatrices(nc.length, state.alternatives.length), result: null };
    }
    case UPDATE_CRITERION: {
      const nc = state.criteria.map((c, i) => i === action.payload.index ? { ...c, name: action.payload.name } : c);
      return { ...state, criteria: nc };
    }
    case ADD_ALTERNATIVE: {
      if (state.alternatives.length >= MAX_ALTERNATIVES) return state;
      const na = [...state.alternatives, { id: Date.now(), name: "" }];
      return { ...state, alternatives: na, altMatrices: rebuildAltMatrices(state.criteria.length, na.length), result: null };
    }
    case REMOVE_ALTERNATIVE: {
      if (state.alternatives.length <= MIN_ALTERNATIVES) return state;
      const na = state.alternatives.filter((_, i) => i !== action.payload);
      return { ...state, alternatives: na, altMatrices: rebuildAltMatrices(state.criteria.length, na.length), result: null };
    }
    case UPDATE_ALTERNATIVE: {
      const na = state.alternatives.map((a, i) => i === action.payload.index ? { ...a, name: action.payload.name } : a);
      return { ...state, alternatives: na };
    }
    case SET_CRITERIA_CELL: {
      const { i, j, value } = action.payload;
      return { ...state, criteriaMatrix: setMatrixValue(state.criteriaMatrix, i, j, value), result: null };
    }
    case SET_ALT_CELL: {
      const { criterionIndex, i, j, value } = action.payload;
      const newMatrix = setMatrixValue(state.altMatrices[criterionIndex], i, j, value);
      return { ...state, altMatrices: { ...state.altMatrices, [criterionIndex]: newMatrix }, result: null };
    }
    case SET_RESULT: return { ...state, result: action.payload };
    case RESET: return { ...initialState };
    default: return state;
  }
}

const AHPContext = createContext(null);

export function AHPProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setStep = useCallback((s) => dispatch({ type: SET_STEP, payload: s }), []);
  const setGoal = useCallback((g) => dispatch({ type: SET_GOAL, payload: g }), []);
  const addCriterion = useCallback(() => dispatch({ type: ADD_CRITERION }), []);
  const removeCriterion = useCallback((i) => dispatch({ type: REMOVE_CRITERION, payload: i }), []);
  const updateCriterion = useCallback((index, name) => dispatch({ type: UPDATE_CRITERION, payload: { index, name } }), []);
  const addAlternative = useCallback(() => dispatch({ type: ADD_ALTERNATIVE }), []);
  const removeAlternative = useCallback((i) => dispatch({ type: REMOVE_ALTERNATIVE, payload: i }), []);
  const updateAlternative = useCallback((index, name) => dispatch({ type: UPDATE_ALTERNATIVE, payload: { index, name } }), []);
  const setCriteriaCell = useCallback((i, j, value) => dispatch({ type: SET_CRITERIA_CELL, payload: { i, j, value } }), []);
  const setAltCell = useCallback((criterionIndex, i, j, value) => dispatch({ type: SET_ALT_CELL, payload: { criterionIndex, i, j, value } }), []);
  const setResult = useCallback((r) => dispatch({ type: SET_RESULT, payload: r }), []);
  const reset = useCallback(() => dispatch({ type: RESET }), []);
  const value = { ...state, setStep, setGoal, addCriterion, removeCriterion, updateCriterion, addAlternative, removeAlternative, updateAlternative, setCriteriaCell, setAltCell, setResult, reset };
  return <AHPContext.Provider value={value}>{children}</AHPContext.Provider>;
}

export function useAHP() {
  const ctx = useContext(AHPContext);
  if (!ctx) throw new Error("useAHP must be used inside <AHPProvider>");
  return ctx;
}
