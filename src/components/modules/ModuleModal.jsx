import { useState, useEffect } from 'react';
import { isValidModuleName } from '../../utils/validations';

const ModuleModal = ({ isOpen, onClose, onSave, module = null }) => {
  const [moduleName, setModuleName] = useState('');

  useEffect(() => {
    setModuleName(module ? module.name : '');
  }, [module]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!isValidModuleName(moduleName)) {
      alert('Module name cannot be empty.');
      return;
    }
    onSave({
      id: module ? module.id : Date.now().toString(),
      name: moduleName.trim(),
    });
    setModuleName('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{module ? 'Edit module' : 'Create new module'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="module-name">Module name</label>
              <input
                id="module-name"
                type="text"
                value={moduleName}
                onChange={e => setModuleName(e.target.value)}
                placeholder="Introduction to Trigonometry"
                className="form-input"
                autoFocus
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create">
              {module ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleModal;
