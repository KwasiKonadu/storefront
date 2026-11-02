'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type ToastType = 'ok' | 'warn' | 'info';
export interface ToastAction {
  label: string;
  onClick: () => void;
}
export interface ToastItem {
  id: number;
  message: ReactNode;
  type: ToastType;
  action?: ToastAction;
}
export interface ModalSpec {
  title: ReactNode;
  content: ReactNode;
  wide?: boolean;
  /** Called whenever the modal closes (button, overlay click, Escape, or replaced by another modal). */
  onClose?: () => void;
}

interface UIValue {
  toasts: ToastItem[];
  toast: (message: ReactNode, opts?: { type?: ToastType; action?: ToastAction }) => void;
  dismissToast: (id: number) => void;
  modal: ModalSpec | null;
  openModal: (spec: ModalSpec) => void;
  closeModal: () => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

const UIContext = createContext<UIValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [modal, setModal] = useState<ModalSpec | null>(null);
  const modalRef = useRef<ModalSpec | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const nextId = useRef(1);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback<UIValue['toast']>((message, opts = {}) => {
    setToasts((t) => [...t, { id: nextId.current++, message, type: opts.type ?? 'ok', action: opts.action }]);
  }, []);

  const closeModal = useCallback(() => {
    const prev = modalRef.current;
    modalRef.current = null;
    setModal(null);
    prev?.onClose?.();
  }, []);
  const openModal = useCallback((spec: ModalSpec) => {
    const prev = modalRef.current;
    modalRef.current = spec;
    setModal(spec);
    prev?.onClose?.();
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Escape closes the top-most layer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (modalRef.current) return closeModal();
      if (searchOpen) return closeSearch();
      if (cartOpen) return closeCart();
      if (menuOpen) closeMenu();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [searchOpen, cartOpen, menuOpen, closeModal, closeSearch, closeCart, closeMenu]);

  const value = useMemo<UIValue>(
    () => ({ toasts, toast, dismissToast, modal, openModal, closeModal, cartOpen, openCart, closeCart, searchOpen, openSearch, closeSearch, menuOpen, openMenu, closeMenu }),
    [toasts, toast, dismissToast, modal, openModal, closeModal, cartOpen, openCart, closeCart, searchOpen, openSearch, closeSearch, menuOpen, openMenu, closeMenu],
  );
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}
