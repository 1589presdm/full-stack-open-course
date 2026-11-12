import { create } from 'zustand'

export const useCounterStore = create(set => ({
    all: 0,
    good: 0,
    neutral: 0,
    bad: 0,

    actions: {
        good: () => set(state => ({
            all: state.all + 1,
            good: state.good + 1
        })),
        neutral: () => set(state => ({
            all: state.all + 1,
            neutral: state.neutral + 1
        })),
        bad: () => set(state => ({
            all: state.all + 1,
            bad: state.bad + 1
        }))
    }
}))

