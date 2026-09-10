"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

type NewUserForm = { name: string; email: string; password: string; role: "admin" | "editor" };
type EditUserForm = { name: string; email: string; password: string; role: "admin" | "editor" };

const inputCls = "w-full border border-[#e0d9cc] px-3 py-2 text-sm focus:outline-none focus:border-[#b5964e] transition-colors";
const labelCls = "block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1";

export default function AdminUsersClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [newForm, setNewForm] = useState<NewUserForm>({ name: "", email: "", password: "", role: "admin" });
  const [editForm, setEditForm] = useState<EditUserForm>({ name: "", email: "", password: "", role: "admin" });

  function setNew(field: keyof NewUserForm, value: string) {
    setNewForm((f) => ({ ...f, [field]: value }));
  }
  function setEdit(field: keyof EditUserForm, value: string) {
    setEditForm((f) => ({ ...f, [field]: value }));
  }

  function startEdit(u: AdminUser) {
    setEditing(u.id);
    setEditForm({ name: u.name, email: u.email, password: "", role: u.role as "admin" | "editor" });
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newForm),
    });
    setSaving(false);
    if (res.ok) {
      const user = await res.json();
      toast.success("User created");
      setUsers((prev) => [...prev, user]);
      setShowNew(false);
      setNewForm({ name: "", email: "", password: "", role: "admin" });
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to create user");
    }
  }

  async function updateUser(e: React.FormEvent, id: number) {
    e.preventDefault();
    setSaving(true);
    const payload: Partial<EditUserForm> = { name: editForm.name, email: editForm.email, role: editForm.role };
    if (editForm.password) payload.password = editForm.password;
    const res = await fetch(`/api/admin-users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      const user = await res.json();
      toast.success("User updated");
      setUsers((prev) => prev.map((u) => (u.id === id ? user : u)));
      setEditing(null);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to update user");
    }
  }

  async function deleteUser(id: number, name: string) {
    if (!confirm(`Delete user "${name}"?`)) return;
    const res = await fetch(`/api/admin-users/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to delete user");
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* User list */}
      <div className="bg-white border border-[#e0d9cc] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f5f0e8] border-b border-[#e0d9cc]">
            <tr>
              <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Name</th>
              <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Email</th>
              <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Role</th>
              <th className="px-5 py-3 text-right text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0d9cc]">
            {users.map((u) => (
              <>
                <tr key={u.id} className="hover:bg-[#faf8f5]">
                  <td className="px-5 py-4 font-medium text-[#1a1a1a]">{u.name}</td>
                  <td className="px-5 py-4 text-[#6b6b6b]">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 ${u.role === "admin" ? "bg-[#1a1a1a] text-white" : "bg-[#f5f0e8] text-[#6b6b6b]"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(u)} className="p-1.5 text-[#6b6b6b] hover:text-[#b5964e] transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => deleteUser(u.id, u.name)} className="p-1.5 text-[#6b6b6b] hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>

                {/* Inline edit row */}
                {editing === u.id && (
                  <tr key={`edit-${u.id}`} className="bg-[#fdf9f3]">
                    <td colSpan={4} className="px-5 py-5">
                      <form onSubmit={(e) => updateUser(e, u.id)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className={labelCls}>Name</label><input value={editForm.name} onChange={(e) => setEdit("name", e.target.value)} required className={inputCls} /></div>
                          <div><label className={labelCls}>Email</label><input type="email" value={editForm.email} onChange={(e) => setEdit("email", e.target.value)} required className={inputCls} /></div>
                          <div><label className={labelCls}>New Password <span className="normal-case text-[#b0a898]">(leave blank to keep)</span></label><input type="password" value={editForm.password} onChange={(e) => setEdit("password", e.target.value)} className={inputCls} placeholder="••••••••" /></div>
                          <div><label className={labelCls}>Role</label>
                            <select value={editForm.role} onChange={(e) => setEdit("role", e.target.value)} className={inputCls}>
                              <option value="admin">Admin</option>
                              <option value="editor">Editor</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button type="submit" disabled={saving} className="flex items-center gap-1.5 bg-[#1a1a1a] text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60"><Check size={12} />{saving ? "Saving…" : "Save"}</button>
                          <button type="button" onClick={() => setEditing(null)} className="flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest border border-[#e0d9cc] text-[#6b6b6b] hover:border-[#1a1a1a]"><X size={12} />Cancel</button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add new user */}
      {!showNew ? (
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 border border-dashed border-[#b5964e] text-[#b5964e] px-5 py-3 text-xs uppercase tracking-widest hover:bg-[#b5964e] hover:text-white transition-colors"
        >
          <Plus size={13} /> Add Admin User
        </button>
      ) : (
        <div className="bg-white border border-[#e0d9cc] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#1a1a1a]">New Admin User</h3>
            <button onClick={() => setShowNew(false)} className="text-[#6b6b6b] hover:text-[#1a1a1a]"><X size={16} /></button>
          </div>
          <form onSubmit={createUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Name *</label><input value={newForm.name} onChange={(e) => setNew("name", e.target.value)} required className={inputCls} /></div>
              <div><label className={labelCls}>Email *</label><input type="email" value={newForm.email} onChange={(e) => setNew("email", e.target.value)} required className={inputCls} /></div>
              <div><label className={labelCls}>Password * <span className="normal-case text-[#b0a898]">(min 8 chars)</span></label><input type="password" value={newForm.password} onChange={(e) => setNew("password", e.target.value)} required minLength={8} className={inputCls} /></div>
              <div><label className={labelCls}>Role</label>
                <select value={newForm.role} onChange={(e) => setNew("role", e.target.value)} className={inputCls}>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-[#1a1a1a] text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60">{saving ? "Creating…" : "Create User"}</button>
              <button type="button" onClick={() => setShowNew(false)} className="px-6 py-2 text-xs uppercase tracking-widest border border-[#e0d9cc] text-[#6b6b6b] hover:border-[#1a1a1a]">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
