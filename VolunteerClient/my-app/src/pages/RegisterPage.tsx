import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { setSession } from '../auth/auth.utils';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  register as registerService,
} from '../services/auth.service';
import {type RegisterType} from '../types/auth.types';
import { Paths } from '../routes/paths';
import { useAuthContext } from '../auth/useAuthContext';
import { UserRole } from '../types/enums.types';


const RegisterPage = () => {
   
  useDocumentTitle('Register');
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

 const register = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as RegisterType;
    const user = await registerService({ ...data, userRole: UserRole });
    setSession(user.token);
    setUser(user)
    navigate(`/${Paths.home}`)
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
          <input type="radio" name="role" value={UserRole.Volunteer} defaultChecked />
          Volunteer
        </label>
        <label>
          <input type="radio" name="role" value={UserRole.Needy} />
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