import { useEffect, useState } from 'react';
import CloseOutlined from '../../assets/CloseOutlined.svg';

const LinkModal = ({ isOpen, onClose, onSave, moduleId, item = null }) => {
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setLinkTitle(item.title || '');
      setLinkUrl(item.url || '');
    } else {
      setLinkTitle('');
      setLinkUrl('');
    }
    setError('');
  }, [item]);

  const handleSubmit = e => {
    e.preventDefault();

    if (!linkUrl.trim()) {
      setError('URL cannot be empty');
      return;
    }

    onSave({
      id: item ? item.id : Date.now().toString(),
      moduleId: item ? item.moduleId : (moduleId ?? null),
      type: 'link',
      title: linkTitle,
      url: linkUrl,
    });

    onClose(); // close modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{item ? 'Edit link' : 'Add a link'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="close">
            <img src={CloseOutlined} alt="Close" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="link-url">URL</label>
              <input
                id="link-url"
                type="text"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="form-input"
              />
              {error && <p className="error-text">{error}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="link-title">Display name</label>
              <input
                id="link-title"
                type="text"
                value={linkTitle}
                onChange={e => setLinkTitle(e.target.value)}
                placeholder="Link title"
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
              {item ? 'Save changes' : 'Add link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;
