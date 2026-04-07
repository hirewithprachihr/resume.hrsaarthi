import React from 'react'
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Hash, Briefcase, GraduationCap, Code, Award, Lightbulb, Languages, Heart } from 'lucide-react'
import { useResumeStore } from '../store/resumeStore'
import clsx from 'clsx'

const SECTION_REORDER_META = {
  summary       : { label: 'Summary',       icon: <Hash size={16} /> },
  experience    : { label: 'Experience',    icon: <Briefcase size={16} /> },
  education     : { label: 'Education',     icon: <GraduationCap size={16} /> },
  skills        : { label: 'Skills',        icon: <Code size={16} /> },
  projects      : { label: 'Projects',      icon: <Lightbulb size={16} /> },
  certifications: { label: 'Certifications',icon: <Award size={16} /> },
  languages     : { label: 'Languages',     icon: <Languages size={16} /> },
  hobbies       : { label: 'Hobbies',       icon: <Heart size={16} /> },
}

export default function SectionReorderUI() {
  const { settings, reorderSections } = useResumeStore()
  const items = settings?.sectionOrder || Object.keys(SECTION_REORDER_META)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id)
      const newIndex = items.indexOf(over.id)
      const newOrder = arrayMove(items, oldIndex, newIndex)
      reorderSections(newOrder)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Section Order</h4>
        <span className="text-[10px] text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-full">Drag to Reorder</span>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map(id => (
              <SortableItem key={id} id={id} meta={SECTION_REORDER_META[id]} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

function SortableItem({ id, meta }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  }

  if (!meta) return null

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={clsx(
        "group flex items-center gap-3 p-3 bg-white border rounded-xl transition-all",
        isDragging ? "shadow-2xl border-brand-300 ring-4 ring-brand-50 cursor-grabbing" : "border-gray-100 hover:border-gray-200 cursor-default"
      )}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="text-gray-300 group-hover:text-gray-500 cursor-grab active:cursor-grabbing p-1 -ml-1 transition-colors"
      >
        <GripVertical size={16} />
      </div>
      <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", isDragging ? "bg-brand-600 text-white" : "bg-gray-50 text-gray-500 group-hover:bg-gray-100 group-hover:text-brand-600")}>
        {meta.icon}
      </div>
      <span className={clsx("text-sm font-bold flex-1 transition-colors", isDragging ? "text-brand-700" : "text-gray-700 group-hover:text-gray-900")}>
        {meta.label}
      </span>
      {!isDragging && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="w-1 h-1 bg-gray-200 rounded-full" />
        </div>
      )}
    </div>
  )
}
