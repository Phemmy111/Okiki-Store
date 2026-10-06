import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuoteItem = {
  productId: number;
  name: string;
  slug: string;
  priceKobo: number | null;
  imagePublicId: string | null;
  qty: number;
};

type QuoteStore = {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, "qty">) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearQuote: () => void;
  totalItems: () => number;
};

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty: 1 }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQty: (productId, qty) => {
        if (qty < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, qty } : i
          ),
        }));
      },

      clearQuote: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "okiki-quote" }
  )
);
