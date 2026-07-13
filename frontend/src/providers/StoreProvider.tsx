'use client';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // Lazily create the store once per provider instance. Using a lazy state
  // initializer (instead of reading a ref during render) keeps this compatible
  // with React 19's stricter refs rules while preserving per-request stores.
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}
