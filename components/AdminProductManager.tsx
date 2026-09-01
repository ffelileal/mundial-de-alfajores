"use client";

import { useState } from "react";
import { addProduct, updateProduct, deleteProduct } from "@/actions/product";
import { loadPresetData } from "@/actions/competition";
import { Plus, Edit2, Trash2, Check, Sparkles, Image as ImageIcon } from "lucide-react";

interface AdminProductManagerProps {
  competitionId: string;
  products: any[];
}

export function AdminProductManager({
  competitionId,
  products,
}: AdminProductManagerProps) {
  // Form State
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [flavor, setFlavor] = useState("");
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoadingPreset, setIsLoadingPreset] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editFlavor, setEditFlavor] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim() || !flavor.trim()) return;

    setIsAdding(true);
    try {
      await addProduct({
        competitionId,
        name: name.trim(),
        brand: brand.trim(),
        flavor: flavor.trim(),
        image: image.trim() || undefined,
        description: desc.trim() || undefined,
      });
      setName("");
      setBrand("");
      setFlavor("");
      setImage("");
      setDesc("");
    } finally {
      setIsAdding(false);
    }
  };

  const handleStartEdit = (p: any) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditBrand(p.brand);
    setEditFlavor(p.flavor);
    setEditImage(p.image || "");
    setEditDesc(p.description || "");
  };

  const handleSaveEdit = async (id: string) => {
    await updateProduct(id, {
      name: editName,
      brand: editBrand,
      flavor: editFlavor,
      image: editImage || undefined,
      description: editDesc || undefined,
    });
    setEditingId(null);
  };

  const handleDelete = async (id: string, pName: string) => {
    if (confirm(`¿Eliminar el alfajor "${pName}"?`)) {
      await deleteProduct(id);
    }
  };

  const handleLoadPresets = async () => {
    setIsLoadingPreset(true);
    try {
      await loadPresetData(competitionId);
    } finally {
      setIsLoadingPreset(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick Starter Preset Bar */}
      <div className="bg-amber-50 rounded-3xl p-4 sm:p-5 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center text-xl shrink-0">
            ⚡
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-amber-950 leading-snug">
              Carga Rápida de Clásicos
            </h3>
            <p className="text-[11px] sm:text-xs text-amber-800">
              8 alfajores icónicos (Havanna, Cachafaz, Capitán, Guaymallén...) listos en 1 click.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLoadPresets}
          disabled={isLoadingPreset}
          className="w-full sm:w-auto bg-[#54311c] hover:bg-[#3d2112] text-white text-xs font-black px-4 py-3 rounded-xl transition-all shadow cursor-pointer disabled:opacity-50 text-center active:scale-95 touch-manipulation"
        >
          {isLoadingPreset ? "Cargando..." : "📥 Cargar 8 Clásicos"}
        </button>
      </div>

      {/* 2. Add New Product Form */}
      <form
        onSubmit={handleAdd}
        className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e6dacd] shadow-sm space-y-4"
      >
        <h3 className="text-xs font-black text-[#54311c] uppercase tracking-wider">
          + Agregar Nuevo Alfajor
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#786556] block">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Havanna 70%"
              className="w-full bg-[#fbf9f6] border border-[#e6dacd] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#786556] block">Marca</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Ej: Havanna"
              className="w-full bg-[#fbf9f6] border border-[#e6dacd] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#786556] block">Variedad / Sabor</label>
            <input
              type="text"
              value={flavor}
              onChange={(e) => setFlavor(e.target.value)}
              placeholder="Ej: Chocolate 70% cacao"
              className="w-full bg-[#fbf9f6] border border-[#e6dacd] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#786556] block">Descripción (Opcional)</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Detalles sobre el relleno, masa, etc."
              className="w-full bg-[#fbf9f6] border border-[#e6dacd] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#786556] block">URL de Foto (Opcional)</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://ejemplo.com/alfajor.jpg"
              className="w-full bg-[#fbf9f6] border border-[#e6dacd] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isAdding || !name.trim() || !brand.trim() || !flavor.trim()}
          className="w-full bg-[#54311c] hover:bg-[#3d2112] text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-md transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
        >
          <Plus className="w-4 h-4" />
          <span>Guardar Alfajor</span>
        </button>
      </form>

      {/* 3. Product List */}
      <div className="space-y-2.5">
        {products.map((p) => {
          const isEditing = editingId === p.id;
          const evalCount = p.evaluations?.length || 0;

          if (isEditing) {
            return (
              <div
                key={p.id}
                className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nombre"
                    className="bg-white border rounded-xl px-3 py-2 text-xs font-medium"
                  />
                  <input
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    placeholder="Marca"
                    className="bg-white border rounded-xl px-3 py-2 text-xs font-medium"
                  />
                  <input
                    type="text"
                    value={editFlavor}
                    onChange={(e) => setEditFlavor(e.target.value)}
                    placeholder="Variedad"
                    className="bg-white border rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Descripción"
                    className="bg-white border rounded-xl px-3 py-2 text-xs font-medium"
                  />
                  <input
                    type="url"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="URL de foto"
                    className="bg-white border rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-3 py-2 text-xs text-stone-600 bg-stone-200 rounded-xl font-bold active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(p.id)}
                    className="px-4 py-2 text-xs text-white bg-emerald-600 rounded-xl font-bold flex items-center gap-1 active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={p.id}
              className="bg-white border border-[#e6dacd] rounded-3xl p-4 sm:p-5 flex items-center justify-between group hover:border-[#54311c] transition-all shadow-xs"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-black text-amber-800">#{p.orderNumber}</span>
                  <span className="text-sm -mt-0.5">🍫</span>
                </div>

                <div className="overflow-hidden">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-sm sm:text-base text-[#2c1810] truncate">
                      {p.name}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#efe6dc] text-[#54311c]">
                      {p.brand}
                    </span>
                  </div>
                  <p className="text-xs text-[#786556] truncate mt-0.5">
                    {p.flavor} {p.description && `• ${p.description}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => handleStartEdit(p)}
                  className="text-stone-400 hover:text-stone-700 p-2.5 rounded-xl hover:bg-stone-100 transition-colors touch-manipulation active:scale-90"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
                  className="text-stone-400 hover:text-red-600 p-2.5 rounded-xl hover:bg-red-50 transition-colors touch-manipulation active:scale-90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-[#e6dacd] text-center space-y-2">
            <div className="text-3xl">🍫</div>
            <h3 className="font-black text-sm text-[#2c1810]">No hay alfajores cargados</h3>
            <p className="text-xs text-[#786556]">
              Agregá alfajores manualmente o utilizá el botón de Carga Rápida de Clásicos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
