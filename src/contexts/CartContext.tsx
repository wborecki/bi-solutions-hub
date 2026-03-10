import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { CartItem, Product } from "@/types/store";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, selectedOptions: Record<string, string>) => void;
  removeItem: (productId: string, selectedOptions: Record<string, string>) => void;
  updateQuantity: (productId: string, selectedOptions: Record<string, string>, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  hasPhysicalItems: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getCartKey(productId: string, options: Record<string, string>): string {
  const sorted = Object.entries(options).sort(([a], [b]) => a.localeCompare(b));
  return `${productId}::${sorted.map(([k, v]) => `${k}=${v}`).join(",")}`;
}

const CART_STORAGE_KEY = "sbi-cart";

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number, selectedOptions: Record<string, string>) => {
    setItems((prev) => {
      const key = getCartKey(product.id, selectedOptions);
      const existingIndex = prev.findIndex(
        (item) => getCartKey(item.product.id, item.selectedOptions) === key
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [...prev, { product, quantity, selectedOptions }];
    });

    toast({
      title: "Adicionado ao carrinho!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  }, [toast]);

  const removeItem = useCallback((productId: string, selectedOptions: Record<string, string>) => {
    const key = getCartKey(productId, selectedOptions);
    setItems((prev) => prev.filter((item) => getCartKey(item.product.id, item.selectedOptions) !== key));
  }, []);

  const updateQuantity = useCallback((productId: string, selectedOptions: Record<string, string>, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, selectedOptions);
      return;
    }
    const key = getCartKey(productId, selectedOptions);
    setItems((prev) =>
      prev.map((item) =>
        getCartKey(item.product.id, item.selectedOptions) === key
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const hasPhysicalItems = items.some((item) => !item.product.digital);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, hasPhysicalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
