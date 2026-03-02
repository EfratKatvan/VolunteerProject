import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setSession } from '../auth/auth.utils';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  register as registerService,
  type RegisterType,
} from '../services/auth.service';
import { Paths } from '../routes/paths';
import { useAuthContext } from '../auth/useAuthContext';
const Role = {
  Volunteer: 0,
  Needy: 1,
} as const;
type Role = typeof Role[keyof typeof Role];


const RegisterPage = () => {
   
  useDocumentTitle('Register');
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

const register = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const rawData = Object.fromEntries(formData.entries());

  const data: RegisterType = {
    ...rawData,
    role: Number(rawData.role), // 👈 ההמרה החשובה
  } as RegisterType;

  const user = await registerService(data);

  setSession(user.token);
  setUser(user);
  navigate(`/${Paths.home}`);
};

  return (
    <form onSubmit={register}>
      <input name="fullName" placeholder="Full Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="tel" name="phone" placeholder="Phone" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="text" name="address" placeholder="Address" required />

      <div>
        <label>
          <input type="radio" name="role" value={Role.Volunteer} defaultChecked />
          Volunteer
        </label>
        <label>
          <input type="radio" name="role" value={Role.Needy} />
          Request Help
        </label>
      </div>

      <button type="submit">Register</button>
      <span>
        Already have an account? <Link to={`/${Paths.login}`}>Login</Link>
      </span>
    </form>
  );
};