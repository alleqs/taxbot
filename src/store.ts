import { proxy } from 'valtio';
import { type Msgs } from './types';

export const state = proxy<Msgs>({ msgs: [] });
