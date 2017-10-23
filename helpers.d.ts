import Vue from 'vue'

declare module 'vuex/types/helpers' {
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
    <Key extends keyof T, Map extends Dictionary<Key>>(map: Map): { [K in keyof Map]: (payload: T[Map[K]]) => R }
    <Key extends keyof T>(map: Key[]): { [K in Key]: (payload: T[K]) => R }
  }
}