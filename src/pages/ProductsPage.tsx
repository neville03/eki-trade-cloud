import { useState, useEffect } from "react";
import Button from "../components/Button";
import { toast } from "react-toastify";

type Product = {
  id: string;
  name: string;
  price: number;
  stock?: number;
  is_featured?: boolean;
  image_url?: string;
  description?: string;
  category?: string;
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load products from localStorage on first render
  useEffect(() => {
    const stored = window.localStorage.getItem("products");
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    window.localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = { ...product, id: Date.now().toString() };
    setProducts([newProduct, ...products]);
    toast.success("Successfully added product!");
    setShowAddModal(false);
  };

  const handleEdit = (prod: Product) => {};
  const handleDelete = (id: string) =>
    setProducts(products.filter((p) => p.id !== id));

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={() => setShowAddModal(true)}>+ Add Product</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-gray-500 text-center">
            No products yet.
          </div>
        ) : (
          products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded shadow p-6 flex flex-col justify-between"
              style={{ minHeight: 380 }}
            >
              <div>
                <div className="font-semibold text-lg leading-tight truncate">
                  {prod.name}
                </div>
                <div className="text-gray-400 text-sm mb-1">
                  {prod.category ?? "Uncategorized"}
                </div>
                {prod.image_url && (
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="my-4 object-cover"
                    style={{
                      width: "100%",
                      height: 180,
                      borderRadius: 10,
                      background: "#f8f8f8",
                    }}
                  />
                )}
                <div className="text-gray-500 text-sm truncate mb-2">
                  {prod.description}
                </div>
                <div className="text-2xl font-bold mb-3">
                  UGX {prod.price.toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => handleEdit(prod)}>
                  <span className="mr-1"></span> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(prod.id)}>
                  <span className="mr-1"></span> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      <ProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddProduct}
      />
    </section>
  );
};

// --- ProductModal is defined below, in the same file! ---
type ProductModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id">) => void;
};

const ProductModal = ({ open, onClose, onSave }: ProductModalProps) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    category: "",
  });

  const handleClose = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      image_url: "",
      category: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg space-y-4">
        <h2 className="text-lg font-bold">Add Product</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave({
              name: form.name,
              description: form.description,
              price: parseFloat(form.price),
              stock: form.stock ? parseInt(form.stock, 10) : undefined,
              image_url: form.image_url,
              category: form.category,
              is_featured: false,
            });
            handleClose();
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
            placeholder="Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
          <input
            className="border rounded w-full p-2"
            placeholder="Image URL (or upload below)"
            value={form.image_url}
            onChange={e => setForm({ ...form, image_url: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" onClick={handleClose} type="button">
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

export default ProductsPage;
