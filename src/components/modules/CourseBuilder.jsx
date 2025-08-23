import { useMemo, useState, useEffect, useRef } from 'react';
import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';
import LinkModal from './LinkModal';
import ModuleCard from './ModuleCard';
import ModuleModal from './ModuleModal';
import UploadModal from './UploadModal';
import ModuleItem from './ModuleItem';
import '../styles/sideTracker.css';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]); // [{id, name}]
  const [items, setItems] = useState([]); // [{id, moduleId|null, type, ...}]

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  const [query, setQuery] = useState('');

  /** HEADER: Add menu */
  const handleAddClick = type => {
    setCurrentModuleId(null);
    setCurrentItem(null);
    if (type === 'module') {
      setCurrentModule(null);
      setIsModuleModalOpen(true);
    } else if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'upload') {
      setIsUploadModalOpen(true);
    }
  };

  /** MODULE CRUD */
  const handleSaveModule = module => {
    if (currentModule) {
      setModules(prev => prev.map(m => (m.id === module.id ? module : m)));
    } else {
      setModules(prev => [...prev, module]);
    }
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleDeleteModule = moduleId => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
    // Detach items (now independent, shown separately)
    setItems(prev =>
      prev.map(it =>
        it.moduleId === moduleId ? { ...it, moduleId: null } : it
      )
    );
  };

  const handleEditModule = module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true); // open modal when editing
  };

  /** ITEM CRUD */
  const handleSaveLink = linkItem => {
    if (currentItem) {
      setItems(prev =>
        prev.map(i => (i.id === linkItem.id ? { ...i, ...linkItem } : i))
      );
    } else {
      setItems(prev => [...prev, linkItem]);
    }
    setIsLinkModalOpen(false);
    setCurrentItem(null);
  };

  const handleSaveUpload = fileItem => {
    if (currentItem) {
      setItems(prev =>
        prev.map(i => (i.id === fileItem.id ? { ...i, ...fileItem } : i))
      );
    } else {
      setItems(prev => [...prev, fileItem]);
    }
    setIsUploadModalOpen(false);
    setCurrentItem(null);
  };

  const handleDeleteItem = itemId => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleEditItem = item => {
    setCurrentItem(item);
    setCurrentModuleId(item.moduleId ?? null);
    if (item.type === 'link') setIsLinkModalOpen(true);
    if (item.type === 'file') setIsUploadModalOpen(true);
  };

  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId ?? null);
    setCurrentItem(null);
    if (type === 'link') setIsLinkModalOpen(true);
    if (type === 'file') setIsUploadModalOpen(true);
  };

  /** DnD: Move Modules */
  const handleMoveModule = (draggedId, targetId) => {
    if (draggedId === targetId) return;
    setModules(prev => {
      const next = [...prev];
      const fromIdx = next.findIndex(m => m.id === draggedId);
      const toIdx = next.findIndex(m => m.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [dragged] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, dragged);
      return next;
    });
  };

  /** DnD: Move Items */
  const handleMoveItem = (draggedItemId, targetItemId, targetModuleId) => {
    setItems(prev => {
      const arr = [...prev];
      const fromIdx = arr.findIndex(i => i.id === draggedItemId);
      if (fromIdx === -1) return prev;
      const dragged = { ...arr[fromIdx] };
      if (targetItemId) {
        const toIdx = arr.findIndex(i => i.id === targetItemId);
        if (toIdx === -1) return prev;
        dragged.moduleId = arr[toIdx].moduleId; // adopt target module
        arr.splice(fromIdx, 1);
        const newTo = arr.findIndex(i => i.id === targetItemId);
        arr.splice(newTo, 0, dragged);
        return arr;
      }
      dragged.moduleId = targetModuleId ?? null;
      arr.splice(fromIdx, 1);
      arr.push(dragged);
      return arr;
    });
  };

  /** Group items by module */
  const itemsByModule = useMemo(() => {
    const map = new Map();
    modules.forEach(m => map.set(m.id, []));
    items.forEach(it => {
      if (it.moduleId) {
        map.get(it.moduleId)?.push(it);
      }
    });
    return map;
  }, [modules, items]);

  /** Standalone (independent) items */
  const standaloneItems = useMemo(
    () => items.filter(item => !item.moduleId),
    [items]
  );

  /** Search filter (removed validation, now plain lowercase match) */
  const filteredModules = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return modules;
    return modules.filter(m => {
      // match module name from start
      if (m.name.toLowerCase().startsWith(q)) return true;

      // match items inside module from start
      return items.some(
        i =>
          i.moduleId === m.id &&
          ((i.title && i.title.toLowerCase().startsWith(q)) ||
            (i.url && i.url.toLowerCase().startsWith(q)) ||
            (i.fileName && i.fileName.toLowerCase().startsWith(q)))
      );
    });
  }, [modules, items, query]);

  /** Active Module tracking */
  const containerRef = useRef(null);
  const [activeModuleId, setActiveModuleId] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const id = visible[0].target.getAttribute('data-module-id');
          if (id) setActiveModuleId(id);
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 1],
      }
    );
    const nodes = containerRef.current?.querySelectorAll('[data-module-id]');
    nodes?.forEach(n => obs.observe(n));
    return () => obs.disconnect();
  }, [modules, filteredModules]);

  return (
    <div className="course-builder layout">
      <Header onAddClick={handleAddClick} query={query} setQuery={setQuery} />

      <div className="main">
        <section className="content">
          <div className="builder-content" ref={containerRef}>
            {standaloneItems.length === 0 && filteredModules.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Render standalone items */}
                {standaloneItems.length > 0 && (
                  <div className="standalone-items">
                    {standaloneItems.map(item => (
                      <ModuleItem
                        key={item.id}
                        item={item}
                        onDelete={handleDeleteItem}
                        onEdit={handleEditItem}
                        onMoveItem={handleMoveItem}
                      />
                    ))}
                  </div>
                )}

                {/* Render modules */}
                <div className="module-list">
                  {filteredModules.map(module => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      items={itemsByModule.get(module.id) || []}
                      onEdit={handleEditModule}
                      onDelete={handleDeleteModule}
                      onAddItem={handleAddItem}
                      onDeleteItem={handleDeleteItem}
                      onEditItem={handleEditItem}
                      onMoveModule={handleMoveModule}
                      onMoveItem={handleMoveItem}
                      isActive={activeModuleId === module.id}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Right tracker */}
        <aside className="tracker">
          {modules.map(m => (
            <div
              key={m.id}
              className={`tracker-item ${activeModuleId === m.id ? 'active' : ''}`}
              onClick={() => {
                // scroll smoothly to the module
                const el = document.getElementById(`module-${m.id}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {m.name}
            </div>
          ))}
        </aside>
      </div>

      {/* Modals */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        onSave={handleSaveModule}
        module={currentModule}
      />
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
        item={currentItem}
      />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
        item={currentItem}
      />
    </div>
  );
};

export default CourseBuilder;
