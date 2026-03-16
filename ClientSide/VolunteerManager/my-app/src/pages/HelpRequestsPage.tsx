// panels/HelpRequestsPanel.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  fetchHelpRequests,
  addRequestAsync,
  updateRequestAsync,
  deleteRequestAsync,
  updateStatusAsync,
} from "../redux/slices/helpRequestsSlice";
import { fetchCategories } from "../redux/slices/categoriesSlice";

import type { HelpRequestType, HelpRequestStatus } from "../redux/slices/helpRequestsSlice";
import type { CategoryType } from "../redux/slices/categoriesSlice";

import { ConfirmDelete } from "./shared/Modal";
import "../styles/styleAdminCatalog.css";

const STATUS_LIST: HelpRequestStatus[] = ["Pending", "Matched", "InProgress", "Completed", "Cancelled"];

const statusMeta: Record<HelpRequestStatus, { label: string; cls: string }> = {
  Pending: { label: "Pending", cls: "s-pending" },
  Matched: { label: "Matched", cls: "s-matched" },
  InProgress: { label: "In Progress", cls: "s-progress" },
  Completed: { label: "Completed", cls: "s-completed" },
  Cancelled: { label: "Cancelled", cls: "s-cancelled" },
};

const emptyForm = (): Omit<HelpRequestType, "id"> => ({
  needyID: 0,
  categoryID: 1,
  description: "",
  status: "Pending",
  createdAt: new Date().toISOString().slice(0, 10),
  latitude: 0,
  longitude: 0,
});

function RequestForm({
  form,
  categories,
  onChange,
}: {
  form: Omit<HelpRequestType, "id">;
  categories: CategoryType[];
  onChange: (f: typeof form) => void;
}) {
  return (
    <div className="form-fields">

      <div className="form-row-2">

        <div>
          <label className="field-label">Needy ID *</label>
          <input
            className="field-input"
            type="number"
            value={form.needyID || ""}
            onChange={(e) => onChange({ ...form, needyID: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="field-label">Category *</label>
          <select
            className="field-select"
            value={form.categoryID}
            onChange={(e) => onChange({ ...form, categoryID: Number(e.target.value) })}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      <label className="field-label">Description *</label>
      <textarea
        className="field-textarea"
        rows={4}
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
      />

    </div>
  );
}

export default function HelpRequestsPanel() {

  const dispatch = useDispatch<AppDispatch>();

  const items = useSelector((state: RootState) => state.helpRequests.items);
  const status = useSelector((state: RootState) => state.helpRequests.status);

  const categories = useSelector((state: RootState) => state.categories.items);

  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [selected, setSelected] = useState<HelpRequestType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HelpRequestType | null>(null);

  const [form, setForm] = useState(emptyForm());

  useEffect(() => {

    if (status === "idle") {
      dispatch(fetchHelpRequests());
    }

    if (categories.length === 0) {
      dispatch(fetchCategories());
    }

  }, [status, categories.length, dispatch]);

  function getCategory(id: number) {
    return categories.find((c) => c.id === id);
  }

  function goList() {
    setView("list");
    setSelected(null);
  }

  function goAdd() {
    setForm(emptyForm());
    setView("add");
  }

  function goEdit(r: HelpRequestType) {
    setSelected(r);
    setForm({ ...r });
    setView("edit");
  }

  function saveAdd() {
    if (!form.description.trim()) return;
    dispatch(addRequestAsync(form));
    goList();
  }

  function saveEdit() {
    if (!selected) return;
    dispatch(updateRequestAsync({ id: selected.id, ...form }));
    goList();
  }

  function doDelete(r: HelpRequestType) {
    dispatch(deleteRequestAsync(r.id));
    setDeleteTarget(null);
  }

  function quickChangeStatus(id: number, status: HelpRequestStatus) {
    dispatch(updateStatusAsync({ id, status }));
  }

  if (view === "list") {
    return (
      <>
        <div className="top-bar">
          <h1 className="page-title">Help Requests</h1>
          <button className="btn-add" onClick={goAdd}>Add Request</button>
        </div>

        <div className="section">

          <table className="req-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Needy</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {items.map((r) => {

                const cat = getCategory(r.categoryID);

                return (
                  <tr key={r.id}>

                    <td>#{r.id}</td>

                    <td>#{r.needyID}</td>

                    <td>
                      {cat?.icon} {cat?.name}
                    </td>

                    <td>{r.description}</td>

                    <td>
                      <select
                        value={r.status}
                        onChange={(e) =>
                          quickChangeStatus(r.id, e.target.value as HelpRequestStatus)
                        }
                      >
                        {STATUS_LIST.map((s) => (
                          <option key={s} value={s}>
                            {statusMeta[s].label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button onClick={() => goEdit(r)}>✏️</button>
                      <button onClick={() => setDeleteTarget(r)}>🗑️</button>
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {deleteTarget && (
          <ConfirmDelete
            label={`Request #${deleteTarget.id}`}
            onConfirm={() => doDelete(deleteTarget)}
            onCancel={() => setDeleteTarget(null)}
          />
        )}

      </>
    );
  }

  if (view === "add") {
    return (
      <div className="section">
        <h2>Add Request</h2>
        <RequestForm form={form} categories={categories} onChange={setForm} />
        <button onClick={saveAdd}>Save</button>
        <button onClick={goList}>Cancel</button>
      </div>
    );
  }

  if (view === "edit" && selected) {
    return (
      <div className="section">
        <h2>Edit Request #{selected.id}</h2>
        <RequestForm form={form} categories={categories} onChange={setForm} />
        <button onClick={saveEdit}>Save</button>
        <button onClick={goList}>Cancel</button>
      </div>
    );
  }

  return null;
}
