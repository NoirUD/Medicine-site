"use client";

import { useState } from "react";
import { BookingForm } from "./BookingForm";

type BookingModalProps = {
  serviceName: string;
  serviceId: string;
  contactEmail: string;
  triggerLabel?: string;
};

export function BookingModal({
  serviceName,
  serviceId,
  contactEmail,
  triggerLabel = "Записаться",
}: BookingModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900">Запись на консультацию</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                aria-label="Закрыть"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <BookingForm
              serviceName={serviceName}
              serviceId={serviceId}
              contactEmail={contactEmail}
            />
          </div>
        </div>
      )}
    </>
  );
}
