import { useEffect, useState } from 'react';
import { isValidFileSize } from '../../utils/validations';

const UploadModal = ({ isOpen, onClose, onSave, moduleId, item = null }) => {
  const [fileTitle, setFileTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (item) {
      setFileTitle(item.title || '');
      setSelectedFile(null); // no file replacement when editing
    } else {
      setFileTitle('');
      setSelectedFile(null);
    }
  }, [item]);

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!fileTitle.trim()) {
      alert('File title cannot be empty.');
      return;
    }

    // For new upload, file is required
    if (!item && !selectedFile) {
      alert('Please select a file.');
      return;
    }
    if (selectedFile && !isValidFileSize(selectedFile)) {
      alert('File size must be less than 5MB.');
      return;
    }

    const payload = {
      id: item ? item.id : Date.now().toString(),
      moduleId: item ? item.moduleId : (moduleId ?? null),
      type: 'file',
      title: fileTitle.trim(),
      fileName: item?.fileName,
      fileSize: item?.fileSize,
      fileType: item?.fileType,
    };

    // only allow file selection for new uploads
    if (!item && selectedFile) {
      payload.fileName = selectedFile.name;
      payload.fileSize = selectedFile.size;
      payload.fileType = selectedFile.type;
    }

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{item ? 'Rename file' : 'Upload file'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="file-title">File name</label>
              <input
                id="file-title"
                type="text"
                value={fileTitle}
                onChange={e => setFileTitle(e.target.value)}
                placeholder="File title"
                className="form-input"
                autoFocus
              />
            </div>

            {/* Only show file upload input for new files */}
            {!item && (
              <div className="form-group">
                <label htmlFor="file-upload">Select file</label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={!fileTitle.trim() || (!item && !selectedFile)}
            >
              {item ? 'Save changes' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
