import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import DragHandleOutlined from '../../assets/DragHandleOutlined.svg';
import PDFColored from '../../assets/PDFColored.svg';
import LinkColored from '../../assets/LinkColored.svg';
import DotsVerticalOutlined from '../../assets/DotsVerticalOutlined.svg';
import PencilLineOutlined from '../../assets/PencilLineOutlined.svg';
import DeleteOutlined from '../../assets/DeleteOutlined.svg';
import UploadOutlined from '../../assets/UploadOutlined.svg'; // for download

const ModuleItem = ({ item, onDelete, onEdit, onMoveItem }) => {
  const [hovered, setHovered] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const dragHandleRef = useRef(null);
  const itemRef = useRef(null);

  // Enable drag only when hovered
  const [, drag] = useDrag({
    type: 'ITEM',
    item: { id: item.id },
    canDrag: () => hovered,
  });

  // Enable drop
  const [, drop] = useDrop({
    accept: 'ITEM',
    hover: dragged => {
      if (dragged.id !== item.id) {
        onMoveItem(dragged.id, item.id, item.moduleId);
      }
    },
  });

  drag(dragHandleRef);
  drop(itemRef);

  const handleDownload = () => {
    if (item.type === 'file' && item.fileUrl) {
      const link = document.createElement('a');
      link.href = item.fileUrl;
      link.download = item.fileName;
      link.click();
    }
  };

  return (
    <div
      ref={itemRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px',
        position: 'relative',
        paddingLeft: '28px', // reserve space for drag handle
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drag icon */}
      <div
        ref={dragHandleRef}
        style={{
          cursor: hovered ? 'grab' : 'default',
          position: 'absolute',
          left: '6px',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: hovered ? 'auto' : 'none',
          zIndex: 2,
        }}
        title="Drag to reorder"
      >
        <img src={DragHandleOutlined} alt="Drag" width={20} height={20} />
      </div>

      {/* Item content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {item.type === 'link' && (
            <img src={LinkColored} alt="Link" width={20} height={20} />
          )}
          {item.type === 'file' && (
            <img src={PDFColored} alt="PDF" width={20} height={20} />
          )}

          <div>
            <h4 style={{ margin: 0, fontWeight: 600 }}>{item.title}</h4>
            {item.type === 'link' && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '12px', color: '#007bff' }}
              >
                {item.url}
              </a>
            )}
            {item.type === 'file' && (
              <p style={{ fontSize: '12px', margin: 0 }}>
                {item.fileName} ({Math.round(item.fileSize / 1024)} KB)
              </p>
            )}
          </div>
        </div>

        {/* Right: vertical dots menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={e => {
              e.stopPropagation();
              setIsOptionsOpen(prev => !prev);
            }}
            aria-label="options"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <img src={DotsVerticalOutlined} alt="Options" />
          </button>

          {isOptionsOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                zIndex: 10,
              }}
            >
              {/* Rename or Edit depending on type */}
              <button
                onClick={() => {
                  setIsOptionsOpen(false);
                  onEdit(item);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <img src={PencilLineOutlined} alt="" />{' '}
                {item.type === 'file' ? 'Rename' : 'Edit'}
              </button>

              {/* Download option (only for files) */}
              {item.type === 'file' && (
                <button
                  onClick={() => {
                    setIsOptionsOpen(false);
                    handleDownload();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <img src={UploadOutlined} alt="" /> Download
                </button>
              )}

              {/* Delete option */}
              <button
                onClick={() => {
                  setIsOptionsOpen(false);
                  onDelete(item.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  color: 'red',
                }}
              >
                <img src={DeleteOutlined} alt="" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleItem;
