"use client";

import React, { useState } from 'react';
import { Map, Brain, Layers, GitFork, BookOpen, Compass, ArrowRight } from 'lucide-react';

interface KnowledgeNode {
  id: string;
  category: 'Quy luật' | 'Phạm trù' | 'Trường phái' | 'Ý nghĩa';
  title: string;
  chapter: string;
  pageRange: string;
  description: string;
  connections: string[];
}

const KNOWLEDGE_NODES: KnowledgeNode[] = [
  {
    id: 'node-1',
    category: 'Trường phái',
    title: 'Chủ nghĩa Duy vật Biện chứng',
    chapter: 'Chương VI',
    pageRange: 'Trang 310-355',
    description: 'Sự thống nhất giữa chủ nghĩa duy vật và phép biện chứng do Mác và Ángghen sáng lập.',
    connections: ['node-2', 'node-3', 'node-4']
  },
  {
    id: 'node-2',
    category: 'Quy luật',
    title: 'Quy luật Thống nhất và Đấu tranh của các Mặt Đối lập',
    chapter: 'Chương VI',
    pageRange: 'Trang 325-335',
    description: 'Hạt nhân của phép biện chứng duy vật, chỉ ra nguồn gốc và động lực của sự phát triển.',
    connections: ['node-5']
  },
  {
    id: 'node-3',
    category: 'Phạm trù',
    title: 'Thực tiễn & Lý luận',
    chapter: 'Chương VII',
    pageRange: 'Trang 356-380',
    description: 'Thực tiễn là cơ sở, động lực, mục đích của nhận thức và là tiêu chuẩn kiểm tra chân lý.',
    connections: ['node-5']
  },
  {
    id: 'node-4',
    category: 'Quy luật',
    title: 'Hình thái Kinh tế - Xã hội',
    chapter: 'Chương VIII',
    pageRange: 'Trang 381-425',
    description: 'Sự phát triển của các hình thái kinh tế - xã hội là một quá trình lịch sử - tự nhiên.',
    connections: ['node-6']
  },
  {
    id: 'node-5',
    category: 'Ý nghĩa',
    title: 'Nguyên tắc Thống nhất Lý luận và Thực tiễn',
    chapter: 'Chương VII',
    pageRange: 'Trang 370-380',
    description: 'Ý nghĩa phương pháp luận cốt lõi cho tư duy chỉ đạo và hành động thực tiễn.',
    connections: []
  },
  {
    id: 'node-6',
    category: 'Ý nghĩa',
    title: 'Xây dựng Nhà nước Pháp quyền XHCN Việt Nam',
    chapter: 'Chương X',
    pageRange: 'Trang 480-510',
    description: 'Vận dụng sáng tạo lý luận nhà nước Mác - Lênin vào điều kiện hiện nay tại Việt Nam.',
    connections: []
  }
];

export const KnowledgeMapView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode>(KNOWLEDGE_NODES[0]);

  const categoryColors = {
    'Quy luật': 'bg-amber-100 text-amber-950 border-amber-300 font-extrabold',
    'Phạm trù': 'bg-blue-100 text-blue-950 border-blue-300 font-extrabold',
    'Trường phái': 'bg-indigo-100 text-indigo-950 border-indigo-300 font-extrabold',
    'Ý nghĩa': 'bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="card-3d p-6 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white shadow-lg border border-blue-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl shadow-md border border-amber-500/30">
            🗺️
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Sơ Đồ Tri Thức Triết Học Mác - Lênin</h2>
            <p className="text-xs text-blue-100 font-semibold">
              Trực quan hóa mối liên hệ logic giữa Quy luật, Phạm trù và Ý nghĩa phương pháp luận (Nguồn A, Trang 7-556)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Selection List */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider px-1">
            Các Nút Kiến Thức Trọng Tâm
          </h3>
          {KNOWLEDGE_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-700/20'
                    : 'bg-white hover:bg-blue-50 text-slate-900 border-slate-300/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryColors[node.category]}`}>
                    {node.category}
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>{node.chapter}</span>
                </div>
                <h4 className="text-xs font-extrabold leading-snug">{node.title}</h4>
                <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-blue-100 font-medium' : 'text-slate-700 font-medium'}`}>{node.description}</p>
              </div>
            );
          })}
        </div>

        {/* Interactive Visual Graph & Node Detail */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-3d p-6 bg-slate-950 text-white relative min-h-[300px] flex flex-col justify-between border-2 border-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black text-amber-300 flex items-center space-x-1.5">
                <GitFork className="w-4 h-4 text-amber-400" />
                <span>Mối liên hệ logic với các nút khác</span>
              </span>
              <span className="text-xs text-slate-300 font-mono font-bold">{selectedNode.pageRange}</span>
            </div>

            <div className="py-8 space-y-4">
              <div className="p-4 bg-blue-900/60 border-2 border-blue-400/60 rounded-2xl text-center font-black text-lg text-white shadow-md">
                {selectedNode.title}
              </div>

              {selectedNode.connections.length > 0 && (
                <div className="flex items-center justify-center space-x-2 text-slate-300 text-xs font-black">
                  <span>Dẫn đến / Quy định</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedNode.connections.map(targetId => {
                  const target = KNOWLEDGE_NODES.find(n => n.id === targetId);
                  if (!target) return null;
                  return (
                    <div key={target.id} className="p-3 bg-slate-900 border border-amber-400/50 rounded-xl text-xs font-bold text-amber-300 shadow-xs">
                      → {target.title} ({target.category})
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-slate-300 font-medium pt-3 border-t border-slate-800">
              Nhấn vào từng nút kiến thức ở bên trái để khám phá mối liên hệ biện chứng.
            </div>
          </div>

          <div className="card-3d p-6 space-y-3 border border-slate-200">
            <h3 className="text-base font-black text-blue-950">Chi tiết nút: {selectedNode.title}</h3>
            <p className="text-sm text-slate-800 font-medium leading-relaxed">{selectedNode.description}</p>
            <div className="pt-2 text-xs text-slate-700 font-bold">
              Vị trí tài liệu: {selectedNode.chapter} • {selectedNode.pageRange} (Giáo trình Nguồn A)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
