import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD');
    const [eurRate, setEurRate] = useState(0.93);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const res = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
                if (res.data && res.data.rates && res.data.rates.EUR) {
                    setEurRate(res.data.rates.EUR);
                }
            } catch (err) {
                console.error("API'den döviz kuru çekilemedi, varsayılan (0.93) kullanılıyor.", err);
            }
        };
        fetchRate();
    }, []);

    // Gelen USD değerini aktif döviz türüne çevirip sembolüyle string döner
    const formatPrice = (usdPrice) => {
        if (!usdPrice) return "0";
        const numPrice = parseFloat(usdPrice);
        if (currency === 'EUR') {
            return "€" + (numPrice * eurRate).toLocaleString(undefined, { maximumFractionDigits: 0 });
        }
        return "$" + numPrice.toLocaleString(undefined, { maximumFractionDigits: 0 });
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};
