type DoneConfirmModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DoneConfirmModal = ({ open, onConfirm, onCancel }: DoneConfirmModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="add-project-modal" id="done-confirm-modal">
      <div className="add-project-modal__backdrop" id="done-confirm-backdrop" onClick={onCancel}></div>
      <section className="confirm-dialog" aria-labelledby="done-confirm-heading">
        <h2 id="done-confirm-heading">Do you want to mark this project as Done?</h2>
        <div className="confirm-dialog__actions">
          <button id="confirm-done-no" className="confirm-button confirm-button--ghost" type="button" onClick={onCancel}>
            No
          </button>
          <button id="confirm-done-yes" className="confirm-button" type="button" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </section>
    </div>
  );
};
