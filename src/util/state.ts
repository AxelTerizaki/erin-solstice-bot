import merge from 'lodash.merge';

import { State } from '../types/state';

let state: State;

export function getState() {
	return {...state};
}

export function setState(part: Partial<State>) {
	state = merge(state, part);
	return getState();
}
