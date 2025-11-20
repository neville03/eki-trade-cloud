import { useState } from "react";
import Button from "../components/Button";

type ProductFormProps = {
  open: boolean;
  onClose: () => void;
  onSave: (product: {
    name: string;
    description: string;
    price: number;
    stock?: number;
    imageUrl: string;
  }) => void;
};

const ProductForm = ({ open, onClose, onSave }: ProductFormProps) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg space-y-4">
        <h2 className="text-lg font-bold">Add Product</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave({
              ...form,
              price: parseFloat(form.price),
              stock: form.stock ? parseInt(form.stock, 10) : undefined,
              imageUrl: form.imageUrl
            });
            onClose();
          }}
          className="space-y-3"
        >
          <input
            className="border rounded w-full p-2"
            placeholder="Product Name"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="border rounded w-full p-2"
            placeholder="Brief Description"
            required
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="border rounded w-full p-2"
            placeholder="Price"
            required
            type="number"
            min={0}
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="border rounded w-full p-2"
            placeholder="Available Stock"
            type="number"
            min={0}
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
          />
          <input
            className="border rounded w-full p-2"
            placeholder="Image URL (or use upload)"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
          />
          {/* Optional: Add a file input for image uploads */}
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
