import React, {
    createContext,
    useState,
    useCallback,
    useContext,
    useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
    id: string;
    title: string;
    image_url: string;
    price: number;
    quantity: number;
}

interface CartContext {
    products: Product[];
    addToCart(item: Omit<Product, 'quantity'>): void;
    increment(id: string): void;
    decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function loadProducts(): Promise<void> {
            const items = await AsyncStorage.getItem(
                '@GoMarketplace:cart-items',
            );

            if (items) {
                setProducts(JSON.parse(items));
            }
        }
        loadProducts();
    }, []);

    const addToCart = useCallback(
        async (newItem: Product) => {
            let updatedCartItems = [] as Product[];

            const itemExists = products.find(item => item.id === newItem.id);

            if (itemExists) {
                updatedCartItems = products.map(item => {
                    if (item.id === newItem.id) {
                        return { ...item, quantity: item.quantity + 1 };
                    }
                    return item;
                });
                setProducts(updatedCartItems);
            } else {
                setProducts([{ ...newItem, quantity: 1 }]);
            }

            await AsyncStorage.setItem(
                '@GoMarketplace:cart-items',
                JSON.stringify(products),
            );
        },
        [products],
    );

    const increment = useCallback(
        async (id: string) => {
            const updatedCartItems = products.map(item => {
                if (item.id === id) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });

            setProducts(updatedCartItems);

            await AsyncStorage.setItem(
                '@GoMarketplace:cart-items',
                JSON.stringify(products),
            );
        },
        [products],
    );

    const decrement = useCallback(
        async (id: string) => {
            const updatedCartItems = products
                .map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                    return item;
                })
                .filter(item => item.quantity !== 0);

            setProducts(updatedCartItems);

            await AsyncStorage.setItem(
                '@GoMarketplace:cart-items',
                JSON.stringify(products),
            );
        },
        [products],
    );

    const value = React.useMemo(
        () => ({ addToCart, increment, decrement, products }),
        [products, addToCart, increment, decrement],
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};

function useCart(): CartContext {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(`useCart must be used within a CartProvider`);
    }

    return context;
}

export { CartProvider, useCart };
