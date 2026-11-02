import type { ReactNode } from 'react';

/** Layout helpers for modal content (the frame + title live in the <Modal /> organism). */
export const ModalBody = ({ children }: { children: ReactNode }) => <div className="modal-body">{children}</div>;
export const ModalFooter = ({ children }: { children: ReactNode }) => <div className="modal-foot">{children}</div>;
