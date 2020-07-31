import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
    Container,
    CartPricing,
    CartButton,
    CartButtonText,
    CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
    const { products } = useCart();

    const navigation = useNavigation();

    const cartTotal = useMemo(() => {
        if (products) {
            const values = products.map(
                product => product.price * product.quantity,
            );

            const totalValue = values.reduce(
                (sum, current) => sum + current,
                0,
            );

            return formatValue(totalValue);
        }

        return formatValue(0);
    }, [products]);

    const totalItensInCart = useMemo(() => {
        if (products) {
            const quantities = products.map(product => product.quantity);

            const total = quantities.reduce((sum, current) => sum + current, 0);

            return total;
        }

        return 0;
    }, [products]);

    return (
        <Container>
            <CartButton
                testID="navigate-to-cart-button"
                onPress={() => navigation.navigate('Cart')}
            >
                <FeatherIcon name="shopping-cart" size={24} color="#fff" />
                <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
            </CartButton>

            <CartPricing>
                <CartTotalPrice>{cartTotal}</CartTotalPrice>
            </CartPricing>
        </Container>
    );
};

export default FloatingCart;
