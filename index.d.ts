import Vue from 'vue'
import {
  ActionContext as BaseActionContext,
  Module as BaseModule
} from 'vuex'


interface BasePayload {
  type: string
}

interface RootOption {
  root: true
}

interface Dispatch<P> {
  <K extends keyof P>(type: K, payload: P[K]): Promise<any>
  <K extends keyof P>(payloadWithType: { type: K } & P[K]): Promise<any>

  // Fallback for root actions
  (type: string, payload: any, options: RootOption): Promise<any>
  <P extends BasePayload>(payloadWithType: P, options: RootOption): Promise<any>
}

interface Commit<P> {
  <K extends keyof P>(type: K, payload: P[K]): void
  <K extends keyof P>(payloadWithType: { type: K } & P[K]): void

  // Fallback for root mutations
  (type: string, payload: any, options: RootOption): void
  <P extends BasePayload>(payloadWithType: P, options: RootOption): void
}

interface ActionContext<State, RootState, Getters, Actions, Mutations> extends BaseActionContext<State, RootState> {
  getters: Getters
  dispatch: Dispatch<Actions>
  commit: Commit<Mutations>
}

export type GetterTree<State, Getters, RootState> = {
  [K in keyof Getters]: (state: State, getters: Getters, rootState: RootState, rootGetters: any) => Getters[K]
}

export type ActionTree<Actions, State, RootState, Mutations, Getters = {}> = {
  [K in keyof Actions]: (ctx: ActionContext<State, RootState, Getters, Actions, Mutations>, payload: Actions[K]) => void | Promise<any>
}

export type MutationTree<Mutations, State> = {
  [K in keyof Mutations]: (state: State, payload: Mutations[K]) => void
}

type Mapper<P> = {
  [K in keyof P]: { type: K } & P[K]
}

export type Dispatcher<Actions, M extends Mapper<Actions> = Mapper<Actions>, K extends keyof M = keyof M> = M[K]

export type Committer<Mutations, M extends Mapper<Mutations> = Mapper<Mutations>, K extends keyof M = keyof M> = M[K]

export interface Module<S, R> extends BaseModule<S, R> {}

type Dictionary<T> = { [key: string]: T };

type Accessor<T, State, Getters> = {
  [K in keyof T]: <V extends Vue>(this: V, state: State, getters: Getters) => T[K]
} & {
  [key: string]: <V extends Vue>(this: V, state: State, getters: Getters) => any
}

interface ComputedMapper<T> {
  <Key extends keyof T, Map extends Dictionary<Key>>(map: Map): { [K in keyof Map]: () => T[Map[K]] }
  <Key extends keyof T>(map: Key[]): { [K in Key]: () => T[K] }
}

interface ComputedStateMapper<State, Getters> {
  <T>(map: Accessor<T, State, Getters>): { [K in keyof T]: () => T[K] }
}

interface MethodsMapper<T, R> {
  <Key extends keyof T, Map extends Dictionary<Key>>(map: Map): { [K in keyof Map]: (payload?: T[Map[K]]) => R }
  <Key extends keyof T, Map extends Dictionary<Key>>(map: Map): { [K in keyof Map]: (payload: T[Map[K]]) => R }
  <Key extends keyof T>(map: Key[]): { [K in Key]: (payload: T[K]) => R }
}

interface StrictNamespacedMappers<State, Getters, Mutations, Actions> {
  mapState: ComputedMapper<State> & ComputedStateMapper<State, Getters>
  mapGetters: ComputedMapper<Getters>
  mapMutations: MethodsMapper<Mutations, void>
  mapActions: MethodsMapper<Actions, Promise<any>>
}

export function createNamespacedHelpers<State, Getters, Mutations, Actions>(namespace: string): StrictNamespacedMappers<State, Getters, Mutations, Actions>