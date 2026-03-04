import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { setSession } from '../auth/auth.utils';
import {
  login as loginService,
} from '../services/auth.service';
import { Paths } from '../routes/paths';
import { useAuthContext } from '../auth/useAuthContext';
import { type LoginType } from '../types/auth.types';

export const LoginPage = () => {
  useDocumentTitle('Login');
  const navigate = useNavigate()
  const { setUser } = useAuthContext()

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as LoginType;
    const user = await loginService(data);
    setUser(user)
    setSession(user.token);
    /*navigate(`/${Paths.home}`)*/
  };

  return (
    <form onSubmit={login}>
      <input type='email' name='email' placeholder='Email' />
      <input type='password' name='password' placeholder='Password' />
      <button>Login</button>
      <span>
        don't have an account? <Link to={`/${Paths.register}`}>register</Link>
      </span>
    </form>
  );
};

export default LoginPage;