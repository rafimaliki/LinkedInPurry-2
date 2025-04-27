import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

const hash = (data: string) => CryptoJS.SHA256(data).toString();

const usePersistentUseState = <T,>(
  key: string,
  initialValue: T,
  expirationTimeInSeconds?: number
) => {
  const hashedKey = hash(key);

  const getValue = (): T | null => {
    const storedValue = localStorage.getItem(hashedKey);
    if (storedValue) {
      try {
        const decryptedValue = CryptoJS.AES.decrypt(
          storedValue,
          hashedKey
        ).toString(CryptoJS.enc.Utf8);

        const { value, expiration } = JSON.parse(decryptedValue) as {
          value: T;
          expiration: number | null;
        };

        if (expiration && Date.now() > expiration) {
          localStorage.removeItem(hashedKey);
          return null;
        }

        return value;
      } catch {
        console.error("Decryption failed or tampered data");
        localStorage.removeItem(hashedKey);
        return null;
      }
    }
    return initialValue;
  };

  const [state, setState] = useState<T | null>(getValue);

  useEffect(() => {
    if (state === null) {
      localStorage.removeItem(hashedKey);
      return;
    }

    const expiration =
      expirationTimeInSeconds != null
        ? Date.now() + expirationTimeInSeconds * 1000
        : null;

    const encryptedValue = CryptoJS.AES.encrypt(
      JSON.stringify({ value: state, expiration }),
      hashedKey
    ).toString();

    localStorage.setItem(hashedKey, encryptedValue);
  }, [state, hashedKey, expirationTimeInSeconds]);

  return [state, setState] as const;
};

export default usePersistentUseState;
