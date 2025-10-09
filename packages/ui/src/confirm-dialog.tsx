"use client";
import React from 'react';
import { Modal } from './modal';
import { Button } from './button';

export function ConfirmDialog({ open, title, description, confirmLabel='Confirm', cancelLabel='Cancel', onConfirm, onCancel }:{ open:boolean; title:string; description?:string; confirmLabel?:string; cancelLabel?:string; onConfirm:()=>void; onCancel:()=>void }){
  return (
    <Modal open={open} onClose={onCancel} title={title} actions={
      <>
        <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        <Button onClick={onConfirm}>{confirmLabel}</Button>
      </>
    }>
      {description && <div className="text-sm text-gray-700">{description}</div>}
    </Modal>
  );
}

