import { useEffect, useState } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useAuthContext } from '../../auth/useAuthContext';
import axios from '../../services/axios';
import { type CategoryType } from '../../types/categories.types';
import '../../styles/styleCategories.css';

/* ── emoji map by name ── */




export const CategoriesPage = () => {
  useDocumentTitle('Categories');
  const { user, setUser } = useAuthContext();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selected, setSelected] = useState<number[]>(
    user?.categories?.map(c => c.id) ?? []
  );
  const [loading,    setLoading]     = useState(true);

  useEffect(() => {
    axios.get('/Categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to load categories:', err))
      .finally(() => setLoading(false));
  }, []);
const toggle = async (id: number) => {
  const isSelected = selected.includes(id);
  const next = isSelected
    ? selected.filter(s => s !== id)
    : [...selected, id];

  setSelected(next);

  try {
    if (isSelected) {
      // הסרה
      await axios.delete(`/Users/${user!.id}/category/${id}`);
    } else {
      // הוספה
      await axios.post(`/Users/${user!.id}/category/${id}`);
    }
  } catch (err) {
    setSelected(selected); // מחזיר למצב הקודם במקרה של שגיאה
    console.error('Failed to update categories:', err);
  }
};
  return (
    <div className="cat-root">

      {/* ── Stats Bar ── */}
      <div className="cat-bar">
        <div className="cat-bar-stats">
          <div className="cat-bar-stat">
            <span className="cat-bar-n">{selected.length}</span>
            <span className="cat-bar-l">Selected</span>
          </div>
          <div className="cat-bar-stat">
            <span className="cat-bar-n">{categories.length}</span>
            <span className="cat-bar-l">Available</span>
          </div>
          <div className="cat-bar-stat">
            <span className="cat-bar-n cat-bar-up">↑{selected.length * 3}</span>
            <span className="cat-bar-l">Better Match Rate</span>
          </div>
        </div>
        <p className="cat-bar-tip">
          The more categories you select, the easier<br />
          it is for us to find the right match for you 🤝
        </p>
      </div>

      {/* ── Section label ── */}
      <div className="cat-section-label">CATEGORIES SET BY YOUR ORGANIZATION</div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="cat-loading">Loading categories...</div>
      ) : (
        <div className="cat-grid">
          {categories.map(cat => {
            const isOn = selected.includes(cat.id);
            return (
              <div
                key={cat.id}
                className={`cat-card ${isOn ? 'cat-card-on' : ''}`}
                onClick={() => toggle(cat.id)}
              >
                <div className="cat-card-top">
                  <div className={`cat-card-check ${isOn ? 'cat-card-check-on' : ''}`}>
                    {isOn && '✓'}
                  </div>
                </div>
                <div className="cat-card-name">{cat.name}</div>
                <div className="cat-card-desc">{cat.description}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Current Selection ── */}
      {selected.length > 0 && (
        <>
          <div className="cat-section-label" style={{ marginTop: 40 }}>YOUR CURRENT SELECTION</div>
          <div className="cat-selection">
            {selected.map(id => {
              const cat = categories.find(c => c.id === id);// מצא את פרטי הקטגוריה לפי ה-id שלה
              if (!cat) return null;
              return (
                <div key={id} className="cat-sel-chip">
                  <button className="cat-sel-remove" onClick={() => toggle(id)}>×</button>
                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
};