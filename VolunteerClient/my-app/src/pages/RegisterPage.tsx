import { type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { setSession } from '../auth/auth.utils';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { register as registerService } from '../services/auth.service';
import { type RegisterType } from '../types/auth.types';
import { Paths } from '../routes/paths';
import { useAuthContext } from '../auth/useAuthContext';
import { UserRole } from '../types/enums.types';

import '../styles/styleRegister.css';

export const RegisterPage = () => {
  useDocumentTitle('Register');
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  const register = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: RegisterType = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
      adress: formData.get('adress') as string,
      userRole: Number(formData.get('role')),
      categoryIds: [],
      availabilities: [],
    };
    const user = await registerService({ ...data, userRole: data.userRole });
    setSession(user.token);
    setUser(user);
  };

  return (
    <>
      <div className="w1-root">

        {/* LEFT */}
        <div className="w1-left">
          <div className="w1-deco-c1" />
          <div className="w1-deco-c2" />
          <div className="w1-deco-c3" />

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

        {/* RIGHT */}
        <div className="w1-right">
          <div className="w1-step">New Account</div>
          <h2 className="w1-form-h">Create your<br />free account</h2>

          <form onSubmit={register}>
            <div className="w1-grid">
              <div className="w1-f w1-span">
                <label className="w1-lbl">Full Name</label>
                <input className="w1-inp" name="fullName" placeholder="First & last name" required />
              </div>
              <div className="w1-f w1-span">
                <label className="w1-lbl">Email</label>
                <input className="w1-inp" type="email" name="email" placeholder="you@email.com" required />
              </div>
              <div className="w1-f w1-span">
                <label className="w1-lbl">Password</label>
                <input className="w1-inp" type="password" name="password" placeholder="Min 8 characters" required />
              </div>
              <div className="w1-f">
                <label className="w1-lbl">Phone</label>
                <input className="w1-inp" type="tel" name="phone" placeholder="05X-XXXXXXX" />
              </div>
              <div className="w1-f">
                <label className="w1-lbl">Address</label>
                <input className="w1-inp" type="text" name="adress" placeholder="City, Street" />
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

            <button className="w1-btn" type="submit">Create Account →</button>
            <p className="w1-foot">Already a member? <Link to={Paths.login}>Sign in</Link></p>
            
          </form>
        </div>

      </div>
    </>
  );
};