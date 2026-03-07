import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { setSession } from '../auth/auth.utils';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { register as registerService } from '../services/auth.service';
import { type RegisterType } from '../types/auth.types';
import { Paths } from '../routes/paths';
import { useAuthContext } from '../auth/useAuthContext';
import { UserRole } from '../types/enums.types';

import '../styles/styleRegister.css';

/* ── Validation helpers ── */
type Errors = Partial<Record<
  'fullName' | 'email' | 'password' | 'phone' | 'adress' | 'server',
  string
>>;

const validate = (data: RegisterType): Errors => {
  const errs: Errors = {};
  if (!data.fullName.trim() || data.fullName.trim().split(' ').length < 2)
    errs.fullName = 'Please enter your first and last name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errs.email = 'Please enter a valid email address';
  if (data.password.length < 8)
    errs.password = 'Password must be at least 8 characters';
  else if (!/[a-zA-Z]/.test(data.password) || !/[0-9]/.test(data.password))
    errs.password = 'Password must contain both letters and numbers';
  if (data.phone && !/^0[0-9]{9}$/.test(data.phone.replace(/-/g, '')))
    errs.phone = 'Please enter a valid phone number';
  if (data.adress && data.adress.trim().length < 3)
    errs.adress = 'Please enter a valid address';
  return errs;
};

export const RegisterPage = () => {
  useDocumentTitle('Register');
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  const [errors, setErrors]   = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Errors, boolean>>>({});
  const [loading, setLoading] = useState(false);

  const markTouched = (name: keyof Errors) =>
    setTouched(prev => ({ ...prev, [name]: true }));

  const register = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: RegisterType = {
      fullName:       formData.get('fullName') as string,
      email:          formData.get('email')    as string,
      password:       formData.get('password') as string,
      phone:          formData.get('phone')    as string,
      adress:         formData.get('adress')   as string,
      userRole:       Number(formData.get('role')),
      categoryIds:    [],
      availabilities: [],
    };

    const errs = validate(data);
    setTouched({ fullName: true, email: true, password: true, phone: true, adress: true });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setLoading(true);
      const response = await registerService({ ...data, userRole: data.userRole });
      const user = response.user;
      setUser(user);
      setSession(response.token);
      if (user.userRole === UserRole.Volunteer) navigate(Paths.homeVolunteer);
      else navigate(Paths.homeNeedy);
    } catch (err: any) {
      // חולץ את ההודעה האמיתית מה-body של השרת
      const serverData = err?.response?.data;
      const message =
        serverData?.message                                    // { message: "Email already in use" }
        ?? serverData?.error                                   // { error: "..." }
        ?? (typeof serverData === 'string' ? serverData : null) // שרת מחזיר string ישיר
        ?? err?.message                                        // fallback גנרי של axios
        ?? 'Something went wrong, please try again';
      setErrors({ server: message });
    } finally {
      setLoading(false);
    }
  };

  const err = (name: keyof Errors) =>
    touched[name] && errors[name] ? (
      <span className="w1-err">{errors[name]}</span>
    ) : null;

  return (
    <div className="w1-root">

      {/* ── LEFT ── */}
      <div className="w1-left">
        <div className="w1-deco-c1" /><div className="w1-deco-c2" /><div className="w1-deco-c3" />

        <div className="w1-logo">
          <div className="w1-logo-icon">🤝</div>
          Together
        </div>

        <div className="w1-mid">
          <div className="w1-tag">✦ Community Platform</div>
          <h1 className="w1-h1">Give help.<br /><em>Receive</em><br />kindness.</h1>
          <p className="w1-p">A space where volunteers and those in need find each other — built on trust, driven by community.</p>
        </div>

        <div className="w1-stats">
          <div className="w1-stat"><div className="w1-stat-n">2.4k</div><div className="w1-stat-l">Volunteers</div></div>
          <div className="w1-stat"><div className="w1-stat-n">850</div><div className="w1-stat-l">Helped</div></div>
          <div className="w1-stat"><div className="w1-stat-n">98%</div><div className="w1-stat-l">Satisfied</div></div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="w1-right">
        <div className="w1-step">New Account</div>
        <h2 className="w1-form-h">Create your<br />free account</h2>

        {errors.server && (
          <div className="w1-banner-err">⚠ {errors.server}</div>
        )}

        <form onSubmit={register} noValidate>
          <div className="w1-grid">

            <div className="w1-f w1-span">
              <label className="w1-lbl">Full Name</label>
              <input
                className={`w1-inp ${touched.fullName && errors.fullName ? 'w1-inp-err' : touched.fullName ? 'w1-inp-ok' : ''}`}
                name="fullName" placeholder="First & last name" required
                onBlur={() => markTouched('fullName')}
              />
              {err('fullName')}
            </div>

            <div className="w1-f w1-span">
              <label className="w1-lbl">Email</label>
              <input
                className={`w1-inp ${touched.email && errors.email ? 'w1-inp-err' : touched.email ? 'w1-inp-ok' : ''}`}
                type="email" name="email" placeholder="you@email.com" required
                onBlur={() => markTouched('email')}
              />
              {err('email')}
            </div>

            <div className="w1-f w1-span">
              <label className="w1-lbl">Password</label>
              <input
                className={`w1-inp ${touched.password && errors.password ? 'w1-inp-err' : touched.password ? 'w1-inp-ok' : ''}`}
                type="password" name="password" placeholder="Min 8 characters" required
                onBlur={() => markTouched('password')}
              />
              {err('password')}
            </div>

            <div className="w1-f">
              <label className="w1-lbl">Phone</label>
              <input
                className={`w1-inp ${touched.phone && errors.phone ? 'w1-inp-err' : touched.phone ? 'w1-inp-ok' : ''}`}
                type="tel" name="phone" placeholder="05X-XXXXXXX"
                onBlur={() => markTouched('phone')}
              />
              {err('phone')}
            </div>

            <div className="w1-f">
              <label className="w1-lbl">Address</label>
              <input
                className={`w1-inp ${touched.adress && errors.adress ? 'w1-inp-err' : touched.adress ? 'w1-inp-ok' : ''}`}
                type="text" name="adress" placeholder="City, Street"
                onBlur={() => markTouched('adress')}
              />
              {err('adress')}
            </div>

          </div>

          <div className="w1-role-lbl">I want to join as</div>
          <div className="w1-roles">
            <div className="w1-rc">
              <input type="radio" name="role" id="w1-vol" value={UserRole.Volunteer} defaultChecked />
              <label className="w1-rl" htmlFor="w1-vol">
                <span className="w1-ri">🤲</span>
                <div><div className="w1-rn">Volunteer</div><div className="w1-rd">I want to help</div></div>
              </label>
            </div>
            <div className="w1-rc">
              <input type="radio" name="role" id="w1-need" value={UserRole.Needy} />
              <label className="w1-rl" htmlFor="w1-need">
                <span className="w1-ri">🙏</span>
                <div><div className="w1-rn">Request Help</div><div className="w1-rd">I need support</div></div>
              </label>
            </div>
          </div>

          <button className="w1-btn" type="submit" disabled={loading}>
            {loading ? <span className="w1-spinner" /> : 'Create Account →'}
          </button>

          <p className="w1-foot">Already a member? <Link to={Paths.login}>Sign in</Link></p>
        </form>
      </div>

    </div>
  );
};