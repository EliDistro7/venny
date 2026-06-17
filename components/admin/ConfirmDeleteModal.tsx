interface ConfirmDeleteModalProps {
  propertyTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

export default function ConfirmDeleteModal({
  propertyTitle,
  onConfirm,
  onCancel,
  deleting,
}: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-charcoal-roof/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg max-w-sm w-full p-6">
        <h3 className="font-display text-xl text-charcoal-roof mb-2">Delete this listing?</h3>
        <p className="font-body text-sm text-text-soft mb-6">
          “{propertyTitle}” and its photos will be permanently removed. This can't be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="font-body text-sm px-4 py-2 rounded-md text-text-soft hover:bg-mist transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="font-body text-sm px-4 py-2 rounded-md bg-brick-red text-white hover:bg-brick-red-dark transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
