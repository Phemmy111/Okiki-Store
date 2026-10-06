"use client";
import { useState, useTransition } from "react";
import { addAdmin, removeAdmin, updateRole } from "./actions";

type Admin = {
  id: number;
  email: string;
  role: string;
  createdBy: string | null;
  createdAt: Date;
};

export default function AdminsClient({
  admins,
  currentEmail,
}: {
  admins: Admin[];
  currentEmail: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function flash(msg: string, type: "success" | "error") {
    if (type === "success") { setSuccess(msg); setError(null); }
    else { setError(msg); setSuccess(null); }
    setTimeout(() => { setSuccess(null); setError(null); }, 4000);
  }

  async function handleAdd(formData: FormData) {
    startTransition(async () => {
      const res = await addAdmin(formData);
      if (res?.error) flash(res.error, "error");
      else flash("Admin added successfully.", "success");
    });
  }

  async function handleRemove(id: number, email: string) {
    if (!confirm(`Remove ${email} from admin access?`)) return;
    startTransition(async () => {
      const res = await removeAdmin(id);
      if (res?.error) flash(res.error, "error");
      else flash("Admin removed.", "success");
    });
  }

  async function handleRoleChange(id: number, role: "super_admin" | "admin") {
    startTransition(async () => {
      const res = await updateRole(id, role);
      if (res?.error) flash(res.error, "error");
      else flash("Role updated.", "success");
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Feedback */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          {success}
        </div>
      )}

      {/* Add Admin Form */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-navy mb-4">Add New Admin</h2>
        <form action={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          <select
            name="role"
            className="border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 bg-white"
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <button
            type="submit"
            disabled={isPending}
            className="bg-navy text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-navy/80 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isPending ? "Adding…" : "Add Admin"}
          </button>
        </form>
        <p className="text-xs text-text-muted mt-2">
          <strong>Admin</strong> — can access the dashboard but cannot manage other admins. &nbsp;
          <strong>Super Admin</strong> — full access including this page.
        </p>
      </div>

      {/* Admin List */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-navy">Current Admins ({admins.length})</h2>
        </div>
        <ul className="divide-y divide-border">
          {admins.map((admin) => {
            const isMe = admin.email.toLowerCase() === currentEmail.toLowerCase();
            return (
              <li key={admin.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-navy text-sm">{admin.email}</span>
                    {isMe && (
                      <span className="text-[10px] bg-gold/20 text-gold font-bold px-2 py-0.5 rounded-full">YOU</span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Added {new Date(admin.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    {admin.createdBy ? ` by ${admin.createdBy}` : ""}
                  </p>
                </div>

                {/* Role selector */}
                <select
                  value={admin.role}
                  disabled={isMe || isPending}
                  onChange={(e) => handleRoleChange(admin.id, e.target.value as "super_admin" | "admin")}
                  className="border border-border rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:opacity-50"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(admin.id, admin.email)}
                  disabled={isMe || isPending}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
