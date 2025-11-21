import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Button from "../components/Button";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  image_url?: string | null;
  description?: string | null;
  category?: string | null;
  vendor_id: string;
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
    setLoading(false);
  };

  const handleAddProduct = async (product: Omit<Product, "id" | "vendor_id">) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      const { error } = await supabase.from("products").insert({
        ...product,
        vendor_id: user.id,
      });

      if (error) throw error;
      toast.success("Product added successfully!");
      setShowAddModal(false);
      loadProducts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to add product");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: !product.is_active })
        .eq("id", product.id);

      if (error) throw error;
      toast.success(product.is_active ? "Product unpublished" : "Product published!");
      loadProducts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted");
      loadProducts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={() => setShowAddModal(true)}>+ Add Product</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-gray-500 text-center py-12">
            No products yet. Click "Add Product" to get started!
          </div>
        ) : (
          products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded shadow p-6 flex flex-col justify-between"
              style={{ minHeight: 380 }}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-lg leading-tight truncate flex-1">
                    {prod.name}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ml-2 ${
                      prod.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {prod.is_active ? "Published" : "Draft"}
                  </span>
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
                <div className="text-2xl font-bold mb-1">
                  UGX {prod.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  Stock: {prod.stock_quantity}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant={prod.is_active ? "outline" : "primary"}
                  onClick={() => handleToggleActive(prod)}
                >
                  {prod.is_active ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(prod.id)}
                >
                  Delete
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

// --- ProductModal ---
type ProductModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (product: {
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url: string;
    category: string;
    is_active: boolean;
  }) => void;
};

const ProductModal = ({ open, onClose, onSave }: ProductModalProps) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    image_url: "",
    category: "",
  });

  const handleClose = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stock_quantity: "",
      image_url: "",
      category: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold">Add Product</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              name: form.name,
              description: form.description,
              price: parseFloat(form.price),
              stock_quantity: parseInt(form.stock_quantity, 10) || 0,
              image_url: form.image_url,
              category: form.category,
              is_active: false, // Start as draft
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
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="border rounded w-full p-2"
            placeholder="Product Description"
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="border rounded w-full p-2"
            placeholder="Category (e.g., Electronics, Fashion)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            className="border rounded w-full p-2"
            placeholder="Price (UGX)"
            required
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="border rounded w-full p-2"
            placeholder="Stock Quantity"
            required
            type="number"
            min={0}
            value={form.stock_quantity}
            onChange={(e) =>
              setForm({ ...form, stock_quantity: e.target.value })
            }
          />
          <input
            className="border rounded w-full p-2"
            placeholder="Image URL"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Save as Draft</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductsPage;
