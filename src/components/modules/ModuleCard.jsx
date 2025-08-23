import { useState, useMemo, useRef } from 'react';
import ModuleItem from './ModuleItem';
import { useDrag, useDrop } from 'react-dnd';
import classNames from 'classnames';

import DragHandleOutlined from '../../assets/DragHandleOutlined.svg';
import CaretDownFilled from '../../assets/CaretDownFilled.svg';
import DotsVerticalOutlined from '../../assets/DotsVerticalOutlined.svg';
import DeleteOutlined from '../../assets/DeleteOutlined.svg';
import PencilLineOutlined from '../../assets/PencilLineOutlined.svg';

const ModuleCard = ({
  module,
  items = [],
  onEdit,
  onDelete,
  onDeleteItem,
  onEditItem,
  onMoveModule,
  onMoveItem,
  onAddItem,
  isActive,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hovered, setHovered] = useState(false);

  const moduleId = module.id;
  const dragHandleRef = useRef(null);
  const cardRef = useRef(null);

  // ---- DnD: module drag/drop
  const [, drag] = useDrag({
    type: 'MODULE',
    item: { id: module.id },
    canDrag: () => hovered,
  });

  const [, dropModule] = useDrop({
    accept: 'MODULE',
    hover: dragged => {
      if (dragged.id !== module.id) {
        onMoveModule(dragged.id, module.id);
      }
    },
  });

  // ---- DnD: item drop (attach to full card, not just expanded area)
  const [, dropItem] = useDrop({
    accept: 'ITEM',
    drop: dragged => {
      if (dragged.id) {
        onMoveItem(dragged.id, null, moduleId);
      }
    },
  });

  drag(dragHandleRef);
  dropModule(cardRef);
  dropItem(cardRef); // ✅ Item drop also works anywhere on the card

  const moduleItems = useMemo(() => items, [items]);
  const toggleExpanded = () => setIsExpanded(prev => !prev);

  return (
    <div
      ref={cardRef}
      id={`module-${module.id}`}
      data-module-id={module.id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        paddingLeft: '28px',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Drag handle */}
      <div
        ref={dragHandleRef}
        style={{
          cursor: hovered ? 'grab' : 'default',
          position: 'absolute',
          left: '6px',
          top: '18px',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: hovered ? 'auto' : 'none',
          zIndex: 2,
        }}
        title="Drag to reorder module"
      >
        <img src={DragHandleOutlined} alt="Drag" width={20} height={20} />
      </div>

      <div className="module-card">
        {/* Left: expand toggle */}
        <div className="module-content" onClick={toggleExpanded}>
          <div className="module-icon">
            <img
              src={CaretDownFilled}
              alt="Toggle expand"
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </div>
          <div className="module-info">
            <h3 className="module-title">{module.name}</h3>
            <p className="module-subtitle">
              {moduleItems.length === 0
                ? 'Add items to this module'
                : `${moduleItems.length} item${moduleItems.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="module-actions">
          <button
            className="btn-options"
            onClick={e => {
              e.stopPropagation();
              setIsOptionsOpen(prev => !prev);
            }}
            aria-label="module options"
          >
            <img src={DotsVerticalOutlined} alt="Options" />
          </button>
          {isOptionsOpen && (
            <div className="options-menu">
              <button className="option-item" onClick={() => onEdit(module)}>
                <img src={PencilLineOutlined} alt="" /> Edit module name
              </button>
              <button
                className="option-item delete"
                onClick={() => onDelete(module.id)}
              >
                <img src={DeleteOutlined} alt="" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && moduleItems.length > 0 && (
        <div className="module-content-expanded">
          <div className="module-items">
            <div className="module-items-list">
              {moduleItems.map(item => (
                <ModuleItem
                  key={item.id}
                  item={item}
                  onDelete={onDeleteItem}
                  onEdit={onEditItem}
                  onMoveItem={onMoveItem}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
