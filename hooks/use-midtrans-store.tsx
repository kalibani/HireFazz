import { create } from "zustand";

type State = {
  isLoading: boolean;
  successResult: any;
  pendingResult: any;
  error: any;
  isClosed: boolean;
};

type useMidtransStoreProps = {
  setLoading: (isLoading: boolean) => void;
  onSuccess: (successResult: any) => void;
  onPending: (pendingResult: any) => void;
  onError: (error: any) => void;
  onClosed: (isClosed: boolean) => void;
  onReset: () => void;
};

const initialState: State = {
  isLoading: false,
  isClosed: false,
  successResult: {},
  pendingResult: {},
  error: {},
};

export const useMidtransStore = create<State & useMidtransStoreProps>()(
  (set) => ({
    ...initialState,
    setLoading: (v: any) => set({ isLoading: v }),
    onSuccess: (v: any) => set({ successResult: v }),
    onPending: (v: any) => set({ pendingResult: v }),
    onError: (v: any) => set({ error: v }),
    onClosed: (v: boolean) => set({ isClosed: v }),
    onReset: () => set(initialState),
  })
);
