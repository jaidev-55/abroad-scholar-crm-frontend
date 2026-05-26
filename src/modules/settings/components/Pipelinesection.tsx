import { Switch, Tag } from "antd";
import {
  RiAddLine,
  RiDraggable,
  RiDeleteBinLine,
  RiEdit2Line,
  RiSaveLine,
} from "react-icons/ri";
import type {
  PipelineStage,
  LeadCategory,
  LeadQualityOption,
  CountryOption,
} from "../types";

interface Props {
  stages: PipelineStage[];
  categories: LeadCategory[];
  qualities: LeadQualityOption[];
  countries: CountryOption[];
}

const ConfigCard = ({
  title,
  description,
  children,
  onAdd,
  addLabel,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
        >
          <RiAddLine size={13} />
          {addLabel || "Add"}
        </button>
      )}
    </div>
    {children}
  </div>
);

const PipelineSection: React.FC<Props> = ({
  stages,
  categories,
  qualities,
  countries,
}) => {
  return (
    <div className="space-y-4">
      {/* Pipeline stages */}
      <ConfigCard
        title="Pipeline Stages"
        description="Drag to reorder, customize colors and names"
        onAdd={() => {}}
        addLabel="Add Stage"
      >
        <div className="space-y-2">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors group"
            >
              <RiDraggable
                size={16}
                className="text-slate-300 cursor-grab shrink-0"
              />
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: stage.color }}
              />
              <span className="text-xs font-semibold text-slate-800 flex-1">
                {stage.name}
              </span>
              <span className="text-[10px] text-slate-400">
                Order: {stage.order}
              </span>
              {stage.isDefault && (
                <Tag className="bg-slate-100 text-slate-500 border-0 rounded-full text-[9px] font-semibold px-2 py-0">
                  Default
                </Tag>
              )}
              <button className="p-1 hover:bg-slate-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <RiEdit2Line size={13} className="text-slate-400" />
              </button>
              {!stage.isDefault && (
                <button className="p-1 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <RiDeleteBinLine size={13} className="text-red-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      </ConfigCard>

      {/* Categories */}
      <ConfigCard
        title="Lead Categories"
        description="Categories for classifying leads"
        onAdd={() => {}}
        addLabel="Add Category"
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 px-3 py-2 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors group cursor-default"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs font-medium text-slate-700">
                {cat.name}
              </span>
              <button className="p-0.5 hover:bg-slate-100 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <RiEdit2Line size={11} className="text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      </ConfigCard>

      {/* Lead qualities */}
      <ConfigCard
        title="Lead Quality Levels"
        description="Hot, Warm, Cold or add custom levels"
      >
        <div className="flex flex-wrap gap-2">
          {qualities.map((q) => (
            <div
              key={q.id}
              className="flex items-center gap-2 px-3 py-2 border border-slate-100 rounded-xl"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: q.color }}
              />
              <span className="text-xs font-medium text-slate-700">
                {q.name}
              </span>
            </div>
          ))}
        </div>
      </ConfigCard>

      {/* Countries */}
      <ConfigCard
        title="Target Countries"
        description="Countries available in lead forms"
        onAdd={() => {}}
        addLabel="Add Country"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {countries.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between px-3 py-2.5 border border-slate-100 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 w-6">
                  {c.code}
                </span>
                <span className="text-xs text-slate-700">{c.name}</span>
              </div>
              <Switch size="small" checked={c.isActive} />
            </div>
          ))}
        </div>
      </ConfigCard>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer shadow-sm">
          <RiSaveLine size={14} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PipelineSection;
